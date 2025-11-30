import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Download, Cpu, Zap, Radio, Bug, Sparkles } from "lucide-react";
import Navigation from "@/components/Navigation";
import Editor from "@monaco-editor/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const defaultCode = `// Arduino-style robot code
void setup() {
  pinMode(LED_BUILTIN, OUTPUT);
  pinMode(2, OUTPUT); // Motor A
  pinMode(3, OUTPUT); // Motor B
  Serial.begin(9600);
}

void loop() {
  digitalWrite(LED_BUILTIN, HIGH);
  delay(500);
  digitalWrite(LED_BUILTIN, LOW);
  delay(500);

  digitalWrite(2, HIGH);
  digitalWrite(3, LOW);
  delay(1000);

  Serial.println("Robot moving...");
}`;

const boardPresets = {
  "arduino-uno": {
    name: "Arduino Uno",
    color: "from-cyan-500/70 to-emerald-500/60",
    label: "ARDUINO UNO",
    lanes: 10,
  },
  "arduino-nano": {
    name: "Arduino Nano",
    color: "from-indigo-500/70 to-blue-500/60",
    label: "ARDUINO NANO",
    lanes: 8,
  },
  esp32: {
    name: "ESP32 DevKit",
    color: "from-purple-500/70 to-pink-500/60",
    label: "ESP32 DEVKIT",
    lanes: 12,
  },
};

const Simulator = () => {
  const [code, setCode] = useState(defaultCode);
  const [isRunning, setIsRunning] = useState(false);
  const [serialOutput, setSerialOutput] = useState<string[]>([
    "💡 Tip: Type code, then hit Run to validate and stream live output.",
  ]);
  const [ledState, setLedState] = useState(false);
  const [board, setBoard] = useState<keyof typeof boardPresets>("arduino-uno");
  const [diagnostics, setDiagnostics] = useState<{
    errors: string[];
    warnings: string[];
    signals: string[];
    ledUsage: boolean;
    script: string[];
  }>({
    errors: [],
    warnings: [],
    signals: [],
    ledUsage: true,
    script: [],
  });
  const [simulationState, setSimulationState] = useState<
    "idle" | "running" | "paused" | "error"
  >("idle");

  const currentBoard = useMemo(() => boardPresets[board], [board]);

  const analyzeCode = (sketch: string) => {
    const normalized = sketch.toLowerCase();
    const errors: string[] = [];
    const warnings: string[] = [];
    const signals: string[] = [];
    const script: string[] = [];

    if (!normalized.includes("setup")) {
      errors.push("Missing setup() function – pins are never initialized.");
    }
    if (!normalized.includes("loop")) {
      errors.push("Missing loop() function – the firmware will exit immediately.");
    }
    if (!/serial\.(begin|print)/i.test(sketch)) {
      warnings.push("No Serial usage detected – serial monitor will be quiet.");
    }
    if (!/pinmode\s*\(/i.test(sketch)) {
      warnings.push("No pinMode calls found – pins may float in simulation.");
    }

    const digitalWrites = Array.from(
      sketch.matchAll(/digitalWrite\s*\(([^,]+),\s*(HIGH|LOW)\)/gi)
    ).map((match) => `${match[1].trim()} → ${match[2].toUpperCase()}`);

    if (digitalWrites.length > 0) {
      signals.push(`Detected ${digitalWrites.length} digital writes`);
      script.push(...digitalWrites.map((dw) => `[Pins] digitalWrite ${dw}`));
    }

    const serialEvents = Array.from(
      sketch.matchAll(/Serial\.(print|println)\s*\(([^)]+)\)/gi)
    ).map((match) => match[2].trim());

    if (serialEvents.length > 0) {
      script.push(...serialEvents.map((msg) => `[Serial] ${msg.replace(/"/g, "")}`));
    }

    if (script.length === 0) {
      script.push(
        "[Loop] Cycle complete with no I/O – add Serial.println or digitalWrite for richer output."
      );
    }

    return {
      errors,
      warnings,
      signals,
      ledUsage: digitalWrites.some((dw) => dw.toLowerCase().includes("led_builtin")),
      script,
    };
  };

  useEffect(() => {
    if (!isRunning) return;

    let step = 0;
    const interval = setInterval(() => {
      const message = diagnostics.script[step % diagnostics.script.length];
      setSerialOutput((prev) => [...prev, message]);
      setLedState((prev) => (diagnostics.ledUsage ? !prev : false));
      step += 1;
    }, 900);

    return () => clearInterval(interval);
  }, [diagnostics.ledUsage, diagnostics.script, isRunning]);

  const handleRun = () => {
    if (isRunning) {
      setSimulationState("paused");
      setIsRunning(false);
      setSerialOutput((prev) => [...prev, "⏸️ Simulation paused"]);
      return;
    }

    const result = analyzeCode(code);
    setDiagnostics(result);

    if (result.errors.length > 0) {
      setSimulationState("error");
      setSerialOutput((prev) => [
        ...prev,
        "⛔ Build failed – fix the issues below:",
        ...result.errors.map((err) => `• ${err}`),
      ]);
      setIsRunning(false);
      return;
    }

    setSerialOutput((prev) => [
      ...prev,
      "✅ Build succeeded. Streaming from virtual MCU...",
      ...result.warnings.map((warn) => `⚠️ ${warn}`),
      result.script[0],
    ]);
    setSimulationState("running");
    setIsRunning(true);
  };

  const handleReset = () => {
    setIsRunning(false);
    setLedState(false);
    setDiagnostics({ errors: [], warnings: [], signals: [], ledUsage: true, script: [] });
    setSimulationState("idle");
    setSerialOutput(["🧹 Cleared. Paste code and hit Run to simulate again."]);
  };

  return (
    <div className="min-h-screen bg-gradient-cosmic">
      <Navigation />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Cpu className="h-5 w-5 text-primary" />
              <h1 className="text-4xl font-bold">Robot Simulator</h1>
            </div>
            <p className="text-muted-foreground">Wokwi-inspired electronics playground with quick board switching</p>
          </div>
          <div className="flex items-center gap-3">
            <Select value={board} onValueChange={(value: keyof typeof boardPresets) => setBoard(value)}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="Choose board" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="arduino-uno">Arduino Uno</SelectItem>
                <SelectItem value="arduino-nano">Arduino Nano</SelectItem>
                <SelectItem value="esp32">ESP32 DevKit</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="secondary" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export Sketch
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="p-6 glass-card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Code Editor</h2>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleRun} className={isRunning ? "bg-orange-500" : "bg-green-500"}>
                  {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
                  {isRunning ? "Pause" : "Run"}
                </Button>
                <Button size="sm" variant="outline" onClick={handleReset}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
              </div>
            </div>

            <div className="border border-border/50 rounded-lg overflow-hidden h-[500px]">
              <Editor
                height="100%"
                defaultLanguage="cpp"
                theme="vs-dark"
                value={code}
                onChange={(value) => setCode(value || "")}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                }}
              />
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6 glass-card">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Virtual Board</h2>
                  <p className="text-xs text-muted-foreground">{currentBoard.name} · live LED feedback</p>
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Radio className={`h-3 w-3 ${isRunning ? "text-green-400" : "text-muted-foreground"}`} />
                  {simulationState === "error" ? "Error" : isRunning ? "Live" : "Idle"}
                </div>
              </div>
              <div className={`relative rounded-xl p-6 min-h-[320px] border bg-gradient-to-br ${currentBoard.color} overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20" />
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between text-white text-xs font-mono">
                    <span>{currentBoard.label}</span>
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3" /> 5V rail
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 shadow-inner">
                      <div className="text-white/80 text-xs mb-2">Digital Pins</div>
                      <div className="grid grid-cols-5 gap-2 text-[10px] text-white/90">
                        {[...Array(currentBoard.lanes).keys()].map((lane) => (
                          <div key={lane} className="px-2 py-1 rounded bg-white/10 border border-white/5 text-center">
                            D{lane + 2}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-black/30 rounded-lg p-4 border border-white/10 shadow-inner">
                      <div className="text-white/80 text-xs mb-2">Power & Analog</div>
                      <div className="flex flex-wrap gap-2 text-[10px] text-white/90">
                        {["5V", "3V3", "GND", "VIN", "A0", "A1", "A2", "A3", "A4", "A5"].map((label) => (
                          <div key={label} className="px-2 py-1 rounded bg-white/10 border border-white/5">
                            {label}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-full shadow-lg border-4 border-white/40 transition-all duration-300 ${
                        ledState && diagnostics.ledUsage ? "bg-yellow-300 shadow-glow-cyan" : "bg-white/20"
                      }`}
                    />
                    <div className="text-white text-sm">
                      <div className="font-semibold">Built-in LED</div>
                      <p className="text-white/80 text-xs">
                        {diagnostics.ledUsage
                          ? "Toggles when code hits digitalWrite(LED_BUILTIN, ...)"
                          : "Add LED_BUILTIN writes to visualize activity"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <h2 className="text-xl font-semibold mb-4">Serial Monitor</h2>
              <div className="bg-black/50 rounded-lg p-4 h-[200px] overflow-y-auto font-mono text-sm">
                {serialOutput.length === 0 ? (
                  <div className="text-gray-500">Waiting for output...</div>
                ) : (
                  serialOutput.map((line, i) => (
                    <div key={i} className="text-green-400 mb-1">{line}</div>
                  ))
                )}
              </div>
            </Card>

            <Card className="p-6 glass-card">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold">Compilation &amp; Health</h2>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    simulationState === "running"
                      ? "bg-emerald-500/15 text-emerald-400"
                      : simulationState === "error"
                        ? "bg-red-500/15 text-red-400"
                        : simulationState === "paused"
                          ? "bg-amber-500/15 text-amber-400"
                          : "bg-slate-500/15 text-slate-300"
                  }`}
                >
                  {simulationState === "running"
                    ? "Running"
                    : simulationState === "error"
                      ? "Build errors"
                      : simulationState === "paused"
                        ? "Paused"
                        : "Idle"}
                </div>
              </div>

              <div className="space-y-2 text-sm">
                {diagnostics.errors.length === 0 ? (
                  <div className="flex items-center gap-2 text-emerald-400">
                    <Sparkles className="h-4 w-4" />
                    Sketch passes quick validation
                  </div>
                ) : (
                  diagnostics.errors.map((err, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-red-300">
                      <Bug className="h-4 w-4 mt-0.5" />
                      <span>{err}</span>
                    </div>
                  ))
                )}

                {diagnostics.warnings.map((warn, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-amber-300">
                    <Radio className="h-4 w-4 mt-0.5" />
                    <span>{warn}</span>
                  </div>
                ))}

                {diagnostics.signals.length > 0 && (
                  <div className="pt-2 text-xs text-muted-foreground">
                    Signals detected: {diagnostics.signals.join(", ")}
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Simulator;
