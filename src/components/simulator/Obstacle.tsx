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
      <meshStandardMaterial color="#8B4513" />
    </mesh>
  );
};
