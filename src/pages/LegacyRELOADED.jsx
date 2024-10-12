import React, { useEffect } from 'react';
import './LegacyRELOADED.scss'; // Import SCSS file
import Lenis from 'lenis';
import { gsap } from "gsap";
import { ScrollTrigger } from 'gsap';

const LegacyRELOADED = () => {
    const rawHtml = `
<section class="sticky-element half-height">
    <div class="track">
      <div class="track-flex">
        <div class="panel-wide" data-box="elem1">
          <img src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/galaxy_3-2.jpg" alt="">
          <video autoplay="" loop="" src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/Forest-Lullaby.mp4"></video>
          <img class="image" src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/9-slider.jpg" alt="" style="mix-blend-mode: screen;">
          <span>01</span>
        </div>
        <div class="panel-wide" data-box="elem2">
          <img src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/galaxy.jpg" alt="">
          <video autoplay="" loop="" src="https://preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/space.mp4"></video>
          <img class="image" src="https://preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/bw.jpg" alt="" style="mix-blend-mode: screen;">
          <span>02</span>
        </div>
        <div class="panel-wide" data-box="elem3">
          <img src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/mountain4.jpg" alt="">
          <video  autoplay="" loop="" src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/tp_vid_clouds.mp4"></video>
          <img class="image" src="//preview.treethemes.com/hazel/demo9/wp-content/uploads/sites/19/revslider/manbw.jpg" alt="" style="mix-blend-mode: screen;">
          <span>03</span>
        </div>
        <div class="panel-wide" data-box="elem4">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f620dbc7f7e7db222488_and-machines-YLplJ9m_RKE-unsplash.jpg" alt="">
          <span>04</span>
        </div>
        <div class="panel-wide" data-box="elem5">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f62054964a1416e0b3c8_and-machines-vqTWfa4DjEk-unsplash.jpg" alt="">
          <span>05</span>
        </div>
      </div>
    </div>
    <div class="elements">
      <div class="thumbs">
          <div class="visible"></div>
      </div>
      <div class="thumbs">
          <div class="visible"></div>
      </div>
      <div class="thumbs">
          <div class="visible"></div>
      </div>
      <div class="thumbs">
          <div class="visible"></div>
      </div>
      <div class="thumbs">
          <div class="visible"></div>
      </div>
    </div>
    <div class="progress--bar-wrapper">
      <div class="progress--bar">
        <div class="progress--bar-total"></div>
      </div>
    </div>
  </section>
  
  <header>
    scroll down
  </header>
  
  <section class="sticky-element">
    <div class="track">
      <div class="track-flex">
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f6201cd426577274fab1_and-machines-SZd_V4A8gYo-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f620fe7a4e4395360bc5_and-machines-mAiFQrt9xMc-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f62034d6a56dd03cced8_and-machines-odNU0f3jmUg-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f62054964a1416e0b3c8_and-machines-vqTWfa4DjEk-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f620dbc7f7e7db222488_and-machines-YLplJ9m_RKE-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f62034d6a56dd03cced8_and-machines-odNU0f3jmUg-unsplash.jpg" alt="">
        </div>
        <div class="panel-wide">
          <img class="image" src="https://assets.website-files.com/62f4dd003ef1495b1bb8f3a0/62f4f62054964a1416e0b3c8_and-machines-vqTWfa4DjEk-unsplash.jpg" alt="">
        </div>
      </div>
    </div>
    <div class="elements">
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
      <div class="thumbs">
        <div class="visible"></div>
      </div>
    </div>
    <div class="progress--bar-wrapper">
      <div class="progress--bar">
        <div class="progress--bar-total" value="0"></div>
      </div>
    </div>
  </section>
  
  <footer>
    scroll up
  </footer>
  `;

// lenis
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smooth: true
  });
  
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  
  requestAnimationFrame(raf);
  
  // horiontall scroll
  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  console.clear();
  
  select = (e) => document.querySelector(e);
  selectAll = (e) => document.querySelectorAll(e);
  
  const tracks = selectAll(".sticky-element");
  
  console.log(tracks);
  
  tracks.forEach((track, i) => {
    let trackWrapper = track.querySelectorAll(".track");
    let trackFlex = track.querySelectorAll(".track-flex");
    let allImgs = track.querySelectorAll(".image");
    let progress = track.querySelectorAll(".progress--bar-total");
  
    let sliders = gsap.utils.toArray(".panel-wide");
    let thumbs = gsap.utils.toArray(".thumbs");
    let visible = gsap.utils.toArray(".visible");
    
    let trackWrapperWidth = () => {
      let width = 0;
      trackWrapper.forEach((el) => (width += el.offsetWidth));
      return width;
    };
  
    let trackFlexWidth = () => {
      let width = 0;
      trackFlex.forEach((el) => (width += el.offsetWidth));
      return width;
    };
  
    ScrollTrigger.defaults({
  
    });
  
    gsap.defaults({
      ease: "none"
    });
  
    let scrollTween = gsap.to(trackWrapper, {
      x: () => -trackWrapperWidth(i) + window.innerWidth,
      scrollTrigger: {
        trigger: track,
        pin: true,
        anticipatePin: 1,
        //pinType: "transform",
        scrub: 1,
        start: "center center",
        end: () => "+=" + (track.scrollWidth - window.innerWidth),
        onRefresh: (self) => self.getTween().resetTo("totalProgress", 0),
        // fixes a very minor issue where the progress was starting at 0.001.
        invalidateOnRefresh: true
      }
    });
  
    allImgs.forEach((img, i) => {
      // the intended parallax animation
      gsap.fromTo(img, {
        x: "-20vw"
      }, {
        x: "20vw",
        scrollTrigger: {
          trigger: img.parentNode, //.panel-wide
          containerAnimation: scrollTween,
          start: "left right",
          end: "right left",
          scrub: true,
          invalidateOnRefresh: true,
          onRefresh: self => {
            if (self.start < 0) {
              self.animation.progress(gsap.utils.mapRange(self.start, self.end, 0, 1, 0));
            }
          }
        }
      });
    });
  
    let progressBar = gsap.timeline({
        scrollTrigger: {
          trigger: trackWrapper,
          containerAnimation: scrollTween,
          start: "left left",
          end: () => "+=" + (trackWrapperWidth() - window.innerWidth),
          scrub: true
        }
      }).to(progress, {
        width: "100%",
        ease: "none"
      });
  
    sliders.forEach((slider, i) => {
      let anim = gsap.timeline({
          scrollTrigger: {
            trigger: slider,
            containerAnimation: scrollTween,
            start: "left right",
            end: "right right",
            scrub: true,
            //onEnter: () => playLottie(i),
          }
        }).to(visible[i], {
          width: "100%",
          backgroundColor: "#1e90ff",
          ease: "none"
        });
    });
  
    sliders.forEach((slider, i) => {
      thumbs[i].onclick = () => {
        console.log(slider.getBoundingClientRect(i).left);
        gsap.to(window, {
          //scrollTo: "+=" + slider.getBoundingClientRect(i).left,
          scrollTo: {
            y: "+=" + slider.getBoundingClientRect(i).left,
          },
          duration: 0.5,
          overwrite: "auto"
        });
      };
    });
  
  });
}

export default LegacyRELOADED;
