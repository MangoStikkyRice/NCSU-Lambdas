import React from 'react';
import './Footer.scss';

const Footer = () => {
    return (
        <footer className="footer">
            <div className="footer-content">
                <p>&copy; 2025 Lambda Phi Epsilon, Beta Eta Chapter. All rights reserved.</p>
                <p>Designed by InterstellHer</p>
                <p className="footer-contact">
                    Questions or feedback? Reach us at{" "}
                    <a href="mailto:dev.ncsulphie@gmail.com" className="footer-link">
                        dev.ncsulphie@gmail.com
                    </a>.
                </p>

            </div>
        </footer>
    );
};

export default Footer; 