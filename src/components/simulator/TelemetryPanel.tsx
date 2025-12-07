import { Telemetry } from "@/hooks/useSimulator";
import { Activity, Gauge, Radio, Navigation2 } from "lucide-react";

interface TelemetryPanelProps {
  telemetry: Telemetry;
}

export const TelemetryPanel = ({ telemetry }: TelemetryPanelProps) => {
  const getMotorColor = (value: number) => {
    const intensity = Math.abs(value);
    if (intensity > 0.7) return "text-success";
    if (intensity > 0.3) return "text-warning";
    return "text-muted-foreground";
  };

  const getSensorColor = (distance: number) => {
    if (distance < 0.3) return "text-destructive";
    if (distance < 0.8) return "text-warning";
    return "text-success";
  };

  return (
    <div className="glass-card p-4 rounded-lg space-y-3">
      {/* Position */}
      <div className="flex items-center gap-3 pb-2 border-b border-border/30">
        <Navigation2 className="w-4 h-4 text-primary" />
        <div className="flex-1 grid grid-cols-2 gap-2 font-mono text-xs">
          <div>
            <span className="text-muted-foreground">X:</span>
            <span className="ml-2 text-foreground font-semibold">{telemetry.position[0].toFixed(3)}m</span>
          </div>
          <div>
            <span className="text-muted-foreground">Z:</span>
            <span className="ml-2 text-foreground font-semibold">{telemetry.position[2].toFixed(3)}m</span>
          </div>
        </div>
      </div>

      {/* Rotation */}
      <div className="flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-secondary" />
          <span className="text-muted-foreground">Heading:</span>
        </div>
        <span className="text-foreground font-semibold">
          {(telemetry.rotation * (180 / Math.PI)).toFixed(1)}°
        </span>
      </div>

      {/* Motors */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <Gauge className="w-4 h-4 text-accent" />
          <span className="text-xs font-semibold text-muted-foreground">MOTOR STATUS</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="glass-card p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">LEFT</div>
            <div className={`font-mono text-lg font-bold ${getMotorColor(telemetry.leftMotor)}`}>
              {(telemetry.leftMotor * 100).toFixed(0)}%
            </div>
            <div className="w-full bg-background/50 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${Math.abs(telemetry.leftMotor) * 100}%` }}
              />
            </div>
          </div>
          <div className="glass-card p-2 rounded">
            <div className="text-xs text-muted-foreground mb-1">RIGHT</div>
            <div className={`font-mono text-lg font-bold ${getMotorColor(telemetry.rightMotor)}`}>
              {(telemetry.rightMotor * 100).toFixed(0)}%
            </div>
            <div className="w-full bg-background/50 h-1 rounded-full mt-1 overflow-hidden">
              <div 
                className="h-full bg-primary transition-all duration-200"
                style={{ width: `${Math.abs(telemetry.rightMotor) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Sensors */}
      <div className="pt-2 border-t border-border/30">
        <div className="flex items-center gap-2 mb-2">
          <Radio className="w-4 h-4 text-info" />
          <span className="text-xs font-semibold text-muted-foreground">SENSORS</span>
        </div>
        <div className="glass-card p-3 rounded">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Ultrasonic</span>
            <div className="flex items-center gap-2">
              <span className={`font-mono text-sm font-bold ${getSensorColor(telemetry.sensors.ultrasonic)}`}>
                {telemetry.sensors.ultrasonic.toFixed(3)}m
              </span>
              <div className={`w-2 h-2 rounded-full ${
                telemetry.sensors.ultrasonic < 0.3 ? 'bg-destructive animate-glow-pulse' : 
                telemetry.sensors.ultrasonic < 0.8 ? 'bg-warning' : 
                'bg-success'
              }`} />
            </div>
          </div>
        </div>
      </div>

      {/* Status indicator */}
      <div className="pt-2 text-center">
        <div className="inline-flex items-center gap-2 text-xs text-primary/60 font-mono">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-glow-pulse" />
          <span>SIM ACTIVE</span>
        </div>
      </div>
    </div>
  );
};
