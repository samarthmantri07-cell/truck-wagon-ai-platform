'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Grid, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { useRef, useMemo, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import { AuroraVertexShader, AuroraFragmentShader, SilkVertexShader, SilkFragmentShader } from './Shaders';

/* =========================================================================
   LAYER 2: PROCEDURAL AURORA (Background)
   ========================================================================= */
function AuroraLayer() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uResolution: { value: new THREE.Vector2(
      typeof window !== 'undefined' ? window.innerWidth : 1920,
      typeof window !== 'undefined' ? window.innerHeight : 1080
    ) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, -10]} scale={[30, 20, 1]}>
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={AuroraVertexShader}
        fragmentShader={AuroraFragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
      />
    </mesh>
  );
}

/* =========================================================================
   LAYER 1: ANIMATED SILK FLOW
   ========================================================================= */
function SilkLayer() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const { mouse } = useThree();
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(0.5, 0.5) }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
      // Convert normalized device coordinates to 0-1 for shader
      materialRef.current.uniforms.uMouse.value.x = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.x, 
        mouse.x * 0.5 + 0.5, 
        0.1
      );
      materialRef.current.uniforms.uMouse.value.y = THREE.MathUtils.lerp(
        materialRef.current.uniforms.uMouse.value.y, 
        mouse.y * 0.5 + 0.5, 
        0.1
      );
    }
  });

  return (
    <mesh ref={meshRef} position={[0, -2, -3]} rotation={[-Math.PI / 4, 0, 0]} scale={[15, 15, 1]}>
      <planeGeometry args={[1, 1, 128, 128]} />
      <shaderMaterial 
        ref={materialRef}
        vertexShader={SilkVertexShader}
        fragmentShader={SilkFragmentShader}
        uniforms={uniforms}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

/* =========================================================================
   LAYER 6: DYNAMIC GRID
   Very subtle engineering grid
   ========================================================================= */
function DynamicGrid() {
  const gridRef = useRef<THREE.Group>(null);
  
  useFrame((state) => {
    if (!gridRef.current) return;
    // Slow drift
    gridRef.current.position.z = (state.clock.elapsedTime * 0.1) % 1;
  });

  return (
    <group ref={gridRef}>
      <Grid 
        args={[100, 100]} 
        position={[0, -2, 0]} 
        cellColor="rgba(59, 118, 240, 0.04)" 
        sectionColor="rgba(59, 118, 240, 0.04)" 
        sectionThickness={0.8}
        cellThickness={0.4}
        fadeDistance={20}
        fadeStrength={1}
      />
    </group>
  );
}

/* =========================================================================
   LAYER 4: GLASS RIBBONS (Floating translucent objects)
   ========================================================================= */
function GlassObjects() {
  const groupRef = useRef<THREE.Group>(null);
  const { mouse } = useThree();

  const glassMaterial = useMemo(() => new THREE.MeshPhysicalMaterial({
    color: '#ffffff',
    metalness: 0.1,
    roughness: 0.1,
    transmission: 1, // Add glass-like transparency
    ior: 1.5,
    thickness: 1.5,
    envMapIntensity: 1,
    clearcoat: 1,
    clearcoatRoughness: 0.1,
  }), []);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Slow organic rotation
    groupRef.current.rotation.y = t * 0.1;
    groupRef.current.rotation.x = Math.sin(t * 0.05) * 0.2;
    
    // Mouse parallax
    groupRef.current.position.x = THREE.MathUtils.lerp(groupRef.current.position.x, mouse.x * 0.5, 0.05);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, mouse.y * 0.5, 0.05);
  });

  return (
    <group ref={groupRef}>
      <mesh material={glassMaterial} position={[-3, 1, -2]}>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
      </mesh>
      <mesh material={glassMaterial} position={[3, -1, 1]} rotation={[0, Math.PI / 4, 0]}>
        <torusGeometry args={[1.5, 0.4, 32, 64]} />
      </mesh>
    </group>
  );
}

/* =========================================================================
   LAYER 3: FLOW FIELD PARTICLES
   ========================================================================= */
