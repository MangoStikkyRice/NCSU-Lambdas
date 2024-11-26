import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Quint, Expo, Linear } from 'gsap/all';
import NavBarNew from '../components/navbar/NavBarNew';
import * as d3 from 'd3';

// Gallery Photos: At least 3 members
import all1 from '../assets/images/LEG.jpg';
import all2 from '../assets/images/VISION.jpg';
import all3 from '../assets/images/tarunsalian4.jpg';

// Gallery Photos: Singles, duos, and trios
import tye1 from '../assets/images/tyerojanasoonthan4.jpg';
import jordan1 from '../assets/images/CORE_VALUES.jpg';
import brody1 from '../assets/images/brodyzhao2.jpg';
import dom1 from '../assets/images/domrivero3.jpg';
import charles1 from '../assets/images/charlesvillazor4.jpg';
import dylan1 from '../assets/images/dylanmurray3.jpg';

// Register GSAP plugins
gsap.registerPlugin(Draggable);

// YouTube Videos Data
const youtubeVideos = [
  { title: 'Charter Conquest', url: 'https://youtu.be/RUQTrrlLkx8', thumbnail: 'https://i.ytimg.com/vi/RUQTrrlLkx8/hqdefault.jpg', semester: 'Fall', year: 2016 },
  { title: 'Alpha Ascension', url: 'https://youtu.be/9zngWsr6LE4', thumbnail: 'https://i.ytimg.com/vi/9zngWsr6LE4/hqdefault.jpg', semester: 'Spring', year: 2017 },
  { title: 'Beta Battalion', url: 'https://youtu.be/DGXhEBjH81E', thumbnail: 'https://i.ytimg.com/vi/DGXhEBjH81E/hqdefault.jpg', semester: 'Fall', year: 2017 },
  { title: 'Gamma Guardians', url: 'https://youtu.be/OrSyEHm372o', thumbnail: 'https://i.ytimg.com/vi/OrSyEHm372o/hqdefault.jpg', semester: 'Spring', year: 2018 },
  { title: 'Delta Dimension', url: 'https://youtu.be/Wx1MEwTpfEo', thumbnail: 'https://i.ytimg.com/vi/Wx1MEwTpfEo/hqdefault.jpg', semester: 'Fall', year: 2018 },
  { title: 'Epsilon Eclipse', url: 'https://youtu.be/SBTsNR2__e4', thumbnail: 'https://i.ytimg.com/vi/SBTsNR2__e4/hqdefault.jpg', semester: 'Spring', year: 2019 },
  { title: 'Zeta Zaibatsu', url: 'https://youtu.be/VAUJxBy--yc', thumbnail: 'https://i.ytimg.com/vi/VAUJxBy--yc/hqdefault.jpg', semester: 'Fall', year: 2019 },
  { title: 'Iota Immortals', url: 'https://www.youtube.com/watch?v=TBdsb6LB-tg', thumbnail: 'https://i.ytimg.com/vi/TBdsb6LB-tg/hqdefault.jpg', semester: 'Spring', year: 2020 },
  { title: 'Mu Monarchs', url: 'https://youtu.be/ttDvgZ6D9NE', thumbnail: 'https://i.ytimg.com/vi/ttDvgZ6D9NE/hqdefault.jpg', semester: 'Fall', year: 2020 },
  { title: 'Nu Nen', url: 'https://youtu.be/VAHC-5UoZPY', thumbnail: 'https://i.ytimg.com/vi/VAHC-5UoZPY/hqdefault.jpg', semester: 'Spring', year: 2021 },
  { title: 'Xi Xin', url: 'https://youtu.be/6cm_sYJfTB8', thumbnail: 'https://i.ytimg.com/vi/6cm_sYJfTB8/hqdefault.jpg', semester: 'Fall', year: 2021 },
];

