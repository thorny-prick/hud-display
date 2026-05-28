import { useMemo } from 'react';
import { Line } from '@react-three/drei';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

export function VectorTracer() {
  const activeStepId = useGlitchLabStore((state) => state.activeStepId);
  const steps = useGlitchLabStore((state) => state.solutionSteps);
  const visible = useGlitchLabStore((state) => state.visibility.vectorTracer);

  const activeStep = useMemo(() => steps.find((step) => step.id === activeStepId) ?? steps[0], [activeStepId, steps]);

  if (!visible || !activeStep) return null;

  const target = [activeStep.vector[0] * 2, activeStep.vector[1] * 1.25, activeStep.vector[2] * -1];

  return (
    <group>
      <Line points={[[0, 0, 0], target]} color="#ff0055" lineWidth={2.5} transparent opacity={0.85} />
      <mesh position={target}>
        <octahedronGeometry args={[0.18, 0]} />
        <meshStandardMaterial color="#ff0055" emissive="#ff0055" emissiveIntensity={1.4} />
      </mesh>
      <Line
        points={[
          [target[0], target[1], target[2]],
          [target[0], -2.65, target[2]],
        ]}
        color="#ff0055"
        lineWidth={0.9}
        transparent
        opacity={0.38}
      />
    </group>
  );
}
