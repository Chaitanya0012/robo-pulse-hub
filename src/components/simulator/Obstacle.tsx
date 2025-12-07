import { useBox } from "@react-three/cannon";

interface ObstacleProps {
  position: [number, number, number];
  size: [number, number, number];
}

export const Obstacle = ({ position, size }: ObstacleProps) => {
  const [ref] = useBox(() => ({
    mass: 0, // Static object
    position,
    args: size,
  }));

  return (
    <mesh ref={ref as any} castShadow receiveShadow>
      <boxGeometry args={size} />
      <meshStandardMaterial 
        color="#d4a574"
        roughness={0.8}
        metalness={0.2}
        envMapIntensity={0.5}
      />
    </mesh>
  );
};
