export function SceneLights() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <pointLight position={[4, 6, 5]} intensity={1.25} color="#00f0ff" />
      <pointLight position={[-4, 2.5, -4]} intensity={0.75} color="#ff0055" />
      <directionalLight position={[0, 7, 4]} intensity={0.5} color="#9befff" />
    </>
  );
}
