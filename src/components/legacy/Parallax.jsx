import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Parallax.scss';

function Parallax({ type }) {
  const parallaxRef = useRef();
  const skyRef = useRef();
  const cityRef = useRef();
  const lightRef = useRef();
  const textRef = useRef();

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Main timeline for light and text
      const mainTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top center',
          end: 'bottom center',
          scrub: 1, // Adding a slight delay
          // markers: true,
        },
      });

      mainTimeline
        .fromTo(
          lightRef.current,
          { xPercent: -10, opacity: 0 },
          { xPercent: 10, opacity: .8, ease: 'none', force3D: true }
        )
        .fromTo(
          textRef.current,
          { yPercent: -100, color: "#ffffff" },
          { yPercent: 30, ease: 'none', force3D: true, color: "#949494" },
          0
        );

      // Sky animation only on exit
      gsap.fromTo(
        skyRef.current,
        { yPercent: 0 },
        {
          yPercent: -15,
          ease: 'none',
          force3D: true,
          scrollTrigger: {
            trigger: parallaxRef.current,
            start: 'center center',
            end: 'bottom center',
            scrub: 1, // Adding a slight delay
            // markers: true,
          },
        }
      );
    }, parallaxRef);

    // Cleanup
    return () => ctx.revert();
  }, []);

  return (
    <div className="parallax" ref={parallaxRef}>
      <h1 ref={textRef}>
        {type === 'services' ? 'Be the Match' : 'Our Values'}
      </h1>
      <div className="city" ref={cityRef}></div>
      <div className="sky" ref={skyRef}></div>
      <div className="light" ref={lightRef}></div>
    </div>
  );
}

export default Parallax;
