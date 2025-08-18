import React, { useState, useRef, useEffect } from 'react';
import './Recruitment.scss';
import heroImage1 from '../../assets/images/rec.jpg';
import NavBarNew from '../../components/navbar/NavBarNew';
import Footer from '../../components/Footer';
import { gsap } from 'gsap';
import { recruitmentFAQs } from './recruitmentFAQs';

function Recruitment() {
    // Refs and state
    const containerRef = useRef(null);
    const faqRefs = useRef([]);
    const [openIndices, setOpenIndices] = useState([]);

    // Initial page fade-in animation
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

    // FAQ toggle functionality
    const toggleFAQ = (index) => {
        setOpenIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    // Animate FAQ dropdowns
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

    return (
        <div ref={containerRef}>
            <NavBarNew />
            
            {/* Hero section with single image */}
            <div className="hero-image-recruitment">
                <img
                    src={heroImage1}
                    alt="Recruitment Hero"
                    className="hero-img"
                    style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div className="hero-text-recruitment">
                    <h1>RUSH LPhiE</h1>
                    <p>Discover Brotherhood, Leadership, and Legacy</p>
                </div>
            </div>

            {/* FAQ section */}
            <div className="recruitment-faqs">
                <h2>Recruitment FAQs</h2>

                {recruitmentFAQs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h3
                            onClick={() => toggleFAQ(index)}
                            className={`faq-question ${openIndices.includes(index) ? 'active' : ''}`}
                        >
                            {faq.question}
                            <span className="faq-icon">
                                {openIndices.includes(index) ? '-' : '+'}
                            </span>
                        </h3>
                        <div
                            ref={el => faqRefs.current[index] = el}
                            className="faq-answer"
                            style={{ height: 0, overflow: 'hidden', opacity: 0 }}
                        >
                            <p>{faq.answer}</p>
                        </div>
                    </div>
                ))}

                <p>For any other further questions about recruitment, feel free to contact us on our Instagram!</p>
            </div>

            {/* Footer component */}
            <Footer />
        </div>
    );
}

export default Recruitment;
