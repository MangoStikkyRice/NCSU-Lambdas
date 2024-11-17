import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { Quint, Expo, Linear, Sine } from 'gsap/all';

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
  const scrollerRef = useRef(null);
  const inputRef = useRef(null);
  const imgRefs = useRef([]);

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

    $imgs.forEach((item, i) => {
      angle = i * 0.63;
      const zPos = -Math.abs(angle * 100);
      const xPos = Math.sin(angle) * radius;
      posArray.push({ x: xPos, z: zPos, angle: angle });
      gsap.to(item, { duration: 1, x: xPos, z: zPos, ease: Expo.easeOut, autoAlpha: 0 });
    });

    let curImgViewIndex = 0;
    let targetImgViewIndex = 0;
    let curIntervalId = null;
    let scrollbarDragging = false;

    const rotate = () => {
      const minusVal = targetImgViewIndex - curImgViewIndex > 0 ? -0.6301 : 0.6301;
      let easeObj;
      let tweenTime;

      if (Math.abs(targetImgViewIndex - curImgViewIndex) === 1) {
        easeObj = Quint.easeOut;
        tweenTime = 1;
      } else {
        easeObj = Linear.easeNone;
        tweenTime = 0.15;
      }

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
        const zIndex = i === targetImgViewIndex ? l + 1 : l - Math.abs(i - targetImgViewIndex);

        // Set z-index immediately to avoid snapping effect
        gsap.set(item, { zIndex: zIndex });

        gsap.to(item, {
          duration: tweenTime,
          x: xPos,
          z: zPos,
          ease: easeObj,
          autoAlpha: imgAlpha,
          rotationY: rotDeg,
        });
      });

      curImgViewIndex += minusVal > 0 ? -1 : 1;

      if (curImgViewIndex === targetImgViewIndex) {
        clearInterval(curIntervalId);
      }
    };

    const showImgAt = (index) => {
      targetImgViewIndex = Math.min(Math.max(index, 0), youtubeVideos.length - 1);
      setCurrentSemester(youtubeVideos[targetImgViewIndex].semester);
      setCurrentYear(youtubeVideos[targetImgViewIndex].year);

      clearInterval(curIntervalId);
      curIntervalId = setInterval(() => {
        rotate();
      }, 150);
    };

    const scrollerContainerWidth = 800; // Replace with actual container width if different
    const imageWidth = 100; // Replace with actual image width
    const totalImages = youtubeVideos.length;
    const scrollerWidth = 100; // Width of the scroller
    const maxScrollX = scrollerContainerWidth - scrollerWidth; // 800 - 100 = 700

    Draggable.create(scrollerRef.current, {
      type: 'x',
      bounds: { minX: 0, maxX: maxScrollX }, // Now set to 700
      onDrag: function () {
        // Adjust the calculation based on the new maxScrollX
        const curImgIndex = Math.round(this.x / (maxScrollX / (totalImages - 1)));
        targetImgViewIndex = Math.min(Math.max(curImgIndex, 0), totalImages - 1);
        if (targetImgViewIndex !== curImgViewIndex) {
          rotate();
        }
      },
      onDragStart: function () {
        scrollbarDragging = true;
      },
      onDragEnd: function () {
        scrollbarDragging = false;
      },
    });
    

    // Click on scrollbar container
    const scrollContainer = containerRef.current.parentNode.querySelector('.scrolller-container');
    scrollContainer.addEventListener('click', (e) => {
      const rect = scrollContainer.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      let curImgIndex = Math.abs(Math.round(offsetX / (scrollerContainerWidth / l)));
      curImgIndex = Math.min(Math.max(curImgIndex, 0), l - 1); // Constrain index within bounds
      showImgAt(curImgIndex);
    });

    // Click on scroller should not propagate
    scrollerRef.current.addEventListener('click', (e) => {
      e.stopPropagation();
    });

    // Click on images
    $imgs.forEach((img, index) => {
      img.addEventListener('click', () => {
        showImgAt(index);
      });
    });

    // Controller input
    const input = inputRef.current;
    const handleKeyUp = (e) => {
      if (e.keyCode === 13) { // Enter key
        const val = parseInt(e.target.value, 10);
        if (!isNaN(val) && val >= 0 && val < l) {
          showImgAt(val);
        }
      }
    };
    input.addEventListener('keyup', handleKeyUp);

    // Start up animation
    showImgAt(5);

    // Cleanup on unmount
    return () => {
      clearInterval(curIntervalId);
      scrollContainer.removeEventListener('click', () => {});
      scrollerRef.current.removeEventListener('click', () => {});
      $imgs.forEach((img) => img.removeEventListener('click', () => {}));
      input.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const [currentSemester, setCurrentSemester] = useState('');
const [currentYear, setCurrentYear] = useState('');


  return (
    <div className='media-page'>
      <div className="container" ref={containerRef}>
        {youtubeVideos.map((video, index) => (
          <div
            className="img-holder"
            key={index}
            ref={(el) => (imgRefs.current[index] = el)}
          >
            <img src={video.thumbnail} alt={video.title} />
            <div className="img-ref">
              <img src={video.thumbnail} alt={`${video.title} reflection`} />
            </div>
          </div>
        ))}
      </div>

      <div className="controller">
        Go to: <input type="text" ref={inputRef} />
      </div>

      <div className="scrolller-container">
        <div className="scroller" ref={scrollerRef}></div>
        <div className="semester-year-display">
        {currentSemester} {currentYear}
      </div>
      </div>
    </div>
  );
};

export default Media;
