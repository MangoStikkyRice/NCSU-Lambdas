import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LegacyRELOADED.scss';
import NavBarNew from '../components/navbar/NavBarNew'

gsap.registerPlugin(ScrollTrigger);

import firstImage from '../assets/images/Crest (1).png'
import placeholderImage from '../assets/images/GRACEYANG.png';
import secondImage from '../assets/images/EVANCHEN.png';
import fourthImage from '../assets/images/BTM.png';
import fifthImage from '../assets/images/constitution.jpg';

const LegacyRELOADED = () => {
  const canvasRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);
  useEffect(() => {

    let hoveredButton = null;

    const lineHeight = 23; // Adjust based on your font size
    const titleLineHeight = 55; // Adjust based on your font size


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
      opacity: .4,
    });

    // Create a mesh
    const tube = new THREE.Mesh(geometry, material);
    scene.add(tube);

    // Inner tube
    const geometry2 = new THREE.TubeGeometry(path, 150, 6.8, 32, false);
    const geo = new THREE.EdgesGeometry(geometry2);

    const mat = new THREE.LineBasicMaterial({
      linewidth: 1,
      opacity: 0.05,
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

    const particleCount = 8400;
    const positions1 = new Float32Array(particleCount * 3);
    const positions2 = new Float32Array(particleCount * 3);
    const positions3 = new Float32Array(particleCount * 3);

    const pMaterial = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.5,
      map: spikeyTexture,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false, // Disable depth writing
      alphaTest: 0.04,    // Optional: Discard pixels with alpha < 0.5
      sizeAttenuation: true, // Ensures size scales with distance
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
        text: 'National History',
        paragraph: 'Our mission is to guide men on a lifelong discovery of authenticity and personal growth in a world where Lambda men live authentic, fulfilling lives and contribute through the pursuit of their noble purpose. To Authenticity, Courageous Leadership, Cultural Heritage, Love, and Wisdom, since February 25, 1981. ',
        image: firstImage,
        link: 'http://example.com/genesis', // Add your link here
        buttonText: 'International News →'
      },
      {
        percentage: 0.3,
        text: 'Honoring Evan Chen',
        paragraph:
          'In 1995, Evan Chen, a member of Theta Chapter at Stanford University, was diagnosed with leukemia. Their chapter, along with Evan’s friends, organized a joint effort to find a bone marrow donor. What resulted was the largest bone marrow typing drive in the history of the NMDP and Asian American Donor Program (AADP). In a matter of days, over two thousand people were typed. A match was eventually found for Evan, but unfortunately by that time the disease had taken its toll on him and he passed away in 1996. In Evan’s memory, the national philanthropy for Lambda Phi Epsilon was established and the fraternity has been working with the organization from that point forward.',
        image: secondImage,
        link: 'https://www.nmdp.org/',
        buttonText: 'Explore NMDP →'
      },
      {
        percentage: 0.5,
        text: 'Be the Match',
        paragraph:
          'Lambda Phi Epsilon works with the National Marrow Donor Program to save the lives of patients requiring bone marrow transplants. Additionally, the fraternity promotes awareness for leukemia and other blood disorders. Individuals who suffer from these types of illnesses depend on donors with similar ethnic backgrounds to find compatible bone marrow matches. Thus, the fraternity aims to register as many committed donors to the cause through local #NMDP campaigns to increase the chances for patients to find a life-saving donor.',
        image: placeholderImage,
        link: 'https://www.mskcc.org/news/stem-cell-bone-marrow-donation-process',
        buttonText: 'The Donation Process →'
      },
      {
        percentage: 0.7,
        text: 'International Commitment',
        paragraph:
          "Every Lambda Phi Epsilon chapter works with the AADP, Asians for Miracle Marrow Matches, and the Cammy Lee Leukemia Foundation to hold bone marrow typing drives on their campuses to encourage Asians and other minorities to register as committed bone marrow/stem cell donors. Since the fraternity's inception, Lambda Phi Epsilon has educated thousands of donors to commit to saving the life of a patient in need.",
        image: fourthImage,
        link: 'https://my.bethematch.org/s/join?language=en_US&joinCode=recruithome&_ga=2.51664814.649395165.1719235886-1741193351.1716920694',
        buttonText: 'Join the Registry! →'
      },
      {
        percentage: 0.9,
        text: 'The Constitution',
        paragraph: 'The following document is this chapter\'s Constitution, which contains all of the bylaws and processes in which this organization follows. Please feel free to look through them learn about how this chapter operates.',
        image: fifthImage,
        link: 'http://example.com/constitution',
        buttonText: 'Constitution PDF →'
      },
    ];

    // Array to store sprites for later visibility control
    const contentSprites = [];

    // Functions moved outside the loop so they are accessible in event handlers

    function drawTextCanvas(contentSprite) {
      const {
        textCanvas,
        textContext,
        content,
        textTexture,
        visibleTextHeight,
      } = contentSprite;

      // Clear the canvas
      textContext.clearRect(0, 0, textCanvas.width, textCanvas.height);

      // Save the context state
      textContext.save();

      // Determine the clipping height
      const clipHeight =
        visibleTextHeight !== undefined ? visibleTextHeight : textCanvas.height;

      // Set the clipping region based on visibleTextHeight
      textContext.beginPath();
      textContext.rect(0, 0, textCanvas.width, clipHeight);
      textContext.clip();

      // Set common text properties
      textContext.textAlign = 'left';
      textContext.textBaseline = 'top';

      // **Calculate the position and size of the title text**
      textContext.font = 'Bold 48px Arial';
      const titleMaxWidth = textCanvas.width - 450;
      let titleX = 10;
      let titleY = 10;

      const titleWords = content.text.split(' ');
      let titleLine = '';
      const titleLines = [];

      for (let i = 0; i < titleWords.length; i++) {
        const testLine = titleLine + titleWords[i] + ' ';
        const testWidth = textContext.measureText(testLine).width;

        if (testWidth > titleMaxWidth && i > 0) {
          titleLines.push(titleLine);
          titleLine = titleWords[i] + ' ';
        } else {
          titleLine = testLine;
        }
      }
      titleLines.push(titleLine);

      // Calculate title height
      const titleHeight = titleLines.length * titleLineHeight;
      contentSprite.titleHeight = titleHeight;

      // **Draw the blue banner behind the title text**
      // Set banner dimensions
      const bannerX = 0;
      const bannerY = titleY - 12; // Slightly adjust to add padding above
      const bannerWidth = textCanvas.width - 480;
      const bannerHeight = titleHeight + 10; // Add padding below

      // Create a gradient for the banner to give it a 3D look (optional)
      const gradient = textContext.createLinearGradient(
        bannerX,
        bannerY,
        bannerX + bannerWidth,
        bannerY,
      );
      gradient.addColorStop(0, '#203c79'); // Darker blue at the top
      gradient.addColorStop(1, 'rgba(32, 60, 121, 0)'); // Lighter blue at the bottom

      // Draw the banner rectangle
      textContext.fillStyle = gradient;
      textContext.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);


      // Before drawing the banner
      textContext.shadowColor = 'rgba(0, 0, 0, 1)';
      textContext.shadowBlur = 5;
      textContext.shadowOffsetX = 0;
      textContext.shadowOffsetY = 5;
      // **Now draw the title text over the banner**
      textContext.fillStyle = 'white'; // Title text color
      titleY += 0; // Adjust if needed
      for (let i = 0; i < titleLines.length; i++) {
        textContext.fillText(titleLines[i], titleX + 10, titleY);
        titleY += titleLineHeight;
      }

      // **Draw the paragraph text**
      textContext.font = '18px Arial';
      textContext.fillStyle = 'white';
      textContext.textAlign = 'left';
      const maxWidth = textCanvas.width - 550;
      let x = 10;
      let y = titleY + 10;

      const words = content.paragraph.split(' ');
      let line = '';
      const lines = [];

      // Break paragraph into lines
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

      // Draw all lines
      for (let i = 0; i < lines.length; i++) {
        textContext.fillText(lines[i], x, y);
        y += lineHeight;
      }

      // Calculate total paragraph height
      const totalParagraphHeight = y - (titleY + 10);
      contentSprite.totalParagraphHeight = totalParagraphHeight;

      // Restore the context state
      textContext.restore();

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

      // Draw the button text
      readMoreButtonContext.fillStyle = '#92aed8';
      readMoreButtonContext.font = '48px Arial';
      readMoreButtonContext.textAlign = 'center';
      readMoreButtonContext.textBaseline = 'middle';

      // Before drawing the banner
      readMoreButtonContext.shadowColor = 'rgba(0, 0, 0, 1)';
      readMoreButtonContext.shadowBlur = 5;
      readMoreButtonContext.shadowOffsetX = 0;
      readMoreButtonContext.shadowOffsetY = 5;

      const buttonText = expanded ? 'Show Less' : 'Read More';

      readMoreButtonContext.fillText(
        buttonText,
        readMoreButtonCanvas.width / 2,
        readMoreButtonCanvas.height / 2
      );

      // Update the texture
      readMoreButtonTexture.needsUpdate = true;
    }

    function updateButtonPositions(contentSprite) {
      const {
        textSpriteHeight,
        textCanvasHeight,
        visibleTextHeight,
        readMoreButtonSprite,
        readMoreButtonHeight,
        learnMoreButtonSprite,
        learnMoreButtonHeight,
      } = contentSprite;

      // Compute the fraction of the text sprite occupied by the visible text
      const visibleFraction = visibleTextHeight / textCanvasHeight;

      // Adjust the position calculation for the "Read More" button
      const marginBetweenTextAndButton = 0.3; // Adjust as needed
      const readMoreButtonOffsetY =
        (textSpriteHeight / 2) -
        (visibleFraction * textSpriteHeight) -
        readMoreButtonHeight / 2 -
        marginBetweenTextAndButton;

      readMoreButtonSprite.position.set(0, readMoreButtonOffsetY, 0);

      // Position the "Learn More" button at a fixed position at the bottom
      const marginAboveLearnMoreButton = -.5; // Adjust as needed
      const learnMoreButtonOffsetY =
        -textSpriteHeight / 2 +
        learnMoreButtonHeight / 2 +
        marginAboveLearnMoreButton;

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
        // Determine image and canvas aspect ratios
        const imgAspect = img.width / img.height;
        const canvasAspect = imageCanvas.width / imageCanvas.height;

        // Adjust to fit within the canvas
        if (imgAspect > canvasAspect) {
          // Image is wider than canvas
          const scale = imageCanvas.width / img.width;
          const renderableWidth = img.width * scale;
          const renderableHeight = img.height * scale;
          const xStart = (imageCanvas.width - renderableWidth) / 2;
          const yStart = (imageCanvas.height - renderableHeight) / 2;

          // Draw centered image
          imageContext.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
        } else {
          // Image is taller than canvas
          const scale = imageCanvas.height / img.height;
          const renderableWidth = img.width * scale;
          const renderableHeight = img.height * scale;
          const xStart = (imageCanvas.width - renderableWidth) / 2;
          const yStart = (imageCanvas.height - renderableHeight) / 2;

          // Draw centered image
          imageContext.drawImage(img, xStart, yStart, renderableWidth, renderableHeight);
        }

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
      const textCanvasWidth = 512;
      const textCanvasHeight = 512;

      // Create the canvas
      const textCanvas = document.createElement('canvas');


      // Get device pixel ratio
      const dpr = window.devicePixelRatio || 1;

      // Set the canvas dimensions to actual pixel dimensions
      textCanvas.width = textCanvasWidth * dpr;
      textCanvas.height = textCanvasHeight * dpr;

      // Get the context and scale it
      const textContext = textCanvas.getContext('2d');
      textContext.scale(dpr, dpr);

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
      readMoreButtonCanvas.width = 250;
      readMoreButtonCanvas.height = 90;
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
      buttonCanvas.width = 400;
      buttonCanvas.height = 120;
      const buttonContext = buttonCanvas.getContext('2d');

      const buttonText = content.buttonText || 'Learn More'; // Default if no text provided


      // Draw the button text
      buttonContext.fillStyle = 'white';
      buttonContext.font = '36px Arial';
      buttonContext.textAlign = 'center';
      buttonContext.textBaseline = 'middle';
      buttonContext.fillText(
        buttonText,
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
      const buttonWidth = 4; // Adjust as needed
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

      // Set initial visibleTextHeight based on collapsed or expanded state
      if (contentSprite.expanded) {
        contentSprite.visibleTextHeight =
          contentSprite.titleHeight + contentSprite.totalParagraphHeight + 20;
      } else {
        const collapsedParagraphHeight = 3 * lineHeight; // Adjust based on your line height
        contentSprite.visibleTextHeight =
          contentSprite.titleHeight + collapsedParagraphHeight + 20;
      }

      // Initial drawing to calculate titleHeight and totalParagraphHeight
      drawTextCanvas(contentSprite);

      // Set initial visibleTextHeight based on collapsed or expanded state
      if (contentSprite.expanded) {
        contentSprite.visibleTextHeight =
          contentSprite.titleHeight + contentSprite.totalParagraphHeight + 20;
      } else {
        const collapsedParagraphHeight = 3 * lineHeight; // Adjust based on your line height
        contentSprite.visibleTextHeight =
          contentSprite.titleHeight + collapsedParagraphHeight + 20;
      }

      // Redraw the text canvas with the updated visibleTextHeight
      drawTextCanvas(contentSprite);
      updateReadMoreButtonText(contentSprite);
      updateButtonPositions(contentSprite);
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
        const intersectedObject = intersects[0].object;

        // Change cursor to pointer
        canvasRef.current.style.cursor = 'pointer';

        if (hoveredButton !== intersectedObject) {
          // Mouse has entered a new button
          if (hoveredButton) {
            // Reset scale of the previous button
            gsap.to(hoveredButton.scale, {
              x: hoveredButton.userData.originalScale.x,
              y: hoveredButton.userData.originalScale.y,
              z: hoveredButton.userData.originalScale.z,
              duration: 0.2,
            });
          }

          // Save the original scale if not already saved
          if (!intersectedObject.userData.originalScale) {
            intersectedObject.userData.originalScale =
              intersectedObject.scale.clone();
          }

          // Scale up the new button
          gsap.to(intersectedObject.scale, {
            x: intersectedObject.scale.x * 1.1,
            y: intersectedObject.scale.y * 1.1,
            z: intersectedObject.scale.z * 1.1,
            duration: 0.2,
          });

          // Update hoveredButton
          hoveredButton = intersectedObject;
        }
      } else {
        // No intersects
        // Revert cursor to default
        canvasRef.current.style.cursor = 'default';

        if (hoveredButton) {
          // Reset scale of the previous button
          gsap.to(hoveredButton.scale, {
            x: hoveredButton.userData.originalScale.x,
            y: hoveredButton.userData.originalScale.y,
            z: hoveredButton.userData.originalScale.z,
            duration: 0.2,
          });
          hoveredButton = null;
        }
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

            // Calculate target visibleTextHeight
            let targetHeight;
            if (contentSprite.expanded) {
              targetHeight =
                contentSprite.titleHeight +
                contentSprite.totalParagraphHeight +
                20; // Additional spacing if needed
            } else {
              const collapsedParagraphHeight = 3 * lineHeight; // Adjust based on your line height
              targetHeight = contentSprite.titleHeight + collapsedParagraphHeight + 20;
            }

            // Animate visibleTextHeight using GSAP
            gsap.to(contentSprite, {
              visibleTextHeight: targetHeight,
              duration: 0.5, // Animation duration
              ease: 'power2.out',
              onUpdate: () => {
                // Redraw the text canvas with the updated clipping region
                drawTextCanvas(contentSprite);

                // Update button positions
                updateButtonPositions(contentSprite);
              },
            });
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


    // Handle scroll to hide overlay
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowOverlay(false);
      } else {
        setShowOverlay(true);
      }
    };

    window.addEventListener('scroll', handleScroll);

    window.addEventListener('resize', handleResize);
    // Existing mouse event listeners
    document.addEventListener('mousemove', handleMouseMove);
    canvasRef.current.addEventListener('click', handleCanvasClick);
    // Cleanup function
    return () => {
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      if (canvasRef.current) {
        canvasRef.current.removeEventListener('click', handleCanvasClick);
      }
    };

  }, []);

  return (
    <>
      <NavBarNew />
      {showOverlay && (
        <div className={`intro-overlay ${!showOverlay ? 'hide' : ''}`}>
          <div className="intro-text">
            Scroll through our Legacy
            <div className="arrow-down"></div>
          </div>
        </div>
      )}
      <canvas className="experience" ref={canvasRef}></canvas>
      <div className="scrollTarget" ref={scrollTargetRef}></div>
      <div className="vignette-radial"></div>
    </>
  );
};

export default LegacyRELOADED;
