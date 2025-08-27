import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { YEAR_GRID_DATA } from '../constants/yearGridData';

const YearCard = ({ entry, onClick, style }) => (
    <div className="carousel-card" style={style} onClick={onClick}>
        <div className="card-content">
            <div className="image-container">
                {/* Optional background image from the most recent class (falls back to gradient only) */}
                {entry.bg && <div className="card-bg" style={{ backgroundImage: `url(${entry.bg})` }} aria-hidden="true" />}
                <div className="year-container">
                    <h1>{entry.year.split(/0(.*)/s)[1] || entry.year}</h1>
                </div>
                <div className="class-count-container">
                    <p>
                        {entry.classes?.length || 0} Class
                        {entry.classes?.length !== 1 && 'es'}
                    </p>
                </div>
            </div>
        </div>
    </div>
);

const Yearbook3DCarousel = () => {
    // Build data straight from YEAR_GRID_DATA, newest first; keep shape year/classes/bg
    const yearData = useMemo(() => {
        const norm = (YEAR_GRID_DATA || []).map((y) => {
            const lastClass = (y.classes && y.classes[y.classes.length - 1]) || null;
            return { year: String(y.year), classes: y.classes || [], bg: lastClass?.image || null };
        });
        // Sort desc by year so newest is front/center initially
        return norm.sort((a, b) => Number(b.year) - Number(a.year));
    }, []);

    const totalCards = yearData.length;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [selectedYear, setSelectedYear] = useState(null);

    // Live pixel measurements for CSS vars
    const [radiusPx, setRadiusPx] = useState(260);
    const [cardWPx, setCardWPx] = useState(200);

    const probeRadiusRef = useRef(null);
    const probeCardWRef = useRef(null);

    const goToNext = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((p) => (p + 1) % totalCards);
        setTimeout(() => setIsAnimating(false), 200);
    };

    const goToPrev = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((p) => (p - 1 + totalCards) % totalCards);
        setTimeout(() => setIsAnimating(false), 200);
    };

    const goToCard = (index) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 200);
    };

    const handleCardClick = (entry, index) => {
        if (index === currentIndex) setSelectedYear(entry);
        else goToCard(index);
    };

    // Keep measurements in sync with clamp(...) changes (resize, iOS UI hide/show, etc.)
    useLayoutEffect(() => {
        const read = () => {
            const r = probeRadiusRef.current?.offsetWidth || 260;
            const cw = probeCardWRef.current?.offsetWidth || 200;
            setRadiusPx((prev) => (Math.abs(prev - r) > 0.5 ? r : prev));
            setCardWPx((prev) => (Math.abs(prev - cw) > 0.5 ? cw : prev));
        };

        read();

        let roR = null, roC = null;
        if (typeof ResizeObserver !== 'undefined') {
            if (probeRadiusRef.current) {
                roR = new ResizeObserver(read);
                roR.observe(probeRadiusRef.current);
            }
            if (probeCardWRef.current) {
                roC = new ResizeObserver(read);
                roC.observe(probeCardWRef.current);
            }
        }

        const vv = window.visualViewport;
        const onVV = () => read();
        const onWin = () => read();
        vv?.addEventListener('resize', onVV);
        vv?.addEventListener('scroll', onVV);
        window.addEventListener('resize', onWin);
        window.addEventListener('orientationchange', onWin);

        const pollId = setInterval(read, 100); // stubborn mobile UIs

        return () => {
            roR?.disconnect();
            roC?.disconnect();
            vv?.removeEventListener('resize', onVV);
            vv?.removeEventListener('scroll', onVV);
            window.removeEventListener('resize', onWin);
            window.removeEventListener('orientationchange', onWin);
            clearInterval(pollId);
        };
    }, []);

    const getCardStyle = (index) => {
        // Ensure enough radius to avoid overlap when there are many years
        // Required arc per card ≈ card width * 1.08 (spacing factor)
        const spacing = 0.9; // was 1.08
        const visible = Math.min(totalCards, 10); // cap how many we “space out”
        const minRadiusForNoOverlap = (cardWPx * spacing * visible) / (3 * Math.PI);
        const radius = Math.max(radiusPx, minRadiusForNoOverlap);

        const angle = ((index - currentIndex) * 360) / totalCards;
        const rad = (angle * Math.PI) / 180;

        const x = Math.sin(rad) * radius;
        const z = Math.cos(rad) * radius;
        const y = -z * 0.18; // lift the back

        // depth 0..1 back->front with easing to shrink non-center cards more
        const depth = (z + radius) / (2 * radius);
        const eased = Math.pow(Math.max(0, Math.min(1, depth)), 0.8);

        const SCALE_MIN = 0.2;
        const SCALE_MAX = 0.7;
        const scale = SCALE_MIN + (SCALE_MAX - SCALE_MIN) * eased;

        const opacity = 0.35 + 0.65 * eased;

        return {
            transform: `translate3d(${x}px, ${y}px, ${z}px) rotateY(${-angle}deg) scale(${scale})`,
            opacity,
            zIndex: Math.round(z + radius),
            pointerEvents: Math.abs(angle) > 95 ? 'none' : 'auto',
        };
    };

    return (
        <div className="yearbook-carousel-container">
            <div className="carousel-wrapper">
                <div className="carousel-scene">
                    <div className="carousel-stage">
                        {yearData.map((entry, index) => (
                            <YearCard
                                key={entry.year}                // stable key per year
                                entry={entry}
                                onClick={() => handleCardClick(entry, index)}
                                style={getCardStyle(index)}
                            />
                        ))}
                    </div>

                    {/* Probes: turn CSS vars into pixel numbers */}
                    <div ref={probeRadiusRef} className="var-probe radius" aria-hidden="true" />
                    <div ref={probeCardWRef} className="var-probe cardw" aria-hidden="true" />
                </div>

                <div className="carousel-controls">
                    <button className="carousel-btn prev" onClick={goToPrev} disabled={isAnimating} aria-label="Previous">
                        <ChevronLeft size={20} />
                    </button>
                    <button className="carousel-btn next" onClick={goToNext} disabled={isAnimating} aria-label="Next">
                        <ChevronRight size={20} />
                    </button>
                </div>

                <div className="carousel-indicators" role="tablist" aria-label="Year carousel dots">
                    {yearData.map((_, index) => (
                        <button
                            key={index}
                            className={`indicator ${index === currentIndex ? 'active' : ''}`}
                            onClick={() => goToCard(index)}
                            disabled={isAnimating}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </div>

            {selectedYear && (
                <div className="year-modal-overlay" onClick={() => setSelectedYear(null)}>
                    <div className="year-modal" onClick={(e) => e.stopPropagation()}>
                        <button className="close-modal" onClick={() => setSelectedYear(null)} aria-label="Close">×</button>
                        <div className="modal-content">
                            <h2>Year {selectedYear.year}</h2>
                            <div className="year-display">
                                <div className="big-year">{selectedYear.year.split(/0(.*)/s)[1] || selectedYear.year}</div>
                            </div>
                            <p><strong>Classes:</strong> {selectedYear.classes?.length || 0}</p>
                            {selectedYear.classes && (
                                <div className="class-list">
                                    {selectedYear.classes.map((c, idx) => (
                                        <span key={idx} className="class-tag">{c.className}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
            /* Tunables */
            .yearbook-carousel-container {
                --card-w: clamp(120px, 20vw, 200px);
                --card-h: clamp(160px, 26vw, 260px);
                --radius: clamp(calc(var(--card-w) * 0.85), 17vmin, 240px);
                --btn-size: clamp(36px, 7vw, 48px);

                /* spacing vars */
                --dots-bottom: 16px;   /* distance from container bottom to dot row */
                --stage-shift: 0px;    /* vertical shift for the whole ring */

                  --year-fs: clamp(36px, calc(var(--card-w) * 0.46), min(96px, calc(var(--card-h) * 0.72)));
  --year-ls: clamp(-2px, calc(var(--card-w) * -0.01), -1px);

  --count-fs: clamp(11px, calc(var(--card-w) * 0.095), 16px);
  --count-ls: clamp(1px, calc(var(--card-w) * 0.02), 4px);
                width: 100%;
                height: clamp(220px, 36vh, 520px);
                position: relative;
                overflow: hidden;
                margin-block-end: 60px;
            }
                

            /* stable viewport units when available */
            @supports (height: 1svh) {
                .yearbook-carousel-container { height: clamp(220px, 36svh, 520px); }
            }
            @supports (height: 1dvh) {
                .yearbook-carousel-container { height: clamp(220px, 36dvh, 520px); }
            }

            /* extra skinny on small phones */
            @media (max-width: 620px) {
                .yearbook-carousel-container { height: clamp(200px, 32svh, 420px); }
            }

            /* large screens: a tad taller + more gap from cards to dots */
            @media (min-width: 1200px) {
                .yearbook-carousel-container {
                height: clamp(220px, 42vh, 600px);
                --stage-shift: -12px;               /* lift cards slightly */
                --dots-bottom: clamp(6px, 1.2vh, 14px); /* push dots lower (more space) */
                }
                @supports (height: 1svh) {
                .yearbook-carousel-container { height: clamp(220px, 42svh, 600px); }
                }
                @supports (height: 1dvh) {
                .yearbook-carousel-container { height: clamp(220px, 42dvh, 600px); }
                }
            }

            .carousel-wrapper { width: 100%; height: 100%; position: relative; isolation: isolate; }

            .carousel-scene { width: 100%; height: 100%; perspective: 900px; perspective-origin: 50% 42%; }

            .carousel-stage {
                width: 100%; height: 100%; position: relative;
                transform-style: preserve-3d;
                display: flex; align-items: center; justify-content: center;
                transform: translateY(var(--stage-shift)) rotateX(-8deg);
            }

            .carousel-card {
                position: absolute;
                width: var(--card-w);
                height: var(--card-h);
                cursor: pointer;
                transition: transform .4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.25s ease;
                transform-origin: center center;
                backface-visibility: hidden;
            }

            .card-content {
                width: 100%; height: 100%;
                border-radius: 12px; overflow: hidden;
                box-shadow: 0 10px 30px rgba(0,0,0,0.3);
                transition: box-shadow 0.3s ease, transform 0.3s ease; will-change: transform;
            }
            .carousel-card:hover .card-content { box-shadow: 0 15px 40px rgba(0,0,0,0.4); transform: translateY(-4px); }

            .image-container {
                width: 100%; height: 100%; position: relative;
                display: flex; flex-direction: column; align-items: center; justify-content: center; color: white;
                background: linear-gradient(135deg, #305096, #4a6bb8);
            }

            .card-bg {
                position: absolute; inset: 0;
                background-position: center; background-size: cover; background-repeat: no-repeat;
                opacity: 0.28; filter: saturate(0.9) contrast(1.05);
            }

            .year-container { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -60%); }
            .year-container h1 {
  font-size: var(--year-fs);
                font-weight: 800; color: #92aed8; margin: 0;
                text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
                letter-spacing: -0.2rem;
            }

            .class-count-container { position: absolute; bottom: 22px; left: 50%; transform: translateX(-50%); }
            .class-count-container p {
  font-size: var(--count-fs);
                font-style: italic; font-weight: 700; letter-spacing: 4px; margin: 0;
                color: rgba(255,255,255,0.9);
                text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
                  text-wrap: nowrap;

            }

            .carousel-controls {
                position: absolute; inset: 0;
                display: flex; align-items: center; justify-content: space-between;
                padding: 0 clamp(6px, 2vw, 20px);
                pointer-events: none;
            }
            .carousel-btn {
                background: rgba(32,60,121,0.9); border: none; border-radius: 50%;
                inline-size: var(--btn-size); block-size: var(--btn-size);
                color: white; cursor: pointer; display: grid; place-items: center;
                transition: transform .2s ease, box-shadow .2s ease, background .2s ease;
                pointer-events: auto; box-shadow: 0 4px 15px rgba(0,0,0,0.2);
            }
            .carousel-btn:hover:not(:disabled) { background: rgba(32,60,121,1); transform: scale(1.06); box-shadow: 0 6px 20px rgba(0,0,0,0.3); }
            .carousel-btn:disabled { opacity: .5; cursor: not-allowed; }

            /* dot row container uses the var */
            .carousel-indicators {
                position: absolute;
                left: 0; right: 0;
                bottom: var(--dots-bottom, 16px);
                display: flex; justify-content: center; gap: 10px;
                pointer-events: auto;
                z-index: 3;
            }
            .indicator {
                inline-size: 12px; block-size: 12px; aspect-ratio: 1 / 1; border-radius: 50%;
                border: 2px solid rgba(32,60,121,0.5); background: transparent;
                padding: 0; line-height: 0; appearance: none; -webkit-appearance: none;
                cursor: pointer; transition: transform .15s ease, border-color .15s ease, background .15s ease;
            }
            .indicator.active { background: #203c79; border-color: #203c79; transform: scale(1.2); }
            .indicator:hover:not(:disabled) { border-color: #203c79; transform: scale(1.1); }
            .indicator:disabled { opacity: .5; cursor: not-allowed; }

            .year-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); display: grid; place-items: center; z-index: 1000; animation: fadeIn .3s ease both; }
            .year-modal { background: white; border-radius: 15px; max-width: 500px; width: 90%; max-height: 80vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0,0,0,0.3); animation: slideUp .3s ease both; }
            .close-modal { position: absolute; top: 15px; right: 20px; background: none; border: none; font-size: 30px; color: #666; cursor: pointer; z-index: 1001; transition: color .2s ease; inline-size: 40px; block-size: 40px; display: grid; place-items: center; border-radius: 50%; }
            .close-modal:hover { color: #333; background: rgba(0,0,0,0.06); }

            .modal-content { padding: 40px 30px 30px; text-align: center; }
            .modal-content h2 { margin: 0 0 20px 0; color: #203c79; font-size: 28px; font-weight: bold; }
            .year-display { margin: 20px 0; padding: 20px; background: linear-gradient(135deg, #305096, #4a6bb8); border-radius: 12px; color: white; }
            .big-year { font-size: clamp(44px, 14vw, 80px); font-weight: 800; color: #92aed8; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); letter-spacing: -0.1rem; }
            .modal-content p { margin: 15px 0; font-size: 16px; color: #333; }
            .class-list { display: flex; flex-wrap: wrap; gap: 8px; justify-content: center; margin-top: 15px; }
            .class-tag { background: #e8f0fe; color: #203c79; padding: 6px 12px; border-radius: 20px; font-size: 14px; font-weight: 500; }

            /* hidden probes to read CSS vars as px */
            .var-probe { position: absolute; visibility: hidden; pointer-events: none; height: 0; }
            .var-probe.radius { width: var(--radius); }
            .var-probe.cardw  { width: var(--card-w); }

            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes slideUp { from { transform: translateY(30px); opacity: 0 } to { transform: translateY(0); opacity: 1 } }
            `}</style>

        </div>
    );
};

export default Yearbook3DCarousel;
