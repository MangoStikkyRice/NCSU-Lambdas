import React, { useState, useRef, useEffect } from 'react';
import './Recruitment.scss';
import { gsap } from 'gsap';
import { recruitmentFAQs } from './recruitmentFAQs';
import NavBarNew from '../../components/navbar/NavBarNew';
import Footer from '../../components/Footer';

import heroImage1 from '../../assets/images/rec.jpg';

/**
 * Definitions and setup for the Recruitment page.
 * 
 * Objectives:
 * - The recruitment page shall feature FAQs and a
 * contact statement.
 * - The recruitment page shall feature a Hero image
 * of brothers, preferably during reveal/installs.
 * 
 * @returns JSX Element
 * @author Jordan Miller
 */
function Recruitment() {

    /* -------------------------------------------------------------------------- */
    /*                               Refs and state                               */
    /* -------------------------------------------------------------------------- */

    // Scopes GSAP animations
    const containerRef = useRef(null);

    // Handles to DOM nodes so GSAP can animate them
    const faqRefs = useRef([]);

    // Tracks which questions are opened
    const [openIndices, setOpenIndices] = useState([]);

    /* -------------------------------------------------------------------------- */
    /*                                 Animations                                 */
    /* -------------------------------------------------------------------------- */

    // Page fade-in
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current.children, {
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    // FAQ dropdown
    useEffect(() => {
        faqRefs.current.forEach((ref, index) => {
            if (ref) {
                if (openIndices.includes(index)) {
                    gsap.to(ref, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
                } else {
                    gsap.to(ref, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.in' });
                }
            }
        });
    }, [openIndices]);

    /* -------------------------------------------------------------------------- */
    /*                                   Toggles                                  */
    /* -------------------------------------------------------------------------- */

    // FAQ dropdown
    const toggleFAQ = (index) => {
        setOpenIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    /* -------------------------------------------------------------------------- */
    /*                              JSX Element Setup                             */
    /* -------------------------------------------------------------------------- */

    return (
        <div ref={containerRef} className="recruitment">

            {/* Navigation bar */}
            <NavBarNew />

            {/* Hero section with single image */}
            <div className="recruitment__hero">
                <img
                    src={heroImage1}
                    alt="Recruitment Hero"
                    className="recruitment__hero-img"
                />
                <div className="recruitment__hero-text">
                    <h1>RUSH LPhiE</h1>
                    <p>Discover Brotherhood, Leadership, and Legacy</p>
                </div>
            </div>

            {/* FAQ section */}
            <div className="recruitment__faqs">
                <h2>Recruitment FAQs</h2>

                {recruitmentFAQs.map((faq, index) => (
                    <div key={index} className="recruitment__faq">
                        <h3
                            onClick={() => toggleFAQ(index)}
                            className={`recruitment__faq-question ${openIndices.includes(index) ? 'recruitment__faq-question--active' : ''}`}
                        >
                            {faq.question}
                            <span className="recruitment__faq-icon">
                                {openIndices.includes(index) ? '-' : '+'}
                            </span>
                        </h3>
                        <div
                            ref={el => faqRefs.current[index] = el}
                            className="recruitment__faq-answer"
                            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
                        >
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Contact statement */}
            <div className="recruitment__contact">
                <p>For any other further questions about recruitment, feel free to contact us on our Instagram!</p>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}

export default Recruitment;
