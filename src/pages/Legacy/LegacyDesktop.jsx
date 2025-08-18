import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LegacyDesktop.scss';
import NavBarNew from '../../components/navbar/NavBarNew';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Import slide data
import { legacySlideData } from '../../data/legacySlideData';

const LegacyDesktop = () => {
  // Refs and state
  const canvasRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  const animationFrameId = useRef(null);

  // Typography constants
  const titleFontSize = 48;
  const paragraphFontSize = 18;
  const readMoreFontSize = 16;
  const buttonFontSize = 20;

  // Text pagination helper
  const paginateText = (paragraph, maxCharsPerPage = 500) => {
    const words = paragraph.split(' ');
    const pages = [];
    let currentPage = '';

    words.forEach((word) => {
      if ((currentPage + word).length > maxCharsPerPage) {
        pages.push(currentPage.trim());
        currentPage = word + ' ';
      } else {
        currentPage += word + ' ';
      }
    });

    if (currentPage.trim()) {
      pages.push(currentPage.trim());
    }

    return pages;
  };

  // Main WebGL setup and animation
  useEffect(() => {
    // Animation state variables
    let hoveredObject = null;
    const baseLineHeight = 23;
    const baseTitleLineHeight = 55;

    // Math utility functions
    const Mathutils = {
      normalize: ($value, $min, $max) => ($value - $min) / ($max - $min),
      interpolate: ($normValue, $min, $max) => $min + ($max - $min) * $normValue,
      map: function ($value, $min1, $max1, $min2, $max2) {
        $value = this.clamp($value, $min1, $max1);
        return this.interpolate(
          this.normalize($value, $min1, $max1),
          $min2,
          $max2
        );
      },
      clamp: (value, min, max) => Math.max(min, Math.min(max, value)),
    };

    // Device pixel ratio for high-DPI displays
    const dpr = window.devicePixelRatio || 1;

    // Global variables for event handlers
    let p1, p2;

    // Window dimensions
    let ww = window.innerWidth,
      wh = window.innerHeight;

    // Initialize WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      alpha: false, // Set to false to use the clear color
    });
    renderer.setSize(ww, wh);
    renderer.setPixelRatio(dpr); // Set pixel ratio
    renderer.setClearColor(0x000000, 1); // Set black background

    // Create scene with atmospheric fog
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set black background
    scene.fog = new THREE.Fog(0x194794, 0, 100);

    // Camera setup with rotation proxies
    let cameraRotationProxyX = Math.PI;
    let cameraRotationProxyY = 0;

    const camera = new THREE.PerspectiveCamera(90, ww / wh, 0.001, 200);
    camera.rotation.y = cameraRotationProxyX;
    camera.rotation.z = cameraRotationProxyY;

    // Create a group and add camera to the scene
    const cameraGroup = new THREE.Group();
    cameraGroup.position.z = 400;
    cameraGroup.add(camera);
    scene.add(cameraGroup);

    // Define points for the path
    const points = [
      [10, 89, 0],
      [50, 88, 10],
      [76, 139, 20],
      [126, 141, 12],
      [150, 112, 8],
      [157, 73, 0],
      [180, 44, 5],
      [207, 35, 10],
      [232, 36, 0],
    ].map(([x, z, y]) => new THREE.Vector3(x, y, z));

    // Create a Catmull-Rom curve from the points
    const path = new THREE.CatmullRomCurve3(points);
    path.tension = 0.5;

    // Create tube geometry along the path
    const tubeGeometry = new THREE.TubeGeometry(path, 300, 7, 32, false);

    // Load textures
    const textureLoader = new THREE.TextureLoader();
    const spaceTexture = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/3d_space_5.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 2);
      }
    );

    const bumpMap = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg',
      (texture) => {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 2);
      }
    );

    // Create material for the tube
    const tubeMaterial = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      map: spaceTexture,
      shininess: 100,
      bumpMap: bumpMap,
      bumpScale: -0.03,
      specular: 0x555555,
      transparent: true,
      opacity: 0.5,
    });

    // Create and add the tube mesh
    const tube = new THREE.Mesh(tubeGeometry, tubeMaterial);
    scene.add(tube);

    // Create inner tube wireframe
    const innerTubeGeometry = new THREE.TubeGeometry(path, 150, 6.8, 32, false);
    const innerTubeEdges = new THREE.EdgesGeometry(innerTubeGeometry);
    const innerTubeMaterial = new THREE.LineBasicMaterial({
      linewidth: 1,
      opacity: 0.05,
      transparent: true,
    });
    const wireframe = new THREE.LineSegments(innerTubeEdges, innerTubeMaterial);
    scene.add(wireframe);

    // Add lights to the scene
    const light = new THREE.PointLight(0xffffff, 1, 1000, 2);
    light.castShadow = true;
    scene.add(light);

    const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 2);
    pointLight.castShadow = true;
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1).normalize();
    scene.add(directionalLight);

    // Function to update camera position based on percentage along the path
    const updateCameraPercentage = (percentage) => {
      p1 = path.getPointAt(percentage % 1);
      p2 = path.getPointAt((percentage + 0.03) % 1);

      cameraGroup.position.set(p1.x, p1.y, p1.z);
      cameraGroup.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    };

    // Camera percentage variables
    let cameraTargetPercentage = 0;
    let currentCameraPercentage = 0;

    // GSAP timeline for scrolling
    gsap.defaults({ ease: 'none' });

    const tubePerc = { percent: 0 };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTargetRef.current,
        start: 'top top',
        end: 'bottom 100%',
        scrub: 5,
      },
    });

    tl.to(tubePerc, {
      percent: 0.96,
      duration: 10,
      onUpdate: () => {
        cameraTargetPercentage = tubePerc.percent;
      },
    });

    // Particle system setup
    const spikeyTexture = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/spikey.png'
    );

    const particleCount = 8400;
    const positions1 = new Float32Array(particleCount * 3);
    const positions2 = new Float32Array(particleCount * 3);
    const positions3 = new Float32Array(particleCount * 3);

    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      map: spikeyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      alphaTest: 0.04,
      sizeAttenuation: true,
    });

    // Initialize particle positions for particles1
    for (let p = 0; p < particleCount; p++) {
      positions1[p * 3] = Math.random() * 500 - 250;
      positions1[p * 3 + 1] = Math.random() * 50 - 25;
      positions1[p * 3 + 2] = Math.random() * 500 - 250;
    }

    const particlesGeometry1 = new THREE.BufferGeometry();
    particlesGeometry1.setAttribute('position', new THREE.BufferAttribute(positions1, 3));
    const particleSystem1 = new THREE.Points(particlesGeometry1, particleMaterial);
    scene.add(particleSystem1);

    // Initialize particle positions for particles2
    for (let p = 0; p < particleCount; p++) {
      positions2[p * 3] = Math.random() * 500;
      positions2[p * 3 + 1] = Math.random() * 10 - 5;
      positions2[p * 3 + 2] = Math.random() * 500;
    }

    const particlesGeometry2 = new THREE.BufferGeometry();
    particlesGeometry2.setAttribute('position', new THREE.BufferAttribute(positions2, 3));
    const particleSystem2 = new THREE.Points(particlesGeometry2, particleMaterial);
    scene.add(particleSystem2);

    // Initialize particle positions for particles3
    for (let p = 0; p < particleCount; p++) {
      positions3[p * 3] = Math.random() * 500;
      positions3[p * 3 + 1] = Math.random() * 10 - 5;
      positions3[p * 3 + 2] = Math.random() * 500;
    }

    const particlesGeometry3 = new THREE.BufferGeometry();
    particlesGeometry3.setAttribute('position', new THREE.BufferAttribute(positions3, 3));
    const particleSystem3 = new THREE.Points(particlesGeometry3, particleMaterial);
    scene.add(particleSystem3);

    // Use imported slide data
    const originalContentData = legacySlideData;

    // Process content data to include pagination
    const contentData = originalContentData.map((content) => ({
      ...content,
      pages: paginateText(content.paragraph, 500),
    }));

    // Array to store sprites for later visibility control
    const contentSprites = [];

    // Compute Frenet frames for the path
    const frames = path.computeFrenetFrames(1000, false);

    // Helper function to wrap text
    const wrapText = (context, text, maxWidth) => {
      const words = text.split(' ');
      const lines = [];
      let currentLine = '';

      words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = context.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && currentLine !== '') {
          lines.push(currentLine.trim());
          currentLine = word + ' ';
        } else {
          currentLine = testLine;
        }
      });

      lines.push(currentLine.trim());
      return lines;
    };

    // Function to draw text on the canvas and update the texture
    const drawTextCanvas = (contentSprite) => {
      const { textCanvas, textContext, content, textTexture, currentPage } = contentSprite;

      // Get current page content
      const pageContent = content.pages[currentPage] || '';

      // Clear the canvas
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);

      // Save the context state
      textContext.save();

      // Set common text properties
      textContext.textAlign = 'left';
      textContext.textBaseline = 'top';

      // Draw the title
      textContext.font = `Bold ${titleFontSize}px Arial`;
      const titleMaxWidth = 480;
      let titleX = 10;
      let titleY = 10;

      const titleLines = wrapText(textContext, content.text, titleMaxWidth);

      // Draw the blue banner
      const bannerX = 0;
      const bannerY = titleY - 12;
      const bannerWidth = 500;
      const bannerHeight = titleLines.length * (titleFontSize + 10) + 10;

      const gradient = textContext.createLinearGradient(
        bannerX,
        bannerY,
        bannerX + bannerWidth,
        bannerY
      );
      gradient.addColorStop(0, '#203c79');
      gradient.addColorStop(1, 'rgba(32, 60, 121, 0)');

      textContext.fillStyle = gradient;
      textContext.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);

      // Set shadow for the text
      textContext.shadowColor = 'rgba(0, 0, 0, 1)';
      textContext.shadowBlur = 3;
      textContext.shadowOffsetX = 0;
      textContext.shadowOffsetY = 3;

      // Draw title lines
      titleLines.forEach(line => {
        textContext.fillStyle = 'white';
        textContext.fillText(line, titleX + 10, titleY);
        titleY += titleFontSize + 10;
      });

      // Draw the paragraph
      textContext.font = `${paragraphFontSize}px Arial`;
      textContext.fillStyle = 'white';
      const maxWidth = 450;
      let x = 10;
      let y = titleY + 20;

      const paragraphSpacing = 10;
      const paragraphs = pageContent.split('\n\n');

      paragraphs.forEach((paragraph, pIndex) => {
        const lines = wrapText(textContext, paragraph, maxWidth);
        lines.forEach(line => {
          textContext.fillText(line, x, y);
          y += paragraphFontSize + 10;
        });

        if (pIndex < paragraphs.length - 1) {
          y += paragraphSpacing;
        }
      });

      // Restore the context state
      textContext.restore();

      // Draw "Read more..." if applicable
      const hasMorePages = contentSprite.currentPage < contentSprite.totalPages - 1;
      if (hasMorePages && contentSprite.isHovered) {
        textContext.font = `Italic ${readMoreFontSize}px Arial`;
        textContext.fillStyle = 'yellow';
        textContext.fillText('Read more...', x, y + 20);
      }

      // Update the texture
      textTexture.needsUpdate = true;
    };

    // Function to draw the button on the canvas and update the texture
    const drawButtonCanvas = (contentSprite) => {
      const { buttonCanvas, buttonContext, buttonTexture, buttonIsHovered, content } = contentSprite;

      // Clear canvas
      buttonContext.clearRect(0, 0, buttonCanvas.width, buttonCanvas.height);

      // Draw button text
      buttonContext.fillStyle = buttonIsHovered ? 'yellow' : 'white';
      buttonContext.font = `Bold ${buttonFontSize}px Arial`;
      buttonContext.textAlign = 'center';
      buttonContext.textBaseline = 'middle';

      // Optional shadow
      buttonContext.shadowColor = 'rgba(0, 0, 0, 0.5)';
      buttonContext.shadowBlur = 4;
      buttonContext.shadowOffsetX = 0;
      buttonContext.shadowOffsetY = 2;

      buttonContext.fillText(
        content.buttonText,
        buttonCanvas.width / 2,
        buttonCanvas.height / 2
      );

      // Update texture
      buttonTexture.needsUpdate = true;
    };

    // Function to create and setup content sprites
    const createContentSprites = () => {
      const textCanvasWidth = 900;
      const textCanvasHeight = 600;

      contentData.forEach((content) => {
        // Create image canvas
        const imageCanvas = document.createElement('canvas');
        const canvasSize = 512;
        imageCanvas.width = canvasSize;
        imageCanvas.height = canvasSize;
        const imageContext = imageCanvas.getContext('2d');

        // Load the image
        const img = new Image();
        img.src = content.image;

        const imageTexture = new THREE.CanvasTexture(imageCanvas);

        img.onload = () => {
          const imgAspect = img.width / img.height;
          const canvasAspect = imageCanvas.width / imageCanvas.height;

          let renderableWidth, renderableHeight, xStart, yStart;

          if (imgAspect > canvasAspect) {
            const scale = imageCanvas.width / img.width;
            renderableWidth = img.width * scale;
            renderableHeight = img.height * scale;
            xStart = (imageCanvas.width - renderableWidth) / 2;
            yStart = (imageCanvas.height - renderableHeight) / 2;
          } else {
            const scale = imageCanvas.height / img.height;
            renderableWidth = img.width * scale;
            renderableHeight = img.height * scale;
            xStart = (imageCanvas.width - renderableWidth) / 2;
            yStart = (imageCanvas.height - renderableHeight) / 2;
          }

          imageContext.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
          imageTexture.needsUpdate = true;
        };

        // Create group for image and button
        const imageGroup = new THREE.Group();

        // Create sprite for the image
        const spriteMaterial = new THREE.SpriteMaterial({
          map: imageTexture,
          transparent: true,
          opacity: 0,
          depthTest: false, // Changed to false to avoid depth conflicts
          depthWrite: false,
          alphaTest: 0.1,
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        const spriteSize = 5;
        sprite.scale.set(spriteSize, spriteSize, 1);
        sprite.position.set(0, 0, 0);
        sprite.renderOrder = 1; // Set render order

        imageGroup.add(sprite);

        // Create button canvas
        const buttonCanvasWidth = 300;
        const buttonCanvasHeight = 50;
        const buttonCanvas = document.createElement('canvas');
        buttonCanvas.width = buttonCanvasWidth;
        buttonCanvas.height = buttonCanvasHeight;
        const buttonContext = buttonCanvas.getContext('2d');

        const buttonTexture = new THREE.CanvasTexture(buttonCanvas);
        buttonTexture.needsUpdate = true;

        const buttonSpriteMaterial = new THREE.SpriteMaterial({
          map: buttonTexture,
          transparent: true,
          opacity: 0,
          depthTest: false, // Changed to false
          depthWrite: false,
          alphaTest: 0.1,
        });

        const buttonSprite = new THREE.Sprite(buttonSpriteMaterial);
        const buttonSpriteHeight = 1;
        const buttonSpriteWidth = buttonSpriteHeight * (buttonCanvasWidth / buttonCanvasHeight);
        buttonSprite.scale.set(buttonSpriteWidth, buttonSpriteHeight, 1);
        buttonSprite.renderOrder = 2; // Set render order

        const contentSprite = {
          buttonCanvasWidth,
          buttonCanvasHeight,
          buttonCanvas,
          buttonContext,
          buttonTexture,
          buttonSpriteMaterial,
          buttonIsHovered: false,
          isHovered: false,
          needsButtonRedraw: true,
          needsRedraw: true,
          currentPage: 0,
          totalPages: content.pages.length,
          content,
        };

        buttonSprite.position.set(0, -spriteSize / 2 - buttonSpriteHeight / 2, 0);
        imageGroup.add(buttonSprite);

        // Position the group along the path
        const percentage = content.percentage % 1;
        const position = path.getPointAt(percentage);

        const numSegments = frames.binormals.length;
        const index = Math.floor(percentage * numSegments);
        const tangent = frames.tangents[index].clone().normalize();
        const normal = frames.normals[index].clone().normalize();
        const binormal = frames.binormals[index].clone().normalize();
        const up = new THREE.Vector3(0, 1, 0);
        const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

        if (right.length() === 0) {
          right.copy(frames.binormals[index]).normalize();
        }

        const offsetLeft = -3;
        imageGroup.position.copy(position).add(right.clone().multiplyScalar(offsetLeft));
        imageGroup.quaternion.copy(camera.quaternion);

        // Create text canvas
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 900;
        textCanvas.height = 600;
        const textContext = textCanvas.getContext('2d');

        const textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.needsUpdate = true;

        const textSpriteMaterial = new THREE.SpriteMaterial({
          map: textTexture,
          transparent: true,
          opacity: 0,
          depthTest: false, // Changed to false
          depthWrite: false,
          alphaTest: 0.1,
        });

        const textSprite = new THREE.Sprite(textSpriteMaterial);
        const textSpriteHeight = 7.5;
        const textSpriteWidth = (textCanvas.width / textCanvas.height) * textSpriteHeight;
        textSprite.scale.set(textSpriteWidth, textSpriteHeight, 1);
        textSprite.renderOrder = 3; // Set render order

        const textGroup = new THREE.Group();
        textGroup.add(textSprite);

        const verticalOffset = -2;
        const offsetRight = 5.5;
        textGroup.position.copy(position).add(right.clone().multiplyScalar(offsetRight)).add(new THREE.Vector3(0, verticalOffset, 0));
        textGroup.quaternion.copy(camera.quaternion);

        Object.assign(contentSprite, {
          imageGroup,
          sprite,
          buttonSprite,
          textGroup,
          textSprite,
          textCanvas,
          textContext,
          textTexture,
          textSpriteMaterial,
          textSpriteHeight,
        });

        textSprite.userData = {
          type: 'textSprite',
          contentSprite: contentSprite,
        };

        buttonSprite.userData = {
          type: 'buttonSprite',
          contentSprite: contentSprite,
        };

        drawTextCanvas(contentSprite);
        drawButtonCanvas(contentSprite);

        scene.add(imageGroup);
        scene.add(textGroup);

        contentSprites.push(contentSprite);
      });
    };

    // Initialize content sprites
    createContentSprites();

    // Render loop
    const render = () => {
      currentCameraPercentage = cameraTargetPercentage;

      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      updateCameraPercentage(currentCameraPercentage);

      // Update sprite opacity based on distance with deadzone
      contentSprites.forEach((contentSprite) => {
        const { imageGroup, textGroup } = contentSprite;
        const distance = cameraGroup.position.distanceTo(imageGroup.position);

        const minDistance = 20;
        const maxDistance = 25;

        let opacity = 1;

        if (distance <= minDistance) {
          opacity = 1;
        } else if (distance >= maxDistance) {
          opacity = 0;
        } else {
          opacity = 1 - (distance - minDistance) / (maxDistance - minDistance);
        }

        opacity = Mathutils.clamp(opacity, 0, 1);

        // Update opacity for all materials in the image group
        imageGroup.traverse((child) => {
          if (child.material) {
            child.material.opacity = opacity;
          }
        });

        // Update opacity for all materials in the text group
        textGroup.traverse((child) => {
          if (child.material) {
            child.material.opacity = opacity;
          }
        });
      });

      // Animate particle systems
      particleSystem1.rotation.y += 0.00002;
      particleSystem2.rotation.x += 0.00005;
      particleSystem3.rotation.z += 0.00001;

      // Sort transparent objects before rendering
      renderer.sortObjects = true;

      // Render the scene
      renderer.render(scene, camera);

      // Redraw canvases if needed
      contentSprites.forEach((contentSprite) => {
        if (contentSprite.needsRedraw) {
          drawTextCanvas(contentSprite);
          contentSprite.needsRedraw = false;
        }
        if (contentSprite.needsButtonRedraw) {
          drawButtonCanvas(contentSprite);
          contentSprite.needsButtonRedraw = false;
        }
      });

      animationFrameId.current = requestAnimationFrame(render);
    };
    animationFrameId.current = requestAnimationFrame(render);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Event handlers for user interaction
    const handleMouseMove = (event) => {
      const rect = canvasRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const clickableObjects = contentSprites.flatMap((cs) => [
        cs.textSprite,
        cs.buttonSprite,
      ]);

      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        const { type, contentSprite } = intersectedObject.userData;

        canvasRef.current.style.cursor = 'pointer';

        if (type === 'textSprite') {
          contentSprites.forEach((cs) => {
            if (cs.textSprite === intersectedObject) {
              if (!cs.isHovered) {
                cs.isHovered = true;
                cs.needsRedraw = true;
              }
            } else {
              if (cs.isHovered) {
                cs.isHovered = false;
                cs.needsRedraw = true;
              }
            }
          });
        } else if (type === 'buttonSprite') {
          contentSprites.forEach((cs) => {
            if (cs.buttonSprite === intersectedObject) {
              if (!cs.buttonIsHovered) {
                cs.buttonIsHovered = true;
                gsap.to(cs.buttonSprite.scale, {
                  x: cs.buttonSprite.scale.x * 1.2,
                  y: cs.buttonSprite.scale.y * 1.2,
                  z: cs.buttonSprite.scale.z,
                  duration: 0.3,
                  ease: 'power2.out',
                });
                cs.needsButtonRedraw = true;
              }
            } else {
              if (cs.buttonIsHovered) {
                cs.buttonIsHovered = false;
                gsap.to(cs.buttonSprite.scale, {
                  x: cs.buttonSprite.scale.x / 1.2,
                  y: cs.buttonSprite.scale.y / 1.2,
                  z: cs.buttonSprite.scale.z,
                  duration: 0.3,
                  ease: 'power2.out',
                });
                cs.needsButtonRedraw = true;
              }
            }
          });
        }
      } else {
        canvasRef.current.style.cursor = 'default';
        contentSprites.forEach((cs) => {
          if (cs.isHovered) {
            cs.isHovered = false;
            cs.needsRedraw = true;
          }
          if (cs.buttonIsHovered) {
            cs.buttonIsHovered = false;
            gsap.to(cs.buttonSprite.scale, {
              x: cs.buttonSprite.scale.x / 1.2,
              y: cs.buttonSprite.scale.y / 1.2,
              z: cs.buttonSprite.scale.z,
              duration: 0.3,
              ease: 'power2.out',
            });
            cs.needsButtonRedraw = true;
          }
        });
      }
    };

    const handleCanvasClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const clickableObjects = contentSprites.flatMap((cs) => [
        cs.textSprite,
        cs.buttonSprite,
      ]);

      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        const { type, contentSprite } = clickedObject.userData;

        if (type === 'buttonSprite') {
          if (contentSprite && contentSprite.content.link) {
            window.open(contentSprite.content.link, '_blank');
          }
        } else if (type === 'textSprite') {
          if (contentSprite) {
            gsap.to(contentSprite.textSprite.material, {
              opacity: 0,
              duration: 0,
              onComplete: () => {
                contentSprite.currentPage += 1;
                if (contentSprite.currentPage >= contentSprite.totalPages) {
                  contentSprite.currentPage = 0;
                }
                drawTextCanvas(contentSprite);
                gsap.to(contentSprite.textSprite.material, {
                  opacity: 1,
                  duration: 0.3,
                });
              },
            });
          }
        }
      }
    };

    // Handle window resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    // Handle scroll for overlay visibility
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowOverlay(false);
      } else {
        setShowOverlay(true);
      }
    };

    // Add event listeners
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleCanvasClick);

    // Cleanup function
    return () => {
      // Cancel animation frame
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }

      // Remove event listeners
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousemove', handleMouseMove);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }

      // Dispose of Three.js resources
      scene.traverse((child) => {
        if (child.geometry) {
          child.geometry.dispose();
        }
        if (child.material) {
          if (Array.isArray(child.material)) {
            child.material.forEach((material) => material.dispose());
          } else {
            child.material.dispose();
          }
        }
        if (child.material && child.material.map) {
          child.material.map.dispose();
        }
      });

      // Dispose of textures
      contentSprites.forEach((cs) => {
        if (cs.textTexture) cs.textTexture.dispose();
        if (cs.buttonTexture) cs.buttonTexture.dispose();
      });

      renderer.dispose();
    };
  }, []);

  return (
    <>
      <NavBarNew />

      {/* Intro overlay with scroll instruction */}
      {showOverlay && (
        <div className={`intro-overlay ${!showOverlay ? 'hide' : ''}`}>
          <div className="intro-text">
            Scroll through our Legacy
            <div className="arrow-down"></div>
          </div>
        </div>
      )}

      {/* WebGL canvas for 3D experience */}
      <canvas className="experience" ref={canvasRef}></canvas>

      {/* Scroll target for GSAP ScrollTrigger */}
      <div className="scrollTarget" ref={scrollTargetRef}></div>

      {/* Vignette effect overlay */}
      <div className="vignette-radial"></div>
    </>
  );
};

export default LegacyDesktop;