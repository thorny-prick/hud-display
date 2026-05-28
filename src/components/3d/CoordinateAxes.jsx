import { Line, Text } from '@react-three/drei';

export function CoordinateAxes() {
  return (
    <group position={[0, 0, 0]}>
      <Line points={[[-8.5, 0, 0], [8.5, 0, 0]]} color="#00f0ff" lineWidth={1.5} transparent opacity={0.8} />
      <Line points={[[0, -4.5, 0], [0, 4.5, 0]]} color="#00f0ff" lineWidth={1.5} transparent opacity={0.8} />
      <Line points={[[0, 0, -5.5], [0, 0, 5.5]]} color="#64748b" lineWidth={0.75} transparent opacity={0.45} />

      {[-6, -4, -2, 2, 4, 6].map((tick) => (
        <Line key={`x-${tick}`} points={[[tick, -0.08, 0], [tick, 0.08, 0]]} color="#00f0ff" lineWidth={0.75} transparent opacity={0.55} />
      ))}
      {[-4, -2, 2, 4].map((tick) => (
        <Line key={`y-${tick}`} points={[[-0.08, tick, 0], [0.08, tick, 0]]} color="#00f0ff" lineWidth={0.75} transparent opacity={0.55} />
      ))}

      <Text position={[8.9, 0, 0]} fontSize={0.28} color="#00f0ff" anchorX="center" anchorY="middle">
        X
      </Text>
      <Text position={[0, 4.85, 0]} fontSize={0.28} color="#00f0ff" anchorX="center" anchorY="middle">
        Y
      </Text>
      <Text position={[0, 0, 5.85]} fontSize={0.22} color="#64748b" anchorX="center" anchorY="middle">
        Z telemetry
      </Text>
    </group>
  );
}
