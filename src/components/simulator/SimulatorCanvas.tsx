import { Canvas } from "@react-three/fiber";
import { OrbitControls, Grid, Sky } from "@react-three/drei";
import { Physics } from "@react-three/cannon";
import { DifferentialRobot } from "./DifferentialRobot";
import { Obstacle } from "./Obstacle";
import { Telemetry } from "@/hooks/useSimulator";

interface SimulatorCanvasProps {
  telemetry: Telemetry;
}

export const SimulatorCanvas = ({ telemetry }: SimulatorCanvasProps) => {
  return (
    <div className="w-full h-[400px] bg-gradient-to-b from-sky-200 to-sky-50 rounded-lg overflow-hidden">
      <Canvas camera={{ position: [3, 3, 3], fov: 50 }}>
        <Sky sunPosition={[100, 20, 100]} />
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
        
        <Physics gravity={[0, -9.81, 0]}>
          <DifferentialRobot telemetry={telemetry} />
          
          {/* Floor */}
          <mesh receiveShadow position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[20, 20]} />
            <meshStandardMaterial color="#90EE90" />
          </mesh>
          
          {/* Obstacles */}
          <Obstacle position={[1.5, 0.25, 0]} size={[0.3, 0.5, 0.3]} />
          <Obstacle position={[-1, 0.25, 1]} size={[0.4, 0.5, 0.4]} />
          <Obstacle position={[0, 0.25, -1.5]} size={[0.5, 0.5, 0.3]} />
        </Physics>
        
        <Grid args={[20, 20]} cellSize={0.5} cellColor="#6e6e6e" sectionColor="#4e4e4e" fadeDistance={30} />
        <OrbitControls makeDefault />
      </Canvas>
    </div>
  );
};
