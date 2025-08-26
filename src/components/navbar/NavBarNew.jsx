import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import './NavBarNew.scss';

import logo from '../../assets/images/Kanji.png';
import ncsu_logo from '../../assets/images/ncsu_logo copy.png';
import ig from '../../assets/images/ig.png';
import fb from '../../assets/images/fb.svg';
import lt from '../../assets/images/lt.png';
import yt from '../../assets/images/yt.png';
import SideBar from '../sidebar/SideBar';

function NavBarNew() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);
  const btnRef = useRef(null);
  const tlRef = useRef(null);
  const shieldRef = useRef(null);

  // Close on outside click / Esc
  useEffect(() => {
    function onDocClick(e) {
      if (!open) return;
      if (
        panelRef.current &&
        !panelRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) setOpen(false);
    }
    function onKey(e) { if (e.key === 'Escape') setOpen(false); }
    document.addEventListener('click', onDocClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('click', onDocClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  // GSAPS: open/close
  useLayoutEffect(() => {
    if (!panelRef.current) return;

    const reduceMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.navbar__social-item');
      const icons = gsap.utils.toArray('.navbar__social-item-icon');
      const labels = gsap.utils.toArray('.navbar__social-item-label');

      tlRef.current = gsap.timeline({ paused: true, defaults: { ease: 'power3.out' } });

      if (!reduceMotion) {
        tlRef.current
          // panel pops from the trigger area (overlaps it)
          .fromTo(panelRef.current,
            { autoAlpha: 0, y: -6, scale: 0.96, filter: 'blur(2px)' },
            { autoAlpha: 1, y: 0, scale: 1, filter: 'blur(0px)', duration: 0.18 }
          )
          // icons “pop out” first
          .fromTo(icons,
            { y: -6, opacity: 0, scale: 0.85, rotate: -2 },
            { y: 0, opacity: 1, scale: 1, rotate: 0, duration: 0.25, stagger: 0.04 },
            '-=0.02'
          )
          // then labels slide in
          .fromTo(labels,
            { x: -6, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.18, stagger: 0.03 },
            '-=0.15'
          );
      } else {
        // accessibility: no animation
        tlRef.current.set(panelRef.current, { autoAlpha: 1 })
          .set(items, { opacity: 1, clearProps: 'all' });
      }
    }, panelRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const tl = tlRef.current;
    if (!tl) return;
    if (open) tl.play();
    else tl.reverse();
  }, [open]);

  useEffect(() => {
    const el = panelRef.current;
    if (!el) return;

    if (open) {
      el.classList.add("is-interactive");
      // optional: prevent the trigger itself from stealing clicks
      btnRef.current?.classList.add("disable-pointer");
    } else {
      el.classList.remove("is-interactive");
      btnRef.current?.classList.remove("disable-pointer");
    }
  }, [open]);

  useEffect(() => {
    const panel = panelRef.current;
    const shield = shieldRef.current;
    if (!panel || !shield) return;

    if (open) {
      panel.classList.add('is-interactive');
      shield.classList.add('is-active');
      btnRef.current?.classList.add('disable-pointer');
    } else {
      panel.classList.remove('is-interactive');
      shield.classList.remove('is-active');
      btnRef.current?.classList.remove('disable-pointer');
    }
  }, [open]);


  return (
    <div className="navbar">
      <SideBar />
      <div className="navbar__wrapper">
        <span className="navbar__logo-group">
          <a href="/" className="navbar__logo-link">
            <img src={logo} alt="Logo" className="navbar__logo-image" />
          </a>
          <a
            href="https://getinvolved.ncsu.edu/organization/ncsulphie"
            target="_blank"
            rel="noopener noreferrer"
            className="navbar__logo-link"
          >
            <img
              src={ncsu_logo}
              alt="NCSU Get Involved"
              className="navbar__logo-image navbar__logo-image--alt"
            />
          </a>
        </span>

        {/* Desktop socials (unchanged) */}
        <div className="navbar__social" aria-label="Social links">
          <a href="https://www.instagram.com/ncsulphie/?hl=en" className="navbar__social-link">
            <img src={ig} alt="Instagram" className="navbar__social-icon" />
          </a>
          <a href="https://www.facebook.com/ncsulphie/" className="navbar__social-link">
            <img src={fb} alt="Facebook" className="navbar__social-icon" />
          </a>
          <a href="https://linktr.ee/ncsulphie" className="navbar__social-link">
            <img src={lt} alt="Linktree" className="navbar__social-icon" />
          </a>
          <a href="https://www.youtube.com/channel/UCdN-u9m3GSl0mMDvc24aGkg" className="navbar__social-link">
            <img src={yt} alt="YouTube" className="navbar__social-icon" />
          </a>
        </div>

        {/* Mobile: 2×2 logo trigger into “pop-out” list */}
        <div className="navbar__social-mobile">
          <button
            ref={btnRef}
            className={`navbar__social-trigger ${open ? 'is-open' : ''}`}
            aria-haspopup="true"
            aria-expanded={open}
            aria-controls="navbar-social-panel"
            onClick={() => setOpen(s => !s)}
          >
            <img src={ig} alt="" className="navbar__social-trigger-icon" />
            <img src={fb} alt="" className="navbar__social-trigger-icon" />
            <img src={lt} alt="" className="navbar__social-trigger-icon" />
            <img src={yt} alt="" className="navbar__social-trigger-icon" />
            <span className="navbar__sr-only">{open ? 'Close social menu' : 'Open social menu'}</span>
          </button>

          <div
            ref={shieldRef}
            className="navbar__shield"
            role="presentation"
            aria-hidden="true"
            onClick={() => setOpen(false)}
          />
          
          <div
            ref={panelRef}
            id="navbar-social-panel"
            className="navbar__social-panel"
            role="menu"
          >
            <a href="https://www.instagram.com/ncsulphie/?hl=en" className="navbar__social-item" role="menuitem">
              <img src={ig} alt="" className="navbar__social-item-icon" />
              <span className="navbar__social-item-label">Instagram</span>
            </a>
            <a href="https://www.facebook.com/ncsulphie/" className="navbar__social-item" role="menuitem">
              <img src={fb} alt="" className="navbar__social-item-icon" />
              <span className="navbar__social-item-label">Facebook</span>
            </a>
            <a href="https://linktr.ee/ncsulphie" className="navbar__social-item" role="menuitem">
              <img src={lt} alt="" className="navbar__social-item-icon" />
              <span className="navbar__social-item-label">Linktree</span>
            </a>
            <a
              href="https://www.youtube.com/channel/UCdN-u9m3GSl0mMDvc24aGkg"
              className="navbar__social-item"
              role="menuitem"
            >
              <img src={yt} alt="" className="navbar__social-item-icon" />
              <span className="navbar__social-item-label">YouTube</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavBarNew;
