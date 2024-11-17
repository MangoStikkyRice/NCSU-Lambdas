import React, { useRef, Suspense } from 'react';
import { Canvas, useFrame, extend } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { ImprovedNoise } from 'three/examples/jsm/math/ImprovedNoise';

extend({ ImprovedNoise });

const Terrain = () => {
  const meshRef = useRef();
  const geometryRef = useRef();

  // Generate terrain using procedural noise
  const width = 200;
  const height = 200;
  const segments = 256;

  const generateHeight = () => {
    const size = segments + 1;
    const data = new Float32Array(size * size);
    const perlin = new ImprovedNoise();
    let quality = 1;
    const z = Math.random() * 100;

    for (let i = 0; i < data.length; i++) data[i] = 0;

    for (let j = 0; j < 4; j++) {
      for (let i = 0; i < size * size; i++) {
        const x = i % size;
        const y = ~~(i / size);
        data[i] += perlin.noise(x / quality, y / quality, z) * quality * 1.75;
      }
      quality *= 5;
    }

    return data;
  };

  const data = generateHeight();

  // Modify the plane geometry
  const applyHeight = () => {
    const geometry = geometryRef.current;
    const vertices = geometry.attributes.position.array;

    for (let i = 0, j = 0, l = vertices.length; i < l; i += 3, j++) {
      vertices[i + 2] = data[j];
    }

    geometry.computeVertexNormals();
    geometry.attributes.position.needsUpdate = true;
  };

  useFrame(() => {
    // Rotate the terrain slowly
    if (meshRef.current) {
      meshRef.current.rotation.z += 0.0001;
    }
  });

  return (
    <mesh ref={meshRef}>
      {/* Replace planeBufferGeometry with planeGeometry */}
      <planeGeometry
        ref={geometryRef}
        args={[width, height, segments, segments]}
        onUpdate={applyHeight}
      />
      <meshStandardMaterial color="#e2b857" />
    </mesh>
  );
};

const DesertScene = () => {
  return (
    <div className="desert-scene">
      <Canvas camera={{ position: [0, 50, 100], fov: 55 }}>
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[50, 50, 50]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <Suspense fallback={null}>
          <Terrain />
        </Suspense>
        <OrbitControls maxPolarAngle={Math.PI / 2 - 0.05} />
      </Canvas>
    </div>
  );
};

export default DesertScene;
