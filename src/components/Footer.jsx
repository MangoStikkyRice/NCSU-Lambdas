import React from 'react';
import './Footer.scss';

export default function Footer({
  year = new Date().getFullYear(),
  org = 'Lambda Phi Epsilon',
  chapter = 'Beta Eta Chapter',
  designer = 'InterstellHer',
  email = 'dev.ncsulphie@gmail.com',
  align = 'start', // 'start' | 'center' | 'end'
  maxWidth = 1200, // px
}) {
  return (
    <footer className="footer" role="contentinfo">
      <div
        className="footer__content"
        style={{ maxWidth: `${maxWidth}px`, textAlign: align }}
      >
        <p className="footer__line">
          &copy; {year} {org}, {chapter}. All rights reserved.
        </p>
        <p className="footer__line">Designed by {designer}</p>
        <p className="footer__contact">
          Questions or feedback? Reach us at{' '}
          <a href={`mailto:${email}`} className="footer__link">
            {email}
          </a>.
        </p>
      </div>
    </footer>
  );
}