const Media = () => {
  const containerRef = useRef(null);
  const imgRefs = useRef([]);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);
  const [expandedNode, setExpandedNode] = useState(null);
  const [treemapNodes, setTreemapNodes] = useState([]);

  const imageUrls = [
    all1,
    all2,
    all3,
    tye1,
    jordan1,
    brody1,
    dom1,
    charles1,
    dylan1,
  ];

  const photoGalleryImages = imageUrls.map((url) => ({
    url,
    value: Math.floor(Math.random() * 100) + 50, // Random sizes between 50 and 149
  }));

  useEffect(() => {
    const width = 1000;
    const height = 600;

    const root = d3
      .hierarchy({ name: 'root', children: photoGalleryImages })
      .sum(d => d.value);

    d3.treemap()
      .size([width, height])
      .padding(2)(root);

    setTreemapNodes(root.leaves());
  }, []);

  useEffect(() => {
    const $imgs = imgRefs.current;
    const l = $imgs.length;
    const radius = 400;

    // Initial GSAP setup
    gsap.set(containerRef.current, {
      transformStyle: 'preserve-3d',
      perspective: 800,
      perspectiveOrigin: '50% 50%',
    });

    const posArray = [];
    const totalImgToView = 5;
    const imgMinus = 0.6301;
    let angle = 0;

    // Initialize current view index
    let curImgViewIndex = 0;

    // Initial setup with correct autoAlpha
    $imgs.forEach((item, i) => {
      angle = i * 0.63;
      const zPos = -Math.abs(angle * 100);
      const xPos = Math.sin(angle) * radius;
      posArray.push({ x: xPos, z: zPos, angle: angle });

      let imgAlpha = (Math.ceil(0.5 * totalImgToView) * imgMinus) * 100;
      imgAlpha = Math.abs(zPos) < imgAlpha ? 1 : 0;

      gsap.set(item, { x: xPos, z: zPos, autoAlpha: imgAlpha });
    });

    let autoRotateInterval = null;

    const rotate = (direction) => {
      return new Promise((resolve) => {
        const minusVal = direction === 'left' ? 0.6301 : -0.6301;

        // Update curImgViewIndex before the loop
        if (direction === 'left') {
          curImgViewIndex = Math.max(curImgViewIndex - 1, 0);
        } else {
          curImgViewIndex = Math.min(curImgViewIndex + 1, youtubeVideos.length - 1);
        }

        let animationsCompleted = 0;

        $imgs.forEach((item, i) => {
          const pos = posArray[i];
          pos.angle += minusVal;
          const angleDistance = pos.angle * 100;
          const zPos = -Math.abs(angleDistance);
          const xPos = Math.sin(pos.angle) * radius;
          let imgAlpha = (Math.ceil(0.5 * totalImgToView) * imgMinus) * 100;
          imgAlpha = Math.abs(zPos) < imgAlpha ? 1 : 0;
          let rotDeg = Math.round(angleDistance) >= 0 ? -30 : 30;
          rotDeg = Math.round(angleDistance) === 0 ? 0 : rotDeg;

          // Update z-index so that the current image has the highest value
          const zIndex = l - Math.abs(i - curImgViewIndex);

          // Set z-index immediately to avoid snapping effect
          gsap.set(item, { zIndex: zIndex });

          gsap.to(item, {
            duration: 0.1, // Speed up the animation
            x: xPos,
            z: zPos,
            ease: Expo.easeOut,
            autoAlpha: imgAlpha,
            rotationY: rotDeg,
            onComplete: () => {
              animationsCompleted++;
              if (animationsCompleted === $imgs.length) {
                resolve();
              }
            },
          });
        });
      });
    };

    const showImgAt = async (index) => {
      const deltaIndex = index - curImgViewIndex;
      const steps = Math.abs(deltaIndex);
      const direction = deltaIndex > 0 ? 'right' : 'left';

      for (let i = 0; i < steps; i++) {
        await rotate(direction);
      }
    };

    const startAutoRotateLeft = () => {
      clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(() => {
        if (curImgViewIndex > 0) {
          rotate('left');
        } else {
          clearInterval(autoRotateInterval);
        }
      }, 100); // Faster interval
    };

    const startAutoRotateRight = () => {
      clearInterval(autoRotateInterval);
      autoRotateInterval = setInterval(() => {
        if (curImgViewIndex < youtubeVideos.length - 1) {
          rotate('right');
        } else {
          clearInterval(autoRotateInterval);
        }
      }, 100); // Faster interval
    };

    const stopAutoRotate = () => {
      clearInterval(autoRotateInterval);
    };

    // Add event listeners to the arrows
    leftArrowRef.current.addEventListener('mousedown', startAutoRotateLeft);
    leftArrowRef.current.addEventListener('mouseup', stopAutoRotate);
    leftArrowRef.current.addEventListener('mouseleave', stopAutoRotate);
    leftArrowRef.current.addEventListener('touchstart', startAutoRotateLeft);
    leftArrowRef.current.addEventListener('touchend', stopAutoRotate);

    rightArrowRef.current.addEventListener('mousedown', startAutoRotateRight);
    rightArrowRef.current.addEventListener('mouseup', stopAutoRotate);
    rightArrowRef.current.addEventListener('mouseleave', stopAutoRotate);
    rightArrowRef.current.addEventListener('touchstart', startAutoRotateRight);
    rightArrowRef.current.addEventListener('touchend', stopAutoRotate);

    // Click on images
    $imgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        showImgAt(index);
      });
    });

    // Start up animation
    (async () => {
      await showImgAt(5);
    })();

    // Cleanup on unmount
    return () => {
      clearInterval(autoRotateInterval);

      // Remove event listeners
      leftArrowRef.current.removeEventListener('mousedown', startAutoRotateLeft);
      leftArrowRef.current.removeEventListener('mouseup', stopAutoRotate);
      leftArrowRef.current.removeEventListener('mouseleave', stopAutoRotate);
      leftArrowRef.current.removeEventListener('touchstart', startAutoRotateLeft);
      leftArrowRef.current.removeEventListener('touchend', stopAutoRotate);

      rightArrowRef.current.removeEventListener('mousedown', startAutoRotateRight);
      rightArrowRef.current.removeEventListener('mouseup', stopAutoRotate);
      rightArrowRef.current.removeEventListener('mouseleave', stopAutoRotate);
      rightArrowRef.current.removeEventListener('touchstart', startAutoRotateRight);
      rightArrowRef.current.removeEventListener('touchend', stopAutoRotate);

      $imgs.forEach((img) => img.removeEventListener('click', () => {}));
    };
  }, []);

  return (
    <div className='media-page'>
      <NavBarNew />
      <div className="media-title">Reveals</div>
      <div className="carousel-container">
        <div className="arrow left-arrow" ref={leftArrowRef}>❮</div>
        <div className="container" ref={containerRef}>
          {youtubeVideos.map((video, index) => (
            <div
              className="img-holder"
              key={index}
              ref={(el) => (imgRefs.current[index] = el)}
            >
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-title">{video.title}</div>
            </div>
          ))}
        </div>
        <div className="arrow right-arrow" ref={rightArrowRef}>❯</div>
      </div>

      <div className="gallery-wrapper">
        <div className="gallery-title">Photo Gallery</div>
        <div className="windirstat-gallery">
          {treemapNodes.map((node, index) => (
            <div
              key={index}
              className={`treemap-node ${expandedNode === node ? 'expanded' : ''}`}
              style={{
                left: expandedNode === node ? 0 : node.x0,
                top: expandedNode === node ? 0 : node.y0,
                width: expandedNode === node ? '100%' : node.x1 - node.x0,
                height: expandedNode === node ? '100%' : node.y1 - node.y0,
                backgroundImage: `url(${node.data.url})`,
              }}
              onClick={() => {
                // Toggle the expanded state
                setExpandedNode(expandedNode === node ? null : node);
              }}
            ></div>
          ))}
        </div>
      </div>
      {/* Container to make space for the footer. */}
      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2024 NC State Lambda Phi Epsilon. All rights reserved.</p>
          <p>Designed, Built, Tested by Jordan <strong>'InterstellHer'</strong> Miller.</p>
          <nav className="footer-nav">
            <ul>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
};

export default Media;
