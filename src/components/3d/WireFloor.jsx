import { useMemo } from 'react';
import * as THREE from 'three';
import { useGlitchLabStore } from '../../store/glitchLabStore.js';

export function WireFloor() {
  const showGrid = useGlitchLabStore((state) => state.visibility.grid);

  const primaryGrid = useMemo(() => {
    const grid = new THREE.GridHelper(42, 42, '#00f0ff', '#12313a');
    grid.material.transparent = true;
    grid.material.opacity = 0.32;
    return grid;
  }, []);

  const secondaryGrid = useMemo(() => {
    const grid = new THREE.GridHelper(84, 28, '#ff0055', '#151923');
    grid.material.transparent = true;
    grid.material.opacity = 0.14;
    return grid;
  }, []);

  if (!showGrid) return null;

  return (
    <group position={[0, -2.65, 0]}>
      <primitive object={primaryGrid} />
      <primitive object={secondaryGrid} rotation={[0, Math.PI / 4, 0]} />
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[42, 42, 28, 28]} />
        <meshBasicMaterial wireframe transparent opacity={0.045} color="#00f0ff" />
      </mesh>
    </group>
  );
}
