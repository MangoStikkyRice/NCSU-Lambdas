// Philanthropy.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Philanthropy.scss';

// Sample images
import EVANCHEN from '../../assets/images/EVANCHEN.png';
import GRACEYANG from '../../assets/images/GRACEYANG.png';
import BTM from '../../assets/images/BTM.png';
import logo from '../../assets/images/lo.png';

const items = [
  {
    id: 1,
    title: "Honoring Evan Chen",
    img: EVANCHEN,
    desc: "In 1995, Evan Chen...",
    buttonText: "Explore",
    buttonLink: "https://www.nmdp.org/",
    buttonLogo: logo
  },
  {
    id: 2,
    title: "Be The Match",
    img: GRACEYANG,
    desc: "Lambda Phi Epsilon works...",
    buttonText: "The Donation Process",
    buttonLink: "https://www.mskcc.org/news/stem-cell-bone-marrow-donation-process"
  },
  {
    id: 3,
    title: "International Commitment",
    img: BTM,
    desc: "Every Lambda Phi Epsilon chapter...",
    buttonText: "Join the Registry!",
    buttonLink: "https://my.bethematch.org/s/join"
  },
];

const variants = {
  collapsed: { height: '4.4em', overflow: 'hidden' },
  expanded:  { height: 'auto' }
};

function Philanthropy() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <div className="philanthropy">
      <h1>National Philanthropy</h1>
      <div className="phil-wrapper">
        {items.map(item => {
          const shortText = item.desc.slice(0, 150);
          const isExpanded = expandedId === item.id;

          return (
            <div className="phil-card" key={item.id}>
              <div className="imageContainer">
                <img src={item.img} alt={item.title} />
              </div>
              <div className="textContainer">
                <h2>{item.title}</h2>
                <motion.div
                  animate={isExpanded ? "expanded" : "collapsed"}
                  variants={variants}
                  className="desc"
                >
                  <p>
                    {isExpanded ? item.desc : shortText + '...'}
                  </p>
                </motion.div>
                <div className="readMoreContainer">
                  <button onClick={() => toggleExpand(item.id)}>
                    {isExpanded ? 'Collapse' : 'Read More'}
                  </button>
                </div>
                <a 
                  href={item.buttonLink} 
                  className="cta-button"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {item.buttonText}
                  {item.buttonLogo && (
                    <img 
                      src={item.buttonLogo} 
                      alt="Button Logo" 
                      className="button-logo" 
                    />
                  )}
                </a>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Philanthropy;
