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
    desc: "In 1995, Evan Chen, a member of Theta Chapter at Stanford University, was diagnosed with leukemia. Their chapter, along with Evan’s friends, organized a joint effort to find a bone marrow donor. What resulted was the largest bone marrow typing drive in the history of the NMDP and Asian American Donor Program (AADP). In a matter of days, over two thousand people were typed. A match was eventually found for Evan, but unfortunately by that time the disease had taken its toll on him and he passed away in 1996. In Evan’s memory, the national philanthropy for Lambda Phi Epsilon was established and the fraternity has been working with the organization from that point forward.",
    buttonText: "Explore",
    buttonLink: "https://www.nmdp.org/",
    buttonLogo: logo
  },
  {
    id: 2,
    title: "Be The Match",
    img: GRACEYANG,
    desc: "Lambda Phi Epsilon works with the National Marrow Donor Program to save the lives of patients requiring bone marrow transplants. Additionally, the fraternity promotes awareness for leukemia and other blood disorders. Individuals who suffer from these types of illnesses depend on donors with similar ethnic backgrounds to find compatible bone marrow matches. Thus, the fraternity aims to register as many committed donors to the cause through local #NMDP campaigns to increase the chances for patients to find a life-saving donor.",
    buttonText: "The Donation Process",
    buttonLink: "https://www.mskcc.org/news/stem-cell-bone-marrow-donation-process"
  },
  {
    id: 3,
    title: "International Commitment",
    img: BTM,
    desc: "Every Lambda Phi Epsilon chapter works with the AADP, Asians for Miracle Marrow Matches, and the Cammy Lee Leukemia Foundation to hold bone marrow typing drives on their campuses to encourage Asians and other minorities to register as committed bone marrow/stem cell donors. Since the fraternity's inception, Lambda Phi Epsilon has educated thousands of donors to commit to saving the life of a patient in need.",
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
