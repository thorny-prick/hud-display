import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

const PACKET_COUNT = 180;

export function DataPackets() {
  const visible = useGlitchLabStore((state) => state.visibility.packets);
  const pointsRef = useRef(null);

  const { positions, speeds } = useMemo(() => {
    const positionBuffer = new Float32Array(PACKET_COUNT * 3);
    const speedBuffer = new Float32Array(PACKET_COUNT);

    for (let i = 0; i < PACKET_COUNT; i += 1) {
      const stride = i * 3;
      positionBuffer[stride] = THREE.MathUtils.randFloatSpread(18);
      positionBuffer[stride + 1] = THREE.MathUtils.randFloat(-2, 4);
      positionBuffer[stride + 2] = THREE.MathUtils.randFloatSpread(14);
      speedBuffer[i] = THREE.MathUtils.randFloat(0.006, 0.025);
    }

    return { positions: positionBuffer, speeds: speedBuffer };
  }, []);

  useFrame(() => {
    if (!pointsRef.current || !visible) return;

    const attribute = pointsRef.current.geometry.attributes.position;
    for (let i = 0; i < PACKET_COUNT; i += 1) {
      const stride = i * 3;
      attribute.array[stride + 2] += speeds[i];
      if (attribute.array[stride + 2] > 7) {
        attribute.array[stride + 2] = -7;
      }
    }
    attribute.needsUpdate = true;
  });

  if (!visible) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={PACKET_COUNT} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial size={0.045} color="#00f0ff" transparent opacity={0.58} sizeAttenuation />
    </points>
  );
}
