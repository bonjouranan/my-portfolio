'use client';
import { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import * as random from 'maath/random/dist/maath-random.esm';
import { Vector2 } from 'three';

function Particles(props: any) {
  const ref = useRef<any>();
  const sphere = random.inSphere(new Float32Array(3000 * 3), { radius: 1.5 });
  const { mouse } = useThree(); // 获取鼠标

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;

    // 鼠标交互
    const targetX = mouse.y * 0.5;
    const targetY = mouse.x * 0.5;
    ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.1;
    ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.1;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial transparent color="#fff" size={0.005} sizeAttenuation={true} depthWrite={false} />
      </Points>
    </group>
  );
}

export default function ParticleScene() {
  return (
    <Canvas camera={{ position: [0, 0, 1] }}>
      <color attach="background" args={['#000']} />
      <Float speed={2} rotationIntensity={1} floatIntensity={1}>
        <Particles />
      </Float>
      <EffectComposer>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.5} />
        <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
      </EffectComposer>
    </Canvas>
  );
}
