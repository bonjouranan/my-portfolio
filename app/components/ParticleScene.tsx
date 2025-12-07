'use client';
import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2 } from 'three';

// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

// 全局鼠标位置 (不用 React State，为了极致性能直接用 Mutable Ref 思想)
// 把它放在组件外面，避免重新渲染
const globalMouse = { x: 0, y: 0 };

function Particles(props: any) {
  const ref = useRef<any>(null);
  const sphere = random.inSphere(new Float32Array(1800 * 3), { radius: 1.5 });

  // 1. 监听全局鼠标移动
  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      // 归一化鼠标位置 (-1 到 1)
      globalMouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      globalMouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      // 2. 降低自转速度 (delta / 20)
      ref.current.rotation.x -= delta / 20; 
      ref.current.rotation.y -= delta / 30;

      // 3. 使用全局鼠标位置 (globalMouse) 而不是 Canvas 鼠标
      const targetX = globalMouse.y * 0.3; // 灵敏度 0.3
      const targetY = globalMouse.x * 0.3;

      // 平滑插值
      ref.current.rotation.x += (targetX - ref.current.rotation.x) * 0.05;
      ref.current.rotation.y += (targetY - ref.current.rotation.y) * 0.05;
    }
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
    <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 2]}>
      <color attach="background" args={['#000']} />
      {/* 浮动强度也稍微调小一点，让它更稳 */}
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <Particles />
      </Float>
      <EffectComposer multisampling={0}>
        <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={0.5} />
        <ChromaticAberration offset={new Vector2(0.002, 0.002)} />
      </EffectComposer>
    </Canvas>
  );
}
