// Philanthropy.jsx
import { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philanthropy.scss';

// Images (use your correct import paths)
import EVANCHEN from "../../assets/images/EVANCHEN.png";
import GRACEYANG from "../../assets/images/GRACEYANG.png";
import BTM from "../../assets/images/BTM.png";
import logo from "../../assets/images/lo.png";
import ScrollDown from '../../assets/images/scrolldown.png';

// Framer Motion
import { motion } from 'framer-motion';

// -----------------------
// Example items array
// -----------------------
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
    buttonLink: "https://my.bethematch.org/s/join?language=en_US&joinCode=recruithome&_ga=2.51664814.649395165.1719235886-1741193351.1716920694"
  },
];

// -----------------------
// Animation Variants
// -----------------------
const variants = {
  collapsed: {
    height: '5.5em',
    transition: { duration: 0.5, ease: 'easeInOut', scrub: 1 }
  },
  expanded: {
    height: 'auto',
    transition: { duration: 0.5, ease: 'easeInOut', scrub: 1 }
  }
};

const textVariants = {
  initial: { x: -500, opacity: 0 },
  animate: {
    x: 0,
    opacity: 1,
    transition: { duration: 1, staggerChildren: 0.1 }
  },
  scrollButton: {
    opacity: 0,
    y: 10,
    transition: {
      duration: 1,
      repeat: Infinity,
      repeatType: "mirror"
    }
  }
};

// -----------------------
// Single component
// -----------------------
const Single = ({ item }) => {
  const ref = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReadMore = () => setIsExpanded(!isExpanded);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!ref.current) return;

    const element = ref.current;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: element,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Example tween, adjust if you have different animations:
    tl.fromTo(
      element.querySelector('.imageContainer'),
      { y: 0, ease: 'power1.inOut' },
      { y: 0, ease: 'power1.out' }
    );

    // Cleanup: only kill if it exists
    return () => {
      if (tl?.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  // Safely slice the desc in case item or item.desc is missing
  const shortText = item?.desc?.slice(0, 150) || "";

  return (
    <section ref={ref}>
      <div className="container">
        <div className="wrapper">
          <div className="imageContainer">
            <img src={item?.img} alt={item?.title || "Philanthropy"} />
          </div>
          <div className="textContainer">
            <h2>{item?.title}</h2>
            <div className="textAndReadMore">
              <motion.div
                className="read-more-content"
                animate={isExpanded ? "expanded" : "collapsed"}
                variants={variants}
                initial="collapsed"
                style={{ overflow: 'hidden' }}
              >
                <p>
                  {isExpanded ? item?.desc : `${shortText}...`}
                </p>
              </motion.div>
              <div className="readMoreContainer">
                <button onClick={toggleReadMore} className="read-more-btn">
                  {isExpanded ? 'Collapse' : 'Read More'}
                </button>
                <motion.img
                  variants={textVariants}
                  animate="scrollButton"
                  src={ScrollDown}
                  alt="Scroll Down Indicator"
                  className="scroll-indicator"
                />
              </div>
            </div>
            <a href={item?.buttonLink} className="button">
              {item?.buttonText}
              {item?.buttonLogo && (
                <img
                  src={item.buttonLogo}
                  alt={`${item.buttonText} Logo`}
                  className="button-logo"
                />
              )}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// -----------------------
// Philanthropy component
// -----------------------
function Philanthropy() {
  const philanthropyRef = useRef(null);
  const progressBarRef = useRef(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // For users with reduced motion preference:
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      if (progressBarRef.current) {
        gsap.set(progressBarRef.current, { scaleX: 1 });
      }
      return;
    }

    // Create a timeline or direct tween
    const tl = gsap.fromTo(
      progressBarRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        ease: 'none',
        transformOrigin: 'center center',
        scrollTrigger: {
          trigger: philanthropyRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 2,
        }
      }
    );

    // Cleanup: only kill if it exists
    return () => {
      if (tl && tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, []);

  return (
    <div className="philanthropy" ref={philanthropyRef}>
      <div className="progress">
        <h1>National Philanthropy</h1>
        <div ref={progressBarRef} className="progressBar"></div>
      </div>

      {/* Map over the items array */}
      {items.map((item) => (
        <Single item={item} key={item.id} />
      ))}
    </div>
  );
}

export default Philanthropy;
