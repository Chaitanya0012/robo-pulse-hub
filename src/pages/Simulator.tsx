import { useState } from "react";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Play, Square, RotateCcw } from "lucide-react";
import { SimulatorCanvas } from "@/components/simulator/SimulatorCanvas";
import { CodeEditor } from "@/components/simulator/CodeEditor";
import { TelemetryPanel } from "@/components/simulator/TelemetryPanel";
import { useSimulator } from "@/hooks/useSimulator";

const defaultCode = `// Control your differential-drive robot
// Available API:
// - setMotor(left, right) - Set motor speeds (-1 to 1)
// - readSensor(name) - Read sensor value
// - sleep(ms) - Wait for milliseconds

async function main() {
  // Move forward
  setMotor(0.5, 0.5);
  await sleep(2000);
  
  // Read ultrasonic sensor
  const distance = await readSensor("ultrasonic");
  console.log("Distance:", distance);
  
  // Turn if obstacle detected
  if (distance < 0.3) {
    setMotor(-0.3, 0.3); // Turn left
    await sleep(1000);
  }
  
  // Stop
  setMotor(0, 0);
}

main();`;

export default function Simulator() {
  const [code, setCode] = useState(defaultCode);
  const {
    isRunning,
    telemetry,
    startSimulation,
    stopSimulation,
    resetSimulation,
    executeCode,
  } = useSimulator();

  const handleRun = () => {
    if (isRunning) {
      stopSimulation();
    } else {
      startSimulation();
      executeCode(code);
    }
  };

  const handleReset = () => {
    resetSimulation();
    setCode(defaultCode);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-background/95">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 animate-slide-up">
          <h1 className="text-5xl font-bold mb-3 text-shimmer">
            Robot Simulator
          </h1>
          <p className="text-lg text-muted-foreground flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
            Program and test your robot in a 3D physics simulation
          </p>
        </div>

        {/* Control Panel */}
        <div className="flex gap-3 mb-6 animate-fade-in">
          <Button 
            onClick={handleRun} 
            size="lg"
            className={isRunning ? "shadow-glow-purple" : "shadow-glow-cyan"}
            variant={isRunning ? "destructive" : "default"}
          >
            {isRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop Simulation
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run Simulation
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline" size="lg" className="glass-card">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Code Editor - Takes 2 columns */}
          <div className="xl:col-span-2 space-y-6">
            <div className="glass-card p-6 rounded-lg glow-border animate-reveal">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-1 h-6 bg-primary rounded-full" />
                  Code Editor
                </h2>
                <span className="text-xs font-mono text-muted-foreground">
                  {isRunning ? "READ ONLY" : "EDIT MODE"}
                </span>
              </div>
              <CodeEditor value={code} onChange={setCode} readOnly={isRunning} />
            </div>

            {/* 3D Simulation */}
            <div className="glass-card p-6 rounded-lg glow-border animate-reveal" style={{ animationDelay: '0.1s' }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                  <span className="w-1 h-6 bg-secondary rounded-full" />
                  3D Simulation
                </h2>
                <div className="flex items-center gap-2 text-xs font-mono text-primary">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                  LIVE
                </div>
              </div>
              <SimulatorCanvas telemetry={telemetry} />
            </div>
          </div>

          {/* Telemetry Panel - 1 column */}
          <div className="xl:col-span-1 animate-reveal" style={{ animationDelay: '0.2s' }}>
            <div className="sticky top-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-1 h-6 bg-accent rounded-full" />
                <h2 className="text-xl font-bold text-foreground">Telemetry</h2>
              </div>
              <TelemetryPanel telemetry={telemetry} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
