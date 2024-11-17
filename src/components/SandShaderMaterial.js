// SandShaderMaterial.js
import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

// Import GLSL code from separate files or define as strings
const vertexShader = `
  uniform float u_time;
  uniform vec2 u_mouse;
  varying vec2 vUv;
  varying float vElevation;

  // Simplex Noise functions here (include the code or import if possible)
  // For brevity, I'm omitting the full noise function code
  // You can find GLSL noise implementations at https://github.com/ashima/webgl-noise

  void main() {
    vUv = uv;
    vec3 pos = position;

    // Calculate elevation using noise
    float elevation = sin(pos.x * 2.0 + u_time) * sin(pos.y * 2.0 + u_time) * 0.2;
    vElevation = elevation;

    // Apply mouse interaction
    float dist = distance(uv, u_mouse);
    float mouseEffect = exp(-dist * 10.0) * 0.2;
    pos.z += elevation + mouseEffect;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const fragmentShader = `
  varying vec2 vUv;
  varying float vElevation;

  void main() {
    // Base sand color
    vec3 sandColor = vec3(0.96, 0.8, 0.6);

    // Darker color in valleys
    vec3 valleyColor = vec3(0.8, 0.6, 0.4);

    // Mix colors based on elevation
    float mixFactor = smoothstep(0.0, 0.2, vElevation);
    vec3 color = mix(valleyColor, sandColor, mixFactor);

    gl_FragColor = vec4(color, 1.0);
  }
`;

const SandShaderMaterial = shaderMaterial(
  {
    u_time: 0,
    u_mouse: new THREE.Vector2(),
  },
  vertexShader,
  fragmentShader
);

extend({ SandShaderMaterial });

export { SandShaderMaterial };
