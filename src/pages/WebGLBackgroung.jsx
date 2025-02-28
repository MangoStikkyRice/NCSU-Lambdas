import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const SpaceTwinkleBackground = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;

    // Create the scene with a fallback black background
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    // Load the nebula texture and create a background plane
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(
      'https://img.freepik.com/free-psd/cosmic-nebula-celestial-tapestry-stars-gas_632498-24057.jpg?t=st=1740132876~exp=1740136476~hmac=3e9b5a834d3675193573c0b69c0123f89c9d23ae616a86e7301483db4edf7f22&w=1480',
      (texture) => {
        const nebulaGeometry = new THREE.PlaneGeometry(3000, 3000);
        const nebulaMaterial = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          opacity: 0.8, // Adjust the opacity to blend nicely with stars
          depthWrite: false, // Ensure it doesn't interfere with star depth
        });
        const nebulaMesh = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
        nebulaMesh.position.z = -1500; // Place it well behind the stars
        nebulaMesh.renderOrder = -1; // Render the nebula before other objects
        scene.add(nebulaMesh);
      }
    );

    // Set up a perspective camera
    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      2000
    );
    camera.position.z = 1;

    // Create the renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Create star field geometry
    const starCount = 5000;
    const starGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);
    const seeds = new Float32Array(starCount);
    const range = 1000;
    for (let i = 0; i < starCount; i++) {
      const index = i * 3;
      positions[index] = (Math.random() - 0.5) * range;
      positions[index + 1] = (Math.random() - 0.5) * range;
      positions[index + 2] = (Math.random() - 0.5) * range;
      seeds[i] = Math.random() * 100.0;
    }
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));

    // ShaderMaterial for twinkling stars
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0.0 }
      },
      vertexShader: `
        uniform float uTime;
        attribute float aSeed;
        varying float vTwinkle;
        void main() {
          vec3 pos = position;
          // Fluid sinusoidal drift based on each star's seed
          pos.x += sin(uTime + aSeed) * 0.5;
          pos.y += cos(uTime + aSeed) * 0.5;
          // Oscillating twinkle factor
          vTwinkle = sin(uTime * (0.5 + aSeed * 0.05)) * 0.5 + 0.5;
          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          gl_Position = projectionMatrix * mvPosition;
          // Adjust point size with perspective scaling
          gl_PointSize = (1.5 + (vTwinkle * 2.0)) * (300.0 / -mvPosition.z);
        }
      `,
      fragmentShader: `
        varying float vTwinkle;
        void main() {
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          gl_FragColor = vec4(vec3(vTwinkle), alpha);
        }
      `,
      transparent: true,
    });

    // Create the Points object and add it to a group for parallax control
    const stars = new THREE.Points(starGeometry, starMaterial);
    const starsGroup = new THREE.Group();
    starsGroup.add(stars);
    scene.add(starsGroup);

    // Variables for mouse-driven parallax
    let targetRotationX = 0;
    let targetRotationY = 0;
    const handleMouseMove = (event) => {
      const rect = mount.getBoundingClientRect();
      const mouseX = (event.clientX - rect.left) / rect.width;
      const mouseY = (event.clientY - rect.top) / rect.height;
      targetRotationY = (mouseX - 0.5) * 0.2;
      targetRotationX = (mouseY - 0.5) * 0.2;
    };
    mount.addEventListener('mousemove', handleMouseMove);

    // Animation loop to update time and apply smooth parallax
    let frame = 0;
    const animate = () => {
      frame += 0.02;
      starMaterial.uniforms.uTime.value = frame;

      // Smoothly interpolate group rotation toward target mouse values
      starsGroup.rotation.x += (targetRotationX - starsGroup.rotation.x) * 0.05;
      starsGroup.rotation.y += (targetRotationY - starsGroup.rotation.y) * 0.05;

      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    };
    animate();

    // Handle resizing for full-screen responsiveness
    const handleResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    // Clean up on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousemove', handleMouseMove);
      mount.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />
  );
};

export default SpaceTwinkleBackground;