const PARTICLE_COUNT = 1500;
function FlowFieldLayer() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const { mouse } = useThree();
  
  // Dummy object to calculate matrix transforms
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  // Store initial positions, phases, and speeds
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      arr.push({
        x: (Math.random() - 0.5) * 25,
        y: (Math.random() - 0.5) * 15,
        z: (Math.random() - 0.5) * 8 - 2,
        speed: Math.random() * 0.01 + 0.002,
        offset: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.04 + 0.01
      });
    }
    return arr;
  }, []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.elapsedTime;
    
    // Mouse world pos approximate
    const mx = mouse.x * 12;
    const my = mouse.y * 8;

    particles.forEach((p, i) => {
      // Flow field movement using sine waves
      p.x += Math.sin(p.y * 0.5 + t * 0.5 + p.offset) * p.speed;
      p.y += Math.cos(p.x * 0.5 + t * 0.5 + p.offset) * p.speed;
      
      // Gentle mouse attraction/repulsion
      const dx = mx - p.x;
      const dy = my - p.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 4) {
        p.x += (dx / dist) * 0.02;
        p.y += (dy / dist) * 0.02;
      }
      
      // Wrap around screen
      if (p.x > 12.5) p.x = -12.5;
      if (p.x < -12.5) p.x = 12.5;
      if (p.y > 7.5) p.y = -7.5;
      if (p.y < -7.5) p.y = 7.5;

      dummy.position.set(p.x, p.y, p.z);
      dummy.scale.setScalar(p.scale);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, PARTICLE_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
    </instancedMesh>
  );
}

/* =========================================================================
   LAYER 5 & 7: LIGHT SWEEP & NOISE
   ========================================================================= */
function ScreenSpaceEffects() {
  const materialRef = useRef<THREE.ShaderMaterial>(null);
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 }
  }), []);

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value = state.clock.elapsedTime;
    }
  });

  return (
    <mesh position={[0, 0, 4.9]} scale={[20, 10, 1]}>
      {/* Plane right in front of camera */}
      <planeGeometry args={[1, 1]} />
      <shaderMaterial 
        ref={materialRef}
        transparent={true}
        depthWrite={false}
        depthTest={false}
        uniforms={uniforms}
        vertexShader={`
          varying vec2 vUv;
          void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform float uTime;
          varying vec2 vUv;
          
          float rand(vec2 n) { 
            return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
          }

          void main() {
            // Noise (Layer 7)
            float noise = rand(vUv * uTime) * 0.04;
            
            // Light Sweep (Layer 5) - Moves diagonally every 7 seconds
            float sweepTime = mod(uTime, 7.0);
            float sweepPos = sweepTime / 2.0 - 0.5; // -0.5 to 3.0
            
            // Diagonal line
            float dist = abs((vUv.x + vUv.y * 0.5) - sweepPos * 2.0);
            float sweep = smoothstep(0.15, 0.0, dist) * 0.15;
            sweep += smoothstep(0.05, 0.0, dist) * 0.2; // intense core
            
            vec3 color = vec3(1.0); // white sweep
            
            // Output combined noise and sweep
            float alpha = max(noise, sweep);
            
            // Mix color (sweep is white, noise is dark/white)
            vec3 finalColor = mix(vec3(0.0), vec3(1.0), sweep * 2.0);
            
            gl_FragColor = vec4(finalColor, alpha);
          }
        `}
      />
    </mesh>
  );
}

/* =========================================================================
   MAIN SCENE
   ========================================================================= */
export default function HeroScene() {
  const { scrollY } = useScroll(); 
  
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
      <Canvas 
        camera={{ position: [0, 0, 5], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]} 
      >
        <ambientLight intensity={1.5} />
        <directionalLight position={[10, 10, 10]} intensity={1} color="#ffffff" />
        <directionalLight position={[-10, 10, -10]} intensity={0.5} color="#3b76f0" />
        
        <Environment preset="city" />

        <AuroraLayer />
        <SilkLayer />
        <FlowFieldLayer />
        <DynamicGrid />
        <GlassObjects />
        <ScreenSpaceEffects />
      </Canvas>
    </div>
  );
}
