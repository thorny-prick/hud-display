import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';
import { sampleExpression } from '../../utils/expressionSampler.js';

export function ParametricGraph() {
  const rawExpression = useGlitchLabStore((state) => state.rawExpression);
  const activeStepId = useGlitchLabStore((state) => state.activeStepId);
  const visible = useGlitchLabStore((state) => state.visibility.functionLine);

  const graphPoints = useMemo(() => {
    return sampleExpression(rawExpression, activeStepId).filter((point) => Number.isFinite(point.y));
  }, [rawExpression, activeStepId]);

  if (!visible || graphPoints.length < 2) return null;

  return (
    <group>
      <Line points={graphPoints} color="#00f0ff" lineWidth={3} transparent opacity={0.9} />
      <Line points={graphPoints} color="#ff0055" lineWidth={1} transparent opacity={0.5} />
      <mesh position={graphPoints[Math.floor(graphPoints.length * 0.62)]}>
        <sphereGeometry args={[0.12, 18, 18]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={1.8} />
      </mesh>
    </group>
  );
}
