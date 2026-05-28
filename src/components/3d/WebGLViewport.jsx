import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense } from 'react';
import { SceneLights } from './SceneLights.jsx';
import { WireFloor } from './WireFloor.jsx';
import { CoordinateAxes } from './CoordinateAxes.jsx';
import { ParametricGraph } from './ParametricGraph.jsx';
import { DataPackets } from './DataPackets.jsx';
import { VectorTracer } from './VectorTracer.jsx';

export function WebGLViewport() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas
        camera={{ position: [7, 5.5, 9], fov: 48, near: 0.1, far: 100 }}
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
      >
        <color attach="background" args={["#08090c"]} />
        <fog attach="fog" args={["#08090c", 10, 34]} />
        <Suspense fallback={null}>
          <SceneLights />
          <WireFloor />
          <CoordinateAxes />
          <ParametricGraph />
          <DataPackets />
          <VectorTracer />
        </Suspense>
        <OrbitControls
          makeDefault
          enableDamping
          dampingFactor={0.08}
          maxPolarAngle={Math.PI * 0.78}
          minDistance={5}
          maxDistance={20}
        />
      </Canvas>
    </div>
  );
}
