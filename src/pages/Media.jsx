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

    const snapRef = useRef(0);
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

    useEffect(() => {
        const el = rowRef.current;
        if (!el) return;
        // measure one "card span" (width + gap) once content is in the DOM
        const card = el.querySelector('.media__card');
        if (!card) return;
        const cardRect = card.getBoundingClientRect();
        const styles = getComputedStyle(el);
        const gap = parseFloat(styles.getPropertyValue('--card-gap')) || 0;
        snapRef.current = cardRect.width + gap;
    }, [others.length]);

    const scrollBySnap = (dir) => {
        const el = rowRef.current;
        if (!el) return;
        const step = snapRef.current || 300;
        const max = el.scrollWidth - el.clientWidth;
        const target = Math.min(max, Math.max(0, el.scrollLeft + dir * step));
        el.scrollTo({ left: target, behavior: 'smooth' });
    };

    const handleLeft = () => scrollBySnap(-1);
    const handleRight = () => scrollBySnap(1);

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
                        <span>&#10094;</span>
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
                        <span>&#10095;</span>
                    </button>
                </div>
            </section>

            <Footer />
        </div>
    );
}
