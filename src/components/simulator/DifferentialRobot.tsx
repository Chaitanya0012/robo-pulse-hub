import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { useBox, useSphere } from "@react-three/cannon";
import * as THREE from "three";
import { Telemetry } from "@/hooks/useSimulator";

interface DifferentialRobotProps {
  telemetry: Telemetry;
}

export const DifferentialRobot = ({ telemetry }: DifferentialRobotProps) => {
  const wheelBase = 0.12; // 12cm between wheels
  const wheelRadius = 0.03; // 3cm wheel radius

  // Robot body
  const [bodyRef, bodyApi] = useBox(() => ({
    mass: 1,
    position: [0, 0.05, 0],
    args: [0.15, 0.05, 0.1], // width, height, depth
  }));

  // Track current velocity for physics updates
  const velocityRef = useRef({ left: 0, right: 0 });

  useEffect(() => {
    velocityRef.current = {
      left: telemetry.leftMotor,
      right: telemetry.rightMotor,
    };
  }, [telemetry.leftMotor, telemetry.rightMotor]);

  // Update physics based on motor commands
  useFrame(() => {
    const { left, right } = velocityRef.current;
    
    // Differential drive kinematics
    const linearVelocity = ((left + right) / 2) * 0.5; // Scale factor for speed
    const angularVelocity = ((right - left) / wheelBase) * 0.5;

    // Apply velocity to the robot body
    bodyApi.velocity.set(
      linearVelocity * Math.sin(telemetry.rotation),
      0,
      linearVelocity * Math.cos(telemetry.rotation)
    );
    
    bodyApi.angularVelocity.set(0, angularVelocity, 0);
  });

  return (
    <group>
      {/* Robot body */}
      <mesh ref={bodyRef as any} castShadow>
        <boxGeometry args={[0.15, 0.05, 0.1]} />
        <meshStandardMaterial color="#4A90E2" />
      </mesh>

      {/* Left wheel */}
      <mesh position={[-wheelBase / 2, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[wheelRadius, wheelRadius, 0.02, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Right wheel */}
      <mesh position={[wheelBase / 2, 0.03, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[wheelRadius, wheelRadius, 0.02, 16]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Ultrasonic sensor (front) */}
      <mesh position={[0, 0.05, -0.06]} castShadow>
        <boxGeometry args={[0.03, 0.02, 0.02]} />
        <meshStandardMaterial color="#E74C3C" />
      </mesh>

      {/* Direction indicator (arrow on top) */}
      <mesh position={[0, 0.08, -0.03]} rotation={[-Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.02, 0.04, 3]} />
        <meshStandardMaterial color="#F39C12" />
      </mesh>
    </group>
  );
};
