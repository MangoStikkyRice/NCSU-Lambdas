import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './LegacyRELOADED.scss';
import NavBarNew from '../components/navbar/NavBarNew';

// Register GSAP ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Import images
import firstImage from '../assets/images/Crest (1).png';
import placeholderImage from '../assets/images/GRACEYANG.png';
import secondImage from '../assets/images/EVANCHEN.png';
import fourthImage from '../assets/images/BTM.png';
import fifthImage from '../assets/images/constitution.jpg';

const LegacyRELOADED = () => {
  // Refs and state
  const canvasRef = useRef(null);
  const scrollTargetRef = useRef(null);
  const [showOverlay, setShowOverlay] = useState(true);

  // Define fixed font sizes
  const titleFontSize = 48; // px
  const paragraphFontSize = 18; // px
  const readMoreFontSize = 16; // px
  const buttonFontSize = 20; // px

  // Helper function to paginate text
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

  useEffect(() => {
    // Variables
    let hoveredObject = null;
    const baseLineHeight = 23; // Base line height for paragraphs
    const baseTitleLineHeight = 55; // Base line height for titles

    // Math utilities
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

    // Get device pixel ratio
    const dpr = window.devicePixelRatio || 1;

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

    // Create an empty scene with fog
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x194794, 0, 100);

    // Create a perspective camera
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
      shininess: 100, // Increased shininess for more specular highlights
      bumpMap: bumpMap,
      bumpScale: -0.03,
      specular: 0x555555, // Adjust specular color for better highlights
      transparent: true,
      opacity: 0.5, // Slightly increased opacity
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

    // Add point light to the scene
    const light = new THREE.PointLight(0xffffff, 1, 1000, 2); // Increased intensity and range

    light.castShadow = true;
    scene.add(light);
// Point Light
const pointLight = new THREE.PointLight(0xffffff, 2, 1000, 2); // Increased intensity from 1 to 2
pointLight.castShadow = true;
scene.add(pointLight);

// Ambient Light
const ambientLight = new THREE.AmbientLight(0x404040, 2); // Increased intensity from 1 to 2
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 1); // Increased intensity from 0.5 to 1
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

    // Define content data with images, text, and buttons
    const originalContentData = [
      {
        percentage: 0.1,
        text: 'National History',
        paragraph:
          'Lambda Phi Epsilon was founded on February 25, 1981 by a group of nineteen dedicated men led by principal founder Mr. Craig Ishigo. Hoping to transcend the traditional boundaries of national origins, the founders aimed to create an organization that would set new standards of excellence within the Asian American community, develop leaders within each of the member’s respective community, and bridge the gaps between those communities. While the initial charter was comprised of Asian Pacific Americans, the brotherhood was open to all who were interested in supporting these goals. Mr. Craig Ishigo and Mr. Darryl L. Mu signed the charter as President and Vice President, respectively.\n\nOn May 28th, 1990, the fraternity, now with six chapters total, convened on the campus of the University of California, Irvine for the first annual National Convention, which to this day has been held regularly over Memorial Day weekend. A national governing body was established to oversee the development of individual chapters and the fraternity as a whole, with Mr. Robert Mimaki, Mr. Eric Naritomi, and Mr. Doug Nishida appointed as National President, Northern Governor and Southern Governor, respectively. On September 8th, 1990, Lambda Phi Epsilon reached another milestone and became the first and only nationally recognized Asian American interest fraternity in the United States with the admission to the National Interfraternity Conference. In 2006, Lambda Phi Epsilon joined the National Asian Pacific Islander American Panhellenic Association to increase collaboration and partnership between fellow APIA Greek organizations.\n\nToday, Lambda Phi Epsilon is widely renown as the preeminent international Asian interest fraternal organization, providing outstanding leadership, philanthropy, and advocacy in the community.\n\nOur mission is to guide men on a lifelong discovery of authenticity and personal growth in a world where Lambda men live authentic, fulfilling lives and contribute through the pursuit of their noble purpose. To Authenticity, Courageous Leadership, Cultural Heritage, Love, and Wisdom, since February 25, 1981.',
        image: firstImage,
        link: 'http://example.com/genesis',
        buttonText: 'International News →',
      },
      {
        percentage: 0.3,
        text: 'Honoring Evan Chen',
        paragraph:
          'In 1995, Evan Chen, a member of Theta Chapter at Stanford University, was diagnosed with leukemia. Their chapter, along with Evan’s friends, organized a joint effort to find a bone marrow donor. What resulted was the largest bone marrow typing drive in the history of the NMDP and Asian American Donor Program (AADP). In a matter of days, over two thousand people were typed. A match was eventually found for Evan, but unfortunately by that time the disease had taken its toll on him and he passed away in 1996. In Evan’s memory, the national philanthropy for Lambda Phi Epsilon was established and the fraternity has been working with the organization from that point forward.',
        image: secondImage,
        link: 'https://www.nmdp.org/',
        buttonText: 'Explore NMDP →',
      },
      {
        percentage: 0.5,
        text: 'Be the Match',
        paragraph:
          'Lambda Phi Epsilon works with the National Marrow Donor Program to save the lives of patients requiring bone marrow transplants. Additionally, the fraternity promotes awareness for leukemia and other blood disorders. Individuals who suffer from these types of illnesses depend on donors with similar ethnic backgrounds to find compatible bone marrow matches. Thus, the fraternity aims to register as many committed donors to the cause through local #NMDP campaigns to increase the chances for patients to find a life-saving donor.',
        image: placeholderImage,
        link: 'https://www.mskcc.org/news/stem-cell-bone-marrow-donation-process',
        buttonText: 'The Donation Process →',
      },
      {
        percentage: 0.7,
        text: 'International Commitment',
        paragraph:
          "Every Lambda Phi Epsilon chapter works with the AADP, Asians for Miracle Marrow Matches, and the Cammy Lee Leukemia Foundation to hold bone marrow typing drives on their campuses to encourage Asians and other minorities to register as committed bone marrow/stem cell donors. Since the fraternity's inception, Lambda Phi Epsilon has educated thousands of donors to commit to saving the life of a patient in need.",
        image: fourthImage,
        link: 'https://my.bethematch.org/s/join?language=en_US&joinCode=recruithome&_ga=2.51664814.649395165.1719235886-1741193351.1716920694',
        buttonText: 'Join the Registry! →',
      },
      {
        percentage: 0.9,
        text: 'The Constitution',
        paragraph:
          "The following document is this chapter's Constitution, which contains all of the bylaws and processes in which this organization follows. Please feel free to look through them learn about how this chapter operates.",
        image: fifthImage,
        link: 'http://example.com/constitution',
        buttonText: 'Constitution PDF →',
      },
    ];

    // Process content data to include pagination
    const contentData = originalContentData.map((content) => ({
      ...content,
      pages: paginateText(content.paragraph, 500),
    }));

    // Array to store sprites for later visibility control
    const contentSprites = [];

    // Compute Frenet frames for the path
    const frames = path.computeFrenetFrames(1000, false);

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
  const titleMaxWidth = 480; // Fixed maxWidth based on canvas size
  let titleX = 10;
  let titleY = 10;

  const titleLines = wrapText(textContext, content.text, titleMaxWidth);

  // **Draw the blue banner once, before iterating over title lines**
  const bannerX = 0;
  const bannerY = titleY - 12; // Slight padding above
  const bannerWidth = 500; // Fixed banner width
  const bannerHeight = titleLines.length * (titleFontSize + 10) + 10; // Fixed banner height

  const gradient = textContext.createLinearGradient(
    bannerX,
    bannerY,
    bannerX + bannerWidth,
    bannerY
  );
  gradient.addColorStop(0, '#203c79'); // Darker blue at the top
  gradient.addColorStop(1, 'rgba(32, 60, 121, 0)'); // Lighter blue at the bottom

  textContext.fillStyle = gradient;
  textContext.fillRect(bannerX, bannerY, bannerWidth, bannerHeight);

  // Set shadow for the text
  textContext.shadowColor = 'rgba(0, 0, 0, 1)';
  textContext.shadowBlur = 3;
  textContext.shadowOffsetX = 0;
  textContext.shadowOffsetY = 3;

  // Iterate over each title line and draw it
  titleLines.forEach(line => {
    textContext.fillStyle = 'white';
    textContext.fillText(line, titleX + 10, titleY);
    titleY += titleFontSize + 10; // Fixed line height
  });

  // **Remove the banner drawing from inside the loop**

  // Draw the paragraph
  textContext.font = `${paragraphFontSize}px Arial`;
  textContext.fillStyle = 'white';
  const maxWidth = 450; // Fixed maxWidth based on canvas size
  let x = 10;
  let y = titleY + 20; // Fixed spacing after title

  // Define paragraph spacing
  const paragraphSpacing = 10; // Fixed spacing

  // Split content into paragraphs
  const paragraphs = pageContent.split('\n\n');

  paragraphs.forEach((paragraph, pIndex) => {
    const lines = wrapText(textContext, paragraph, maxWidth);
    lines.forEach(line => {
      textContext.fillText(line, x, y);
      y += paragraphFontSize + 10; // Fixed line height
    });

    // Add paragraph spacing after each paragraph except the last one
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
    textContext.fillText('Read more...', x, y + 20); // Position below the last line
  }

  // Update the texture
  textTexture.needsUpdate = true;
};
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
      const textCanvasWidth = 900; // Fixed width
      const textCanvasHeight = 600; // Fixed height

      contentData.forEach((content) => {
        // Create image canvas
        const imageCanvas = document.createElement('canvas');
        const canvasSize = 512; // Fixed canvas size
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
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          depthTest: true,
          depthWrite: true,
          alphaTest: 0.1,
        });

        const sprite = new THREE.Sprite(spriteMaterial);
        const spriteSize = 5; // Desired size
        sprite.scale.set(spriteSize, spriteSize, 1);

        // Position the image sprite at the origin of the group
        sprite.position.set(0, 0, 0);

        // Add the image sprite to the group
        imageGroup.add(sprite);

        // Create button canvas
        const buttonCanvasWidth = 300; // Fixed width
        const buttonCanvasHeight = 50; // Fixed height
        const buttonCanvas = document.createElement('canvas');
        buttonCanvas.width = buttonCanvasWidth;
        buttonCanvas.height = buttonCanvasHeight;
        const buttonContext = buttonCanvas.getContext('2d');

        // Create texture from canvas
        const buttonTexture = new THREE.CanvasTexture(buttonCanvas);
        buttonTexture.needsUpdate = true;

        // Create sprite material for the button
        const buttonSpriteMaterial = new THREE.SpriteMaterial({
          map: buttonTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          depthTest: true,
          depthWrite: true,
          alphaTest: 0.1,
        });

        // Create sprite for the button
        const buttonSprite = new THREE.Sprite(buttonSpriteMaterial);
        const buttonSpriteHeight = 1; // Adjust size as needed
        const buttonSpriteWidth =
          buttonSpriteHeight * (buttonCanvasWidth / buttonCanvasHeight);
        buttonSprite.scale.set(buttonSpriteWidth, buttonSpriteHeight, 1);

        // Assign scales to contentSprite
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

        // Position the button sprite below the image sprite within the group
        buttonSprite.position.set(
          0,
          -spriteSize / 2 - buttonSpriteHeight / 2,
          0
        );

        // Add the button sprite to the group
        imageGroup.add(buttonSprite);

        // Position the group along the path
        const percentage = content.percentage % 1;
        const position = path.getPointAt(percentage);

        // Compute the tangent and right vectors
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

        const offsetLeft = -3; // Distance to the left

        // Then place the entire group along the path
        imageGroup.position
          .copy(position)
          .add(right.clone().multiplyScalar(offsetLeft));

        // Rotate the group so that it faces towards the camera
        imageGroup.quaternion.copy(camera.quaternion);

        // Create text canvas
        const textCanvas = document.createElement('canvas');
        textCanvas.width = 900; // Fixed width
        textCanvas.height = 600; // Fixed height
        const textContext = textCanvas.getContext('2d');

        const textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.needsUpdate = true;

        const textSpriteMaterial = new THREE.SpriteMaterial({
          map: textTexture,
          side: THREE.DoubleSide,
          transparent: true,
          opacity: 0,
          depthTest: true,
          depthWrite: true,
          alphaTest: 0.1,
        });

        const textSprite = new THREE.Sprite(textSpriteMaterial);
        const textSpriteHeight = 7.5; // Desired height
        const textSpriteWidth = (textCanvas.width / textCanvas.height) * textSpriteHeight;
        textSprite.scale.set(textSpriteWidth, textSpriteHeight, 1);

        // Create group for text
        const textGroup = new THREE.Group();
        textGroup.add(textSprite);

        const verticalOffset = -2; // Adjust this value as needed
        const offsetRight = 5.5; // Distance to the right
        textGroup.position.copy(position).add(right.clone().multiplyScalar(offsetRight)).add(new THREE.Vector3(0, verticalOffset, 0));

        // Ensure textGroup faces the camera
        textGroup.quaternion.copy(camera.quaternion);

        // Assign additional properties to contentSprite
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

        // Link textSprite to contentSprite
        textSprite.userData = {
          type: 'textSprite',
          contentSprite: contentSprite,
        };

        // Link buttonSprite to contentSprite
        buttonSprite.userData = {
          type: 'buttonSprite',
          contentSprite: contentSprite,
        };

        // Initial drawing of the text canvas
        drawTextCanvas(contentSprite);

        // Initial drawing of the button canvas
        drawButtonCanvas(contentSprite);

        // Add groups to the scene
        scene.add(imageGroup);
        scene.add(textGroup);

        // Store the sprites for later use
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

        const minDistance = 20; // Distance within which opacity is 1
        const maxDistance = 25; // Distance beyond which opacity is 0

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

      requestAnimationFrame(render);
    };
    requestAnimationFrame(render);

    // Raycaster for click detection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Event handlers
    const handleMouseMove = (event) => {
      // Update camera rotation proxies based on mouse position
      cameraRotationProxyX = Mathutils.map(event.clientX, 0, window.innerWidth, 3.24, 3.04);
      cameraRotationProxyY = Mathutils.map(event.clientY, 0, window.innerHeight, -0.1, 0.1);

      // Update mouse position in normalized device coordinates (-1 to +1)
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Array of clickable objects
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
                // Animate scale up using GSAP
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
                // Animate scale back to original
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
            // Animate scale back to original
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
      // Get mouse position in normalized device coordinates (-1 to +1)
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Array of clickable objects
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
                  contentSprite.currentPage = 0; // Wrap around to the beginning
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

    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      renderer.setSize(width, height);

      // Do NOT adjust text or button canvases here
    };

    const handleScroll = () => {
      if (window.scrollY > 50) {
        setShowOverlay(false);
      } else {
        setShowOverlay(true);
      }
    };

