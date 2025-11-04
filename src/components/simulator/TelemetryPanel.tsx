import { Telemetry } from "@/hooks/useSimulator";
import { Badge } from "@/components/ui/badge";

interface TelemetryPanelProps {
  telemetry: Telemetry;
}

export const TelemetryPanel = ({ telemetry }: TelemetryPanelProps) => {
  return (
    <div className="space-y-3 font-mono text-sm">
      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Position (X, Y, Z):</span>
        <Badge variant="outline">
          {telemetry.position.map(v => v.toFixed(2)).join(", ")}
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Rotation:</span>
        <Badge variant="outline">
          {(telemetry.rotation * 180 / Math.PI).toFixed(1)}°
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Left Motor:</span>
        <Badge variant={telemetry.leftMotor !== 0 ? "default" : "secondary"}>
          {(telemetry.leftMotor * 100).toFixed(0)}%
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Right Motor:</span>
        <Badge variant={telemetry.rightMotor !== 0 ? "default" : "secondary"}>
          {(telemetry.rightMotor * 100).toFixed(0)}%
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-muted-foreground">Ultrasonic Sensor:</span>
        <Badge variant={telemetry.sensors.ultrasonic < 0.5 ? "destructive" : "outline"}>
          {telemetry.sensors.ultrasonic.toFixed(2)}m
        </Badge>
      </div>

      <div className="pt-2 border-t">
        <span className="text-xs text-muted-foreground">
          Last update: {new Date(telemetry.timestamp).toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
};
