import React, { useEffect, useRef, useState } from 'react';
import './Media.scss';
import NavBarNew from '../components/navbar/NavBarNew';
import Footer from '../components/Footer';
import { youtubeVideos } from '../data/mediaCarouselData';

const throttle = (fn, limit) => {
  let inThrottle = false;
  return (...args) => {
    if (inThrottle) return;
    fn(...args);
    inThrottle = true;
    setTimeout(() => (inThrottle = false), limit);
  };
};

const getHighResThumbnail = (url) =>
  url?.includes('hqdefault') ? url.replace('hqdefault', 'maxresdefault') : url;

export default function Media() {
  const rowRef = useRef(null);
  const [animate, setAnimate] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // latest + others
  const latest = youtubeVideos[youtubeVideos.length - 1];
  const others = youtubeVideos.slice(0, -1);

  // fade-in after mount
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(id);
  }, []);

  // responsive flag
  useEffect(() => {
    const mql = window.matchMedia('(max-width: 768px)');
    const onChange = () => setIsMobile(mql.matches);
    onChange();
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  const SCROLL_STEP = 300;

  const handleLeft = () => {
    const el = rowRef.current;
    if (!el) return;
    el.scrollTo({ left: Math.max(0, el.scrollLeft - SCROLL_STEP), behavior: 'smooth' });
  };

  const handleRight = () => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: Math.min(max, el.scrollLeft + SCROLL_STEP), behavior: 'smooth' });
  };

  // wheel → horizontal scroll (only when horizontal intent is clear)
  const handleWheel = throttle((e) => {
    const el = rowRef.current;
    if (!el) return;
    const dx = Math.abs(e.deltaX);
    const dy = Math.abs(e.deltaY);
    if (dx > dy) {
      e.preventDefault();
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(max, Math.max(0, el.scrollLeft + (e.deltaX || e.deltaY)));
      el.scrollLeft = next;
    }
  }, 50);

  // touch drag
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;
    let startX = 0;
    let startLeft = 0;

    const onStart = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      startX = t.clientX;
      startLeft = el.scrollLeft;
    };
    const onMove = (e) => {
      const t = e.touches?.[0];
      if (!t) return;
      const dx = t.clientX - startX;
      const max = el.scrollWidth - el.clientWidth;
      const next = Math.min(max, Math.max(0, startLeft - dx));
      if (Math.abs(dx) > 4) e.preventDefault();
      el.scrollLeft = next;
    };

    el.addEventListener('touchstart', onStart, { passive: true });
    el.addEventListener('touchmove', onMove, { passive: false });
    return () => {
      el.removeEventListener('touchstart', onStart);
      el.removeEventListener('touchmove', onMove);
    };
  }, []);

  // hero CSS vars (no font styles here)
  const heroStyle = {
    '--hero-img': `url(${getHighResThumbnail(latest.thumbnail)})`,
    '--mask-stop': isMobile ? '70%' : '80%',
    '--fade-stop': isMobile ? '80%' : '70%',
    '--hero-pos': isMobile ? 'center' : 'top',
  };

  return (
    <div className="media">
      <NavBarNew />

      {/* Hero with latest video */}
      <section className={`media__hero ${animate ? 'is-animate' : ''}`} style={heroStyle}>
        <div className="media__hero-bg" aria-hidden="true" />
        <div className="media__hero-content">
          <div className="media__hero-text">
            <h1 className="media__hero-title">{latest.title} Reveal</h1>
            <p className="media__hero-desc">
              Centennial Campus sets the stage. The wait is over. Months of work, loyalty, and
              brotherhood come down to this. No frills, no filters. Just the reveal.
            </p>
          </div>
          <button
            className="media__btn"
            onClick={() => window.open(latest.url, '_blank')}
            aria-label={`Watch ${latest.title} on YouTube`}
          >
            Watch Now
          </button>
        </div>
      </section>

      {/* Previous videos carousel */}
      <section className="media__section">
        <div className="media__section-head">
          <h2 className="media__section-title">Previous Reveal Videos</h2>
        </div>

        <div className="media__carousel">
          <button
            type="button"
            className="media__arrow media__arrow--left"
            onClick={handleLeft}
            aria-label="Scroll videos left"
          >
            &#10094;
          </button>

          <div
            className="media__row"
            ref={rowRef}
            onWheel={handleWheel}
            role="list"
            aria-label="Reveal videos"
          >
            {others.map((v, i) => (
              <div
                key={i}
                className={`media__card ${animate ? 'is-animate' : ''}`}
                onClick={() => window.open(v.url, '_blank')}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    window.open(v.url, '_blank');
                  }
                }}
                aria-label={`Open ${v.title} on YouTube`}
              >
                <img className="media__card-img" src={v.thumbnail} alt={v.title} />
                <div className="media__card-title">{v.title}</div>
              </div>
            ))}
          </div>

          <button
            type="button"
            className="media__arrow media__arrow--right"
            onClick={handleRight}
            aria-label="Scroll videos right"
          >
            &#10095;
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