let touchStartX = 0;

const handleTouchStart = (e) => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
};

const handleTouchMove = (e) => {
  if (!e.touches.length) return;

  const touch = e.touches[0];
  const deltaX = touch.clientX - touchStartX;

  // Adjust camera rotation based on swipe distance
  cameraRotationProxyX += deltaX * 0.005; // Adjust sensitivity as needed

  touchStartX = touch.clientX;
};

const isMobile = /Mobi|Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

window.addEventListener('scroll', handleScroll);
window.addEventListener('resize', handleResize);
document.addEventListener('touchstart', handleTouchStart, { passive: true });
document.addEventListener('touchmove', handleTouchMove, { passive: true });

// Only add mouse-based movement for desktop
if (!isMobile) {
  document.addEventListener('mousemove', handleMouseMove);
  // If you truly want to allow pinch/drag for tablets in desktop mode, you can also:
  // document.addEventListener('touchstart', handleTouchStart, { passive: true });
  // document.addEventListener('touchmove', handleTouchMove, { passive: true });
}

// Regardless of mobile vs. desktop, we still want clicks to paginate text
// so the user can read pages. This does NOT move camera.
if (canvasRef.current) {
  canvasRef.current.addEventListener('click', handleCanvasClick);
}

return () => {
  window.removeEventListener('scroll', handleScroll);
  window.removeEventListener('resize', handleResize);
  document.removeEventListener('touchstart', handleTouchStart);
  document.removeEventListener('touchmove', handleTouchMove);

  if (!isMobile) {
    document.removeEventListener('mousemove', handleMouseMove);
    // document.removeEventListener('touchstart', handleTouchStart);
    // document.removeEventListener('touchmove', handleTouchMove);
  }

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
