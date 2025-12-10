'use client';
import { useRef, useEffect, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial, Float } from '@react-three/drei';
import { EffectComposer, Bloom, ChromaticAberration } from '@react-three/postprocessing';
import { Vector2, AdditiveBlending } from 'three';

// @ts-ignore
import * as random from 'maath/random/dist/maath-random.esm';

// =====================
// 🔧 参数调整区 (PARAMS)
// =====================

// --- 1. 基础配置 ---
const PARTICLE_COUNT = 4000;      // 粒子数量 (越多越密，建议 2000-5000)
const PARTICLE_RADIUS = 5;        // 分布范围 (值越大，粒子越散)

// --- 2. 粒子外观 (Appearance) ---
const PARTICLE_COLOR = "#ffffff"; // 粒子颜色 (推荐白色，配合色散会出彩虹)
const PARTICLE_SIZE = 0.010;      // 粒子大小 (0.005 - 0.02)

// --- 3. 后期特效 (Post-processing) ---
const BLOOM_INTENSITY = 1.5;      // 发光强度 (0 - 3，越大越亮)
const RGB_SHIFT = 0.002;          // 色散偏移量 (0.001 - 0.005，越大 RGB 分离越明显)

// --- 4. 交互时间 (Timing) ---
const IDLE_TIMEOUT = 5000;        // 鼠标不动多少毫秒后开始穿越？(2000 = 2秒)
const INITIAL_IDLE_DELAY = 8500;  // 刚进页面等待多久开始穿越？

// --- 5. 运动速度 (Movement) ---
const CAMERA_FLY_SPEED = 0.1;     // 穿越飞行速度 (0.1 - 2.0)
const CAMERA_RESET_SPEED = 0.01;  // 鼠标动了后，归位速度 (0.01 - 0.1)
const CAMERA_Z_START = 2.5;       // 摄像机初始距离
const MOUSE_SENSITIVITY = 0.5;    // 鼠标晃动灵敏度

// =====================

const globalMouse = { x: 0, y: 0 };

function Particles({ start, isIdle }: { start: boolean, isIdle: boolean }) {
  const ref = useRef<any>(null);
  
  const sphere = useMemo(() => random.inSphere(new Float32Array(PARTICLE_COUNT * 5), { radius: PARTICLE_RADIUS }), []);

  useFrame((state, delta) => {
    if (!ref.current) return;

    // 摄像机逻辑
    if (isIdle) {
      state.camera.position.z -= delta * CAMERA_FLY_SPEED;
    } else {
      state.camera.position.z += (CAMERA_Z_START - state.camera.position.z) * CAMERA_RESET_SPEED;
    }

    // 旋转 & 交互
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
    
    const tx = globalMouse.y * MOUSE_SENSITIVITY;
    const ty = globalMouse.x * MOUSE_SENSITIVITY;
    ref.current.rotation.x += (tx - ref.current.rotation.x) * 0.05;
    ref.current.rotation.y += (ty - ref.current.rotation.y) * 0.05;

    // 入场扩散
    const targetScale = start ? 1 : 0;
    ref.current.scale.lerp({ x: targetScale, y: targetScale, z: targetScale }, 0.05);
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points 
        ref={ref} 
        positions={sphere} 
        stride={3} 
        frustumCulled={false}
        scale={[0, 0, 0]}
      >
        <PointMaterial 
          transparent 
          color={PARTICLE_COLOR} // 使用配置颜色
          size={PARTICLE_SIZE}   // 使用配置大小
          sizeAttenuation={true} 
          depthWrite={false} 
          blending={AdditiveBlending} 
        />
      </Points>
    </group>
  );
}

export default function ParticleScene({ start = false }: { start?: boolean }) {
  const [isIdle, setIsIdle] = useState(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const handleMove = (e: MouseEvent) => {
      globalMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
      globalMouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
      
      setIsIdle(false);
      clearTimeout(timer);
      timer = setTimeout(() => { setIsIdle(true); }, IDLE_TIMEOUT);
    };

    window.addEventListener('mousemove', handleMove);
    timer = setTimeout(() => { setIsIdle(true); }, INITIAL_IDLE_DELAY);

    return () => {
      window.removeEventListener('mousemove', handleMove);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="w-full h-full absolute inset-0 pointer-events-none">
      <Canvas camera={{ position: [0, 0, CAMERA_Z_START] }} dpr={[1, 2]} frameloop="always">
        <color attach="background" args={['#000']} />
        <Float speed={1} rotationIntensity={0.5} floatIntensity={0.5}>
          <Particles start={start} isIdle={isIdle} />
        </Float>
        <EffectComposer multisampling={0}>
          {/* 使用配置的参数 */}
          <Bloom luminanceThreshold={0} luminanceSmoothing={0.9} height={300} intensity={BLOOM_INTENSITY} />
          <ChromaticAberration offset={new Vector2(RGB_SHIFT, RGB_SHIFT)} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
