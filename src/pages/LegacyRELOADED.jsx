import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LegacyRELOADED.scss';

gsap.registerPlugin(ScrollTrigger);

import placeholderImage from '../assets/images/GRACEYANG.png';
import secondImage from '../assets/images/EVANCHEN.png';

const LegacyRELOADED = () => {
  const canvasRef = useRef(null);
  const scrollTargetRef = useRef(null);

  useEffect(() => {
    // Math utilities
    const Mathutils = {
      normalize: function ($value, $min, $max) {
        return ($value - $min) / ($max - $min);
      },
      interpolate: function ($normValue, $min, $max) {
        return $min + ($max - $min) * $normValue;
      },
      map: function ($value, $min1, $max1, $min2, $max2) {
        if ($value < $min1) {
          $value = $min1;
        }
        if ($value > $max1) {
          $value = $max1;
        }
        const res = this.interpolate(
          this.normalize($value, $min1, $max1),
          $min2,
          $max2
        );
        return res;
      },
      clamp: function (value, min, max) {
        return Math.max(min, Math.min(max, value));
      },
    };
    const markers = [];

    // Variables accessible in event handlers
    let p1, p2;

    // Get window size
    let ww = window.innerWidth,
      wh = window.innerHeight;

    // Create a WebGL renderer
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
    });
    renderer.setSize(ww, wh);

    // Create an empty scene
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x194794, 0, 100);

    // Create a perspective camera
    let cameraRotationProxyX = 3.14159;
    let cameraRotationProxyY = 0;

    const camera = new THREE.PerspectiveCamera(45, ww / wh, 0.001, 200);
    camera.rotation.y = cameraRotationProxyX;
    camera.rotation.z = cameraRotationProxyY;

    const c = new THREE.Group();
    c.position.z = 400;

    c.add(camera);
    scene.add(c);

    // Array of points
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
    ];

    // Convert the array of points into vertices
    for (let i = 0; i < points.length; i++) {
      const x = points[i][0];
      const y = points[i][2];
      const z = points[i][1];
      points[i] = new THREE.Vector3(x, y, z);
    }
    // Create a path from the points
    const path = new THREE.CatmullRomCurve3(points);
    path.tension = 0.5;

    // Create a new geometry with a different radius
    const geometry = new THREE.TubeGeometry(path, 300, 7, 32, false);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/3d_space_5.jpg',
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 2);
      }
    );

    const mapHeight = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/waveform-bump3.jpg',
      function (texture) {
        texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
        texture.offset.set(0, 0);
        texture.repeat.set(15, 2);
      }
    );

    const material = new THREE.MeshPhongMaterial({
      side: THREE.BackSide,
      map: texture,
      shininess: 20,
      bumpMap: mapHeight,
      bumpScale: -0.03,
      specular: 0x0b2349,
      transparent: true,
      opacity: 0.5,
    });

    // Create a mesh
    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

    // Inner tube
    const geometry2 = new THREE.TubeGeometry(path, 150, 6.4, 32, false);
    const geo = new THREE.EdgesGeometry(geometry2);

    const mat = new THREE.LineBasicMaterial({
      linewidth: 1,
      opacity: 0.1,
      transparent: true,
    });

    const wireframe = new THREE.LineSegments(geo, mat);
    scene.add(wireframe);

    // Create a point light in our scene
    const light = new THREE.PointLight(0xffffff, 0.35, 4, 0);
    light.castShadow = true;
    scene.add(light);

    function updateCameraPercentage(percentage) {
      p1 = path.getPointAt(percentage % 1);
      p2 = path.getPointAt((percentage + 0.03) % 1);

      c.position.set(p1.x, p1.y, p1.z);
      c.lookAt(p2);
      light.position.set(p2.x, p2.y, p2.z);
    }

    let cameraTargetPercentage = 0;
    let currentCameraPercentage = 0;

    gsap.defaults({ ease: 'none' });

    const tubePerc = {
      percent: 0,
    };

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollTargetRef.current,
        start: 'top top',
        end: 'bottom 100%',
        scrub: 5,
        markers: { color: 'white' },
      },
    });
    tl.to(tubePerc, {
      percent: 0.96,
      duration: 10,
      onUpdate: function () {
        cameraTargetPercentage = tubePerc.percent;
      },
    });

    // Particle system
    const spikeyTexture = textureLoader.load(
      'https://s3-us-west-2.amazonaws.com/s.cdpn.io/68819/spikey.png'
    );

    const particleCount = 6800;
    const positions1 = new Float32Array(particleCount * 3);
    const positions2 = new Float32Array(particleCount * 3);
    const positions3 = new Float32Array(particleCount * 3);

    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      map: spikeyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
    });

    // Create the individual particles for particles1
    for (let p = 0; p < particleCount; p++) {
      const pX = Math.random() * 500 - 250;
      const pY = Math.random() * 50 - 25;
      const pZ = Math.random() * 500 - 250;

      positions1[p * 3] = pX;
      positions1[p * 3 + 1] = pY;
      positions1[p * 3 + 2] = pZ;
    }

    // Create BufferGeometry and set positions for particles1
    const particles1 = new THREE.BufferGeometry();
    particles1.setAttribute(
      'position',
      new THREE.BufferAttribute(positions1, 3)
    );

    // Create the particle system
    const particleSystem1 = new THREE.Points(particles1, pMaterial);
    scene.add(particleSystem1);

    // Repeat for particles2
    for (let p = 0; p < particleCount; p++) {
      const pX = Math.random() * 500;
      const pY = Math.random() * 10 - 5;
      const pZ = Math.random() * 500;

      positions2[p * 3] = pX;
      positions2[p * 3 + 1] = pY;
      positions2[p * 3 + 2] = pZ;
    }

    const particles2 = new THREE.BufferGeometry();
    particles2.setAttribute(
      'position',
      new THREE.BufferAttribute(positions2, 3)
    );

    const particleSystem2 = new THREE.Points(particles2, pMaterial);
    scene.add(particleSystem2);

    // Repeat for particles3
    for (let p = 0; p < particleCount; p++) {
      const pX = Math.random() * 500;
      const pY = Math.random() * 10 - 5;
      const pZ = Math.random() * 500;

      positions3[p * 3] = pX;
      positions3[p * 3 + 1] = pY;
      positions3[p * 3 + 2] = pZ;
    }

    const particles3 = new THREE.BufferGeometry();
    particles3.setAttribute(
      'position',
      new THREE.BufferAttribute(positions3, 3)
    );

    const particleSystem3 = new THREE.Points(particles3, pMaterial);
    scene.add(particleSystem3);

    // **Adding images, paragraphs, and buttons throughout the track**

    // Compute Frenet frames for the path
    const frames = path.computeFrenetFrames(1000, false);

    // Array of percentages where we want to place images and paragraphs
    const contentData = [
      {
        percentage: 0.1,
        text: 'Genesis',
        paragraph: 'This is the paragraph text for Genesis.',
        image: placeholderImage,
        link: 'http://example.com/genesis', // Add your link here
      },
      {
        percentage: 0.3,
        text: 'Honoring Evan Chen',
        paragraph:
          'In 1995, Evan Chen, a member of Theta Chapter at Stanford University, was diagnosed with leukemia. Their chapter, along with Evan’s friends, organized a joint effort to find a bone marrow donor. What resulted was the largest bone marrow typing drive in the history of the NMDP and Asian American Donor Program (AADP). In a matter of days, over two thousand people were typed. A match was eventually found for Evan, but unfortunately by that time the disease had taken its toll on him and he passed away in 1996. In Evan’s memory, the national philanthropy for Lambda Phi Epsilon was established and the fraternity has been working with the organization from that point forward.',
        image: secondImage,
        link: 'http://example.com/evanchen',
      },
      {
        percentage: 0.5,
        text: 'Be the Match',
        paragraph:
          'Lambda Phi Epsilon works with the National Marrow Donor Program to save the lives of patients requiring bone marrow transplants. Additionally, the fraternity promotes awareness for leukemia and other blood disorders. Individuals who suffer from these types of illnesses depend on donors with similar ethnic backgrounds to find compatible bone marrow matches. Thus, the fraternity aims to register as many committed donors to the cause through local #NMDP campaigns to increase the chances for patients to find a life-saving donor.',
        image: placeholderImage,
        link: 'http://example.com/bethematch',
      },
      {
        percentage: 0.7,
        text: 'International Commitment',
        paragraph:
          "Every Lambda Phi Epsilon chapter works with the AADP, Asians for Miracle Marrow Matches, and the Cammy Lee Leukemia Foundation to hold bone marrow typing drives on their campuses to encourage Asians and other minorities to register as committed bone marrow/stem cell donors. Since the fraternity's inception, Lambda Phi Epsilon has educated thousands of donors to commit to saving the life of a patient in need.",
        image: placeholderImage,
        link: 'http://example.com/internationalcommitment',
      },
      {
        percentage: 0.9,
        text: 'The Constitution',
        paragraph: 'An overview of the constitution.',
        image: placeholderImage,
        link: 'http://example.com/constitution',
      },
    ];

    // Array to store sprites for later visibility control
    const contentSprites = [];

    // Functions moved outside the loop so they are accessible in event handlers

    // Function to draw text on the canvas
    function drawTextCanvas(contentSprite) {
      const { textCanvas, textContext, content, textTexture } = contentSprite;

      // Clear the canvas
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);

      // Set common text properties
      textContext.fillStyle = 'white';
      textContext.textAlign = 'left';
      textContext.textBaseline = 'top';

      // Draw the title text
      textContext.font = 'Bold 48px Arial';
      textContext.fillText(content.text, 10, 10);

      // Draw the paragraph text
      textContext.font = '18px Arial';
      const maxWidth = textCanvas.width - 20;
      const lineHeight = 23;
      let x = 10;
      let y = 70; // Start below the title

      const words = content.paragraph.split(' ');
      let line = '';
      let lines = [];

      if (contentSprite.expanded) {
        // Draw all lines
        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = textContext.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
          } else {
            line = testLine;
          }
        }
        if (line !== '') {
          lines.push(line);
        }
      } else {
        // Draw up to 3 lines
        let lineCount = 0;

        for (let n = 0; n < words.length; n++) {
          const testLine = line + words[n] + ' ';
          const metrics = textContext.measureText(testLine);
          const testWidth = metrics.width;

          if (testWidth > maxWidth && n > 0) {
            lines.push(line);
            line = words[n] + ' ';
            lineCount++;

            if (lineCount >= 3) {
              // We've reached the desired number of lines
              break;
            }
          } else {
            line = testLine;
          }
        }

        if (lineCount < 3 && line !== '') {
          lines.push(line);
        }

        if (lines.length === 3 && line !== '') {
          // Add '...' to indicate more text
          line = line.trim() + '...';
          lines[lines.length - 1] = line;
        }
      }

      // Draw the lines
      y = 70;
      for (let i = 0; i < lines.length; i++) {
        textContext.fillText(lines[i], x, y);
        y += lineHeight;
      }

      // Store the paragraph height
      contentSprite.paragraphHeight = y - 70;

      // Update the texture
      textTexture.needsUpdate = true;
    }

    // Function to update the "Read More" button text
    function updateReadMoreButtonText(contentSprite) {
      const { readMoreButtonContext, readMoreButtonCanvas, expanded, readMoreButtonTexture } =
        contentSprite;

      // Clear the canvas
      readMoreButtonContext.clearRect(
        0,
        0,
        readMoreButtonCanvas.width,
        readMoreButtonCanvas.height
      );

      // Draw the button background
      readMoreButtonContext.fillStyle = 'green';
      readMoreButtonContext.fillRect(
        0,
        0,
        readMoreButtonCanvas.width,
        readMoreButtonCanvas.height
      );

      // Draw the button text
      readMoreButtonContext.fillStyle = 'white';
      readMoreButtonContext.font = '18px Arial';
      readMoreButtonContext.textAlign = 'center';
      readMoreButtonContext.textBaseline = 'middle';

      const buttonText = expanded ? 'Show Less' : 'Read More';

      readMoreButtonContext.fillText(
        buttonText,
        readMoreButtonCanvas.width / 2,
        readMoreButtonCanvas.height / 2
      );

      // Update the texture
      readMoreButtonTexture.needsUpdate = true;
    }

    // Function to update button positions
    function updateButtonPositions(contentSprite) {
      const {
        textSpriteHeight,
        textCanvasHeight,
        paragraphHeight,
        readMoreButtonSprite,
        readMoreButtonHeight,
        learnMoreButtonSprite,
        learnMoreButtonHeight,
      } = contentSprite;

      // Compute the fraction of the text sprite occupied by the paragraph
      const paragraphCanvasHeight = 70 + paragraphHeight; // y after drawing lines
      const paragraphFraction = paragraphCanvasHeight / textCanvasHeight;

      // Position the "Read More" button below the paragraph text
      const marginBetweenTextAndButton = 0; // Adjust as needed
      const readMoreButtonOffsetY =
        -(
          (paragraphFraction * textSpriteHeight) / 2 +
          .2 +
          readMoreButtonHeight / 2
        );

      readMoreButtonSprite.position.set(0, readMoreButtonOffsetY, 0);

      // Now position the "Learn More" button below the "Read More" button
      const marginBetweenButtons = 0.2; // Adjust as needed

      const learnMoreButtonOffsetY =
        readMoreButtonOffsetY -
        readMoreButtonHeight / 2 -
        learnMoreButtonHeight / 2 -
        marginBetweenButtons;

      learnMoreButtonSprite.position.set(0, learnMoreButtonOffsetY, 0);
    }

    // Now proceed with creating the content sprites
    contentData.forEach((content) => {
      // [Rest of your content sprite creation code remains the same]

      // [Code for creating image sprite, text sprite, read more button, learn more button]

      // Create a canvas for the image with fixed dimensions
      const imageCanvas = document.createElement('canvas');
      const canvasSize = 512; // Fixed canvas size
      imageCanvas.width = canvasSize;
      imageCanvas.height = canvasSize;
      const imageContext = imageCanvas.getContext('2d');

      // Load the image for this content point
      const img = new Image();
      img.src = content.image;

      const imageTexture = new THREE.CanvasTexture(imageCanvas);

      img.onload = () => {
        // Apply 'cover' strategy
        const imgAspect = img.width / img.height;
        const canvasAspect = imageCanvas.width / imageCanvas.height;
        let renderableWidth, renderableHeight, xStart, yStart;

        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          renderableHeight = imageCanvas.height;
          renderableWidth = img.width * (imageCanvas.height / img.height);
          xStart = -(renderableWidth - imageCanvas.width) / 2;
          yStart = 0;
        } else {
          // Image is taller than canvas
          renderableWidth = imageCanvas.width;
          renderableHeight = img.height * (imageCanvas.width / img.width);
          xStart = 0;
          yStart = -(renderableHeight - imageCanvas.height) / 2;
        }

        // Draw the image onto the canvas
        imageContext.drawImage(
          img,
          xStart,
          yStart,
          renderableWidth,
          renderableHeight
        );

        // Update the texture after drawing
        imageTexture.needsUpdate = true;
      };

      // Create the sprite for the image
      const spriteMaterial = new THREE.SpriteMaterial({
        map: imageTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // Start fully transparent
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.1, // Add this line
      });

      const sprite = new THREE.Sprite(spriteMaterial);

      // Set the sprite scale to maintain consistent dimensions
      const spriteSize = 5; // Desired size
      sprite.scale.set(spriteSize, spriteSize, 1);

      // Get the position along the path
      const percentage = content.percentage % 1;
      const position = path.getPointAt(percentage);

      // Compute the index in the frames
      const numSegments = frames.binormals.length;
      const index = Math.floor(percentage * numSegments);

      // Get the tangent vector
      const tangent = frames.tangents[index].clone().normalize();

      // Compute the right vector as the cross product of the tangent and world up vector
      const up = new THREE.Vector3(0, 1, 0);
      const right = new THREE.Vector3().crossVectors(tangent, up).normalize();

      // If the right vector is zero length (when tangent is parallel to up), use binormal
      if (right.length() === 0) {
        right.copy(frames.binormals[index]).normalize();
      }

      // Position the sprite to the left
      const offsetLeft = -4; // Distance to the left
      sprite.position.copy(position);
      sprite.position.add(right.clone().multiplyScalar(offsetLeft));

      // **Create a combined canvas for title and paragraph**

      // Define canvas dimensions
      const textCanvasWidth = 524;
      const textCanvasHeight = 512;

      // Create the canvas
      const textCanvas = document.createElement('canvas');
      textCanvas.width = textCanvasWidth;
      textCanvas.height = textCanvasHeight;
      const textContext = textCanvas.getContext('2d');

      // Create a texture from the combined canvas
      const textTexture = new THREE.CanvasTexture(textCanvas);
      textTexture.needsUpdate = true;

      const textSpriteMaterial = new THREE.SpriteMaterial({
        map: textTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // Start fully transparent
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.1, // Add this line
      });

      const textSprite = new THREE.Sprite(textSpriteMaterial);

      // Set the sprite scale to maintain consistent dimensions
      const textSpriteHeight = 7.5; // Desired height
      const textSpriteWidth =
        (textCanvasWidth / textCanvasHeight) * textSpriteHeight;
      textSprite.scale.set(textSpriteWidth, textSpriteHeight, 1);

      // Create a group for the text sprite
      const textGroup = new THREE.Group();

      // Add the text sprite to the group
      textGroup.add(textSprite);

      // Position the text group to the right
      const offsetRight = 2.5; // Distance to the right
      textGroup.position.copy(position);
      textGroup.position.add(right.clone().multiplyScalar(offsetRight));

      // Ensure textGroup faces the camera
      textGroup.quaternion.copy(camera.quaternion);

      // **Create the "Read More" button sprite**

      // Create the "Read More" button canvas
      const readMoreButtonCanvas = document.createElement('canvas');
      readMoreButtonCanvas.width = 150;
      readMoreButtonCanvas.height = 40;
      const readMoreButtonContext = readMoreButtonCanvas.getContext('2d');

      // Initial draw of the "Read More" button
      const readMoreButtonTexture = new THREE.CanvasTexture(
        readMoreButtonCanvas
      );
      const readMoreButtonMaterial = new THREE.SpriteMaterial({
        map: readMoreButtonTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0,
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.1,
      });
      const readMoreButtonSprite = new THREE.Sprite(readMoreButtonMaterial);

      // Set the sprite scale
      const readMoreButtonWidth = 1.5;
      const readMoreButtonHeight =
        (readMoreButtonCanvas.height / readMoreButtonCanvas.width) *
        readMoreButtonWidth;
      readMoreButtonSprite.scale.set(
        readMoreButtonWidth,
        readMoreButtonHeight,
        1
      );

      // Set userData to identify the button
      readMoreButtonSprite.userData = {
        type: 'readMoreButton',
        contentSprite: null, // Will be set later
      };

      // Add the "Read More" button sprite to the text group
      textGroup.add(readMoreButtonSprite);

      // **Create a "Learn More" button sprite below the "Read More" button**

      // Create the button canvas
      const buttonCanvas = document.createElement('canvas');
      buttonCanvas.width = 200;
      buttonCanvas.height = 50;
      const buttonContext = buttonCanvas.getContext('2d');

      // Draw the button background
      buttonContext.fillStyle = 'blue';
      buttonContext.fillRect(0, 0, buttonCanvas.width, buttonCanvas.height);

      // Draw the button text
      buttonContext.fillStyle = 'white';
      buttonContext.font = '20px Arial';
      buttonContext.textAlign = 'center';
      buttonContext.textBaseline = 'middle';
      buttonContext.fillText(
        'Learn More',
        buttonCanvas.width / 2,
        buttonCanvas.height / 2
      );

      // Create a texture from the button canvas
      const buttonTexture = new THREE.CanvasTexture(buttonCanvas);
      buttonTexture.needsUpdate = true;

      const buttonMaterial = new THREE.SpriteMaterial({
        map: buttonTexture,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0, // Start fully transparent
        depthTest: true,
        depthWrite: true,
        alphaTest: 0.1, // Add this line
      });

      const buttonSprite = new THREE.Sprite(buttonMaterial);

      // Set the sprite scale
      const buttonWidth = 2; // Adjust as needed
      const buttonHeight =
        (buttonCanvas.height / buttonCanvas.width) * buttonWidth;
      buttonSprite.scale.set(buttonWidth, buttonHeight, 1);

      // Position the button below the text (will be updated later)
      buttonSprite.position.set(0, 0, 0);

      // Set the link in userData
      buttonSprite.userData = { type: 'learnMoreButton', link: content.link };

      // Add the button sprite to the text group
      textGroup.add(buttonSprite);

      // **Create the contentSprite object**

      const contentSprite = {
        sprite,
        textGroup,
        textCanvas,
        textContext,
        textTexture,
        textSpriteMaterial,
        textSpriteHeight,
        textCanvasHeight,
        expanded: false,
        content,
        percentage: content.percentage,
        readMoreButtonSprite,
        readMoreButtonCanvas,
        readMoreButtonContext,
        readMoreButtonTexture,
        readMoreButtonMaterial,
        readMoreButtonWidth,
        readMoreButtonHeight,
        learnMoreButtonSprite: buttonSprite,
        learnMoreButtonHeight: buttonHeight,
        learnMoreButtonWidth: buttonWidth,
        paragraphHeight: 0,
      };

      // Set the contentSprite in userData for the readMoreButton
      readMoreButtonSprite.userData.contentSprite = contentSprite;

      // Set the contentSprite in userData for the learnMoreButton
      buttonSprite.userData.contentSprite = contentSprite;

      // Initial drawing of the text canvas and buttons
      drawTextCanvas(contentSprite);
      updateReadMoreButtonText(contentSprite);
      updateButtonPositions(contentSprite);

      // Add the image sprite and text group to the scene
      scene.add(sprite);
      scene.add(textGroup);

      // Store the sprites for later use
      contentSprites.push(contentSprite);
    });

    // Set up raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    function render() {
      currentCameraPercentage = cameraTargetPercentage;

      camera.rotation.y += (cameraRotationProxyX - camera.rotation.y) / 15;
      camera.rotation.x += (cameraRotationProxyY - camera.rotation.x) / 15;

      updateCameraPercentage(currentCameraPercentage);

      // Update sprite opacity based on distance with deadzone
      contentSprites.forEach((contentSprite) => {
        const { sprite, textGroup } = contentSprite;
        const distance = c.position.distanceTo(sprite.position);

        const minDistance = 20; // Distance within which opacity is 1
        const maxDistance = 25; // Distance beyond which opacity is 0

        let opacity;

        if (distance <= minDistance) {
          opacity = 1;
        } else if (distance >= maxDistance) {
          opacity = 0;
        } else {
          opacity = 1 - (distance - minDistance) / (maxDistance - minDistance);
        }

        opacity = Mathutils.clamp(opacity, 0, 1);

        sprite.material.opacity = opacity;

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

      // Render the scene
      renderer.render(scene, camera);
      requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    // Event listeners
    const handleMouseMove = (event) => {
      cameraRotationProxyX = Mathutils.map(
        event.clientX,
        0,
        window.innerWidth,
        3.24,
        3.04
      );
      cameraRotationProxyY = Mathutils.map(
        event.clientY,
        0,
        window.innerHeight,
        -0.1,
        0.1
      );

      // Update mouse position in normalized device coordinates (-1 to +1)
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Array of clickable objects
      const clickableObjects = contentSprites.flatMap((cs) => [
        cs.learnMoreButtonSprite,
        cs.readMoreButtonSprite,
      ]);

      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        // Change cursor to pointer
        canvasRef.current.style.cursor = 'pointer';
      } else {
        // Revert cursor to default
        canvasRef.current.style.cursor = 'default';
      }
    };

    const handleCanvasClick = (event) => {
      // Get mouse position in normalized device coordinates (-1 to +1)
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Array of clickable objects
      const clickableObjects = contentSprites.flatMap((cs) => [
        cs.learnMoreButtonSprite,
        cs.readMoreButtonSprite,
      ]);

      const intersects = raycaster.intersectObjects(clickableObjects, true);

      if (intersects.length > 0) {
        const clickedObject = intersects[0].object;
        if (clickedObject.userData.type === 'learnMoreButton') {
          const link = clickedObject.userData.link;
          if (link) {
            window.location.href = link;
          }
        } else if (clickedObject.userData.type === 'readMoreButton') {
          const contentSprite = clickedObject.userData.contentSprite;
          if (contentSprite) {
            // Toggle expanded state
            contentSprite.expanded = !contentSprite.expanded;

            // Update the "Read More" button text
            updateReadMoreButtonText(contentSprite);

            // Redraw the text canvas
            drawTextCanvas(contentSprite);

            // Update button positions
            updateButtonPositions(contentSprite);
          }
        }
      }
    };

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);
    document.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleCanvasClick);

    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }
    };
  }, []);

  return (
    <>
      <canvas className="experience" ref={canvasRef}></canvas>
      <div className="scrollTarget" ref={scrollTargetRef}></div>
      <div className="vignette-radial"></div>
    </>
  );
};

export default LegacyRELOADED;
