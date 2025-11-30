export const getSimulatorStateTool = {
  name: 'get_simulator_state',
  description:
    'Fetches the current robotics simulator state including sensors, actuators, battery, and environment observations.',
  parameters: {
    type: 'object',
    properties: {
      includeTelemetry: {
        type: 'boolean',
        description: 'Whether to include verbose telemetry metrics',
      },
    },
  },
  handler: async ({ includeTelemetry = false }: { includeTelemetry?: boolean }) => {
    return {
      simulator: 'alpha-sim-01',
      timestamp: new Date().toISOString(),
      pose: { x: 1.25, y: 0.72, heading_deg: 45 },
      battery: { voltage: 11.7, current: 1.8, percentage: 86 },
      sensors: {
        imu: { pitch: 1.2, roll: 0.3, yaw: 44.8 },
        lidar: { obstacles_detected: 2, nearest_m: 0.48 },
        encoders: { left_ticks: 1024, right_ticks: 1038 },
      },
      actuators: {
        motors: { left_pwm: 0.52, right_pwm: 0.55 },
        arm: { joint_angles: [0, 15, -5] },
      },
      telemetry:
        includeTelemetry
          ? {
              loop_hz: 100,
              latency_ms: 12,
              pid: { kp: 0.6, ki: 0.04, kd: 0.1 },
            }
          : undefined,
    }
  },
}
