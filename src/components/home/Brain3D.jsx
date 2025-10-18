import { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

// Brain component with animated neurons
function Brain() {
  const brainRef = useRef();
  const neuronsRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    // Gentle rotation
    if (brainRef.current) {
      brainRef.current.rotation.y = t * 0.1;
      brainRef.current.rotation.x = Math.sin(t * 0.2) * 0.1;
    }
  });

  // Create neurons (small spheres around the brain)
  const neurons = [];
  for (let i = 0; i < 50; i++) {
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(Math.random() * 2 - 1);
    const radius = 2 + Math.random() * 0.5;
    
    const x = radius * Math.sin(phi) * Math.cos(theta);
    const y = radius * Math.sin(phi) * Math.sin(theta);
    const z = radius * Math.cos(phi);
    
    neurons.push({ position: [x, y, z], scale: Math.random() * 0.05 + 0.02 });
  }

  return (
    <group ref={brainRef}>
      {/* Main Brain Shape */}
      <Sphere args={[1.5, 64, 64]} position={[0, 0, 0]}>
        <MeshDistortMaterial
          color="primary-300"
          attach="material"
          distort={0.3}
          speed={1.5}
          roughness={0.4}
          metalness={0.8}
        />
      </Sphere>

      {/* Neurons */}
      <group ref={neuronsRef}>
        {neurons.map((neuron, i) => (
          <Neuron key={i} position={neuron.position} scale={neuron.scale} delay={i * 0.1} />
        ))}
      </group>

      {/* Connection lines */}
      <ConnectionLines neurons={neurons} />
    </group>
  );
}

// Individual neuron component
function Neuron({ position, scale, delay }) {
  const ref = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (ref.current) {
      // Pulsing effect
      const pulse = Math.sin(t * 2 + delay) * 0.5 + 1;
      ref.current.scale.set(scale * pulse, scale * pulse, scale * pulse);
    }
  });

  return (
    <mesh ref={ref} position={position}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial
        color="primary-300"
        emissive="primary-500"
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}

// Connection lines between neurons
function ConnectionLines({ neurons }) {
  const linesRef = useRef();

  useEffect(() => {
    if (!linesRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    // Create connections between nearby neurons
    for (let i = 0; i < neurons.length; i++) {
      for (let j = i + 1; j < neurons.length; j++) {
        const dist = Math.sqrt(
          Math.pow(neurons[i].position[0] - neurons[j].position[0], 2) +
          Math.pow(neurons[i].position[1] - neurons[j].position[1], 2) +
          Math.pow(neurons[i].position[2] - neurons[j].position[2], 2)
        );

        // Only connect neurons that are close enough
        if (dist < 1.5) {
          positions.push(...neurons[i].position);
          positions.push(...neurons[j].position);
        }
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    linesRef.current.geometry = geometry;
  }, [neurons]);

  return (
    <lineSegments ref={linesRef}>
      <lineBasicMaterial color="primary-300" opacity={0.3} transparent />
    </lineSegments>
  );
}

// Main 3D Brain Component
export default function Brain3D() {
  return (
    <div className="w-full h-full min-h-[300px] md:min-h-[500px]">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <pointLight position={[-10, -10, -5]} intensity={0.5} color="primary-500" />
        <spotLight
          position={[0, 10, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          castShadow
        />

        {/* Brain */}
        <Brain />

        {/* Controls */}
        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 1.5}
        />
      </Canvas>
    </div>
  );
}

