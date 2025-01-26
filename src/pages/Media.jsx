// src/components/Media.jsx

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
  // REFS AND STATE HOOKS
  const containerRef = useRef(null);
  const imgRefs = useRef([]);
  const leftArrowRef = useRef(null);
  const rightArrowRef = useRef(null);

  // "Netflixy" references
  const heroRef = useRef(null);
  const scrollRowRef = useRef(null);

  // DRAGGABLE code references (commented out usage later)
  const videoGridRef = useRef(null);
  const videoItemRefs = useRef([]);

  // Treemap states from the old Windirstat approach (kept, but not used)
  const [expandedNode, setExpandedNode] = useState(null);
  const [treemapNodes, setTreemapNodes] = useState([]);

  /*
  // COMMENTING OUT: Old windirstat/treemap approach
  useEffect(() => {
    const width = 1000;
    const height = 600;
    const root = d3
      .hierarchy({ name: 'root', children: photoGalleryImages })
      .sum(d => d.value);
    d3.treemap().size([width, height]).padding(2)(root);
    setTreemapNodes(root.leaves());
  }, []);
  */

  // SET UP THE IMAGES
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
    value: Math.floor(Math.random() * 100) + 50,
  }));

  // A "long" horizontally scrollable gallery
  const repeatedImages = [...imageUrls, ...imageUrls, ...imageUrls];
  const [selectedImage, setSelectedImage] = useState(null);

  // Identify the "latest" reveal
  const latestVideo = youtubeVideos[youtubeVideos.length - 1];
  // The rest (everything except the last item)
  const otherVideos = youtubeVideos.slice(0, youtubeVideos.length - 1);

  return (
    <div className="media-page">
      <NavBarNew />

      {/* Netflix-style HERO for the latest reveal */}
      <div
        className="hero"
        ref={heroRef}
        style={{ backgroundImage: `url(${latestVideo.thumbnail})` }}
      >
        <div className="hero-content">
          <h1 className="hero-title">{latestVideo.title} Installs</h1>
          <button
            className="watch-now-button"
            onClick={() => window.open(latestVideo.url, '_blank')}
          >
            Watch Now
          </button>
        </div>
      </div>

      <div className="video-row-title">
        <h2>Watch Installs by Lambda Phi Epsilon</h2>
        {/* A single horizontal row with the "other" reveals, scrollable */}
        <div className="video-row" ref={scrollRowRef}>
          {otherVideos.map((video, index) => (
            <div className="video-card" key={index}>
              <img src={video.thumbnail} alt={video.title} />
              <div className="video-card-title">{video.title}</div>
            </div>
          ))}
        </div>
      </div>

      {/* The old windirstat gallery is commented out. */}
      <div className="gallery-wrapper">
        <h2>Browse the Photo Gallery</h2>

        {/* HORIZONTAL, SCROLLABLE GALLERY (200px tall, centered vertically) */}
        <div className="infinite-gallery">
          {repeatedImages.map((url, index) => (
            <div
              className="image-card-media"
              key={index}
              onClick={() => setSelectedImage(url)}
            >
              <img src={url} alt={`Gallery ${index}`} />
            </div>
          ))}
        </div>
      </div>

      {/* LIGHTBOX OVERLAY */}
      {selectedImage && (
        <div className="overlay" onClick={() => setSelectedImage(null)}>
          <div className="overlay-content" onClick={(e) => e.stopPropagation()}>
            <img src={selectedImage} alt="Enlarged" />
          </div>
        </div>
      )}

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
