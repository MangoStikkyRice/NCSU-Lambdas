// SandBackground.jsx
import React, { useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { SandShaderMaterial } from './SandShaderMaterial';
import * as THREE from 'three';
import './SandBackground.scss';

const SandPlane = () => {
  const planeRef = useRef();
  const { viewport } = useThree();

  useFrame(({ clock, pointer }) => {
    if (planeRef.current) {
      planeRef.current.material.uniforms.u_time.value = clock.getElapsedTime();

      // Convert pointer coordinates to UV space (0 to 1)
      const u_mouse = new THREE.Vector2(
        pointer.x * 0.5 + 0.5,
        pointer.y * -0.5 + 0.5
      );

      planeRef.current.material.uniforms.u_mouse.value = u_mouse;
    }
  });

  return (
    <mesh ref={planeRef}>
      <planeGeometry args={[viewport.width * 2, viewport.height * 2, 400, 400]} />
      <sandShaderMaterial />
    </mesh>
  );
};

const SandBackground = () => {
  return (
    <div className="sand-background">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        <SandPlane />
      </Canvas>
    </div>
  );
};

export default SandBackground;
