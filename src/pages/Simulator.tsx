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
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-4xl font-bold mb-2">Robot Simulator</h1>
          <p className="text-muted-foreground">
            Program and test your robot in a 3D physics simulation
          </p>
        </div>

        <div className="flex gap-4 mb-4">
          <Button onClick={handleRun} variant={isRunning ? "destructive" : "default"}>
            {isRunning ? (
              <>
                <Square className="w-4 h-4 mr-2" />
                Stop
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Run
              </>
            )}
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Card className="p-4">
            <h2 className="text-lg font-semibold mb-4">Code Editor</h2>
            <CodeEditor value={code} onChange={setCode} readOnly={isRunning} />
          </Card>

          <div className="space-y-4">
            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">3D Simulation</h2>
              <SimulatorCanvas telemetry={telemetry} />
            </Card>

            <Card className="p-4">
              <h2 className="text-lg font-semibold mb-4">Telemetry</h2>
              <TelemetryPanel telemetry={telemetry} />
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
