import React, { useState, useRef, useEffect } from 'react';
import './Recruitment.scss';
import heroImage1 from '../assets/images/rec.jpg'; // Original hero image
import heroImage2 from '../assets/images/hero2.JPG'; // Secondary hero image
import NavBarNew from '../components/navbar/NavBarNew';
import { gsap } from 'gsap';

function Recruitment() {
    // Reference for the main container to apply fade-in animation
    const containerRef = useRef(null);

    // Set the background gradient
    useEffect(() => {
        document.body.style.background = "linear-gradient(to right, rgb(177, 177, 177) 0%, white 50%, rgb(177, 177, 177) 100%)";
    }, []);

    // Initial fade-in animation for all elements
    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(containerRef.current.children, {
                opacity: 0,
                duration: 1,
                stagger: 0.2,
                ease: 'power2.out'
            });
        }, containerRef);

        return () => ctx.revert(); // Cleanup on unmount
    }, []);

    // State to manage open FAQ indices
    const [openIndices, setOpenIndices] = useState([]);

    // Array of hero images
    const heroImages = [heroImage1, heroImage2]; // Add more images here as needed

    // Refs for the hero images
    const heroRefs = useRef([]);

    // Initialize refs array
    heroRefs.current = [];

    const addToRefs = (el) => {
        if (el && !heroRefs.current.includes(el)) {
            heroRefs.current.push(el);
        }
    };

    useEffect(() => {
        // Set initial opacity for all images except the first one
        gsap.set(heroRefs.current, { opacity: 0, filter: 'brightness(0.6)' });
        if (heroRefs.current[0]) {
            gsap.set(heroRefs.current[0], { opacity: 1 });
        }

        // Create a timeline for image fade transitions
        const tl = gsap.timeline({ repeat: -1 });

        heroRefs.current.forEach((current, index) => {
            const next = heroRefs.current[(index + 1) % heroRefs.current.length];
            tl.to(current, { duration: 1, opacity: 0, delay: 3 })
              .to(next, { duration: 1, opacity: 1 }, "-=1.5");
        });

        // Optional: Cleanup the timeline on component unmount
        return () => {
            tl.kill();
        };
    }, [heroImages.length]); // Re-run if the number of images changes

    // Function to toggle individual FAQ items
    const toggleFAQ = (index) => {
        setOpenIndices((prevIndices) =>
            prevIndices.includes(index)
                ? prevIndices.filter((i) => i !== index)
                : [...prevIndices, index]
        );
    };

    // Refs for FAQ dropdown elements
    const faqRefs = useRef([]);

    useEffect(() => {
        // Animate each FAQ based on whether it's open
        faqRefs.current.forEach((ref, index) => {
            if (ref) {
                if (openIndices.includes(index)) {
                    // Open the current FAQ
                    gsap.to(ref, { height: 'auto', opacity: 1, duration: 0.5, ease: 'power2.out' });
                } else {
                    // Close the FAQ
                    gsap.to(ref, { height: 0, opacity: 0, duration: 0.5, ease: 'power2.in' });
                }
            }
        });
    }, [openIndices]);

    return (
        <div ref={containerRef}>
            <NavBarNew />
            {/* Hero Image Section */}
            <div className="hero-image-recruitment">
                {heroImages.map((image, index) => (
                    <img
                        key={index}
                        ref={addToRefs}
                        src={image}
                        alt={`Hero ${index + 1}`}
                        className="hero-img"
                        style={{ position: 'absolute', width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                ))}
                <div className="hero-text-recruitment">
                    <h1>RUSH LPhiE</h1>
                    <p>Discover Brotherhood, Leadership, and Legacy</p>
                </div>
            </div>

            {/* Recruitment FAQ Section */}
            <div className="recruitment-faqs">
                <h2>Recruitment FAQs</h2>

                {[
                    {
                        question: "WHAT IS RECRUITMENT/RUSH WEEK?",
                        answer: "Recruitment week is a two week period for students to get a chance to meet the brothers of Lambda Phi Epsilon and to learn more about the fraternity through a variety of social events. Recruitment events are non-committal and occur usually at the beginning of every semester."
                    },
                    {
                        question: "WHAT CAN I EXPECT?",
                        answer: "Expect a lot of friendly faces! We're here to know more about each other and have a great time. There will be multiple social events with transportation, food, and new faces to meet!"
                    },
                    {
                        question: "SHOULD I ATTEND ALL THE RECRUITMENT EVENTS?",
                        answer: "In order to be eligible to receive a bid (an invitation to join our brotherhood), you must attend two social events and one info session. However, we encourage attending as many recruitment events as you want in order to get a glimpse into the fraternity life as well as to get a better understanding if Lambda Phi Epsilon is for you."
                    },
                    {
                        question: "AM I REQUIRED TO JOIN IF I ATTEND RECRUITMENT?",
                        answer: "No, recruitment events are non-binding and are solely to provide both an opportunity to familiarize yourself with the fraternity and Greek life while also providing you an opportunity to meet the brothers of Lambda Phi Epsilon."
                    },
                    {
                        question: "WHAT HAPPENS AFTER RECRUITMENT?",
                        answer: "After recruitment week has completed and you have completed the necessary recruitment requirements (attending two social events and one info session), you will be eligible for a formal interview with the brothers of Lambda Phi Epsilon."
                    },
                    {
                        question: "WILL JOINING A FRATERNITY IMPACT MY EDUCATION?",
                        answer: "One of Lambda Phi Epsilon's core and founding purposes is to promote academic achievement. Like any commitment, joining a fraternity will require time and effort, but managing school and joining a fraternity is definitely possible. As fellow students, the brothers of Lambda Phi Epsilon will also be committed to helping you achieve academic responsibility and success. Our info sessions will provide more details with time-commitments and management, but the best estimate would be relating the initiation process to a 3-hour credit course."
                    },
                    {
                        question: "DO I HAVE TO BE ASIAN TO BE A MEMBER?",
                        answer: "No, Lambda Phi Epsilon is an Asian-interest fraternity that focuses on the promotion of Asian American awareness. Members of any ethnicity, race, religion, gender identity, sexuality, and background are always welcomed in our brotherhood."
                    },
                ].map((faq, index) => (
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

            {/* Footer */}
            <footer className="footer">
                <div className="footer-content">
                    <p>&copy; 2024 NC State Lambda Phi Epsilon. All rights reserved.</p>
                    <p>Designed, Built, Tested by Jordan <strong>'InterstellHer'</strong> Miller.</p>
                    <nav className="footer-nav">
                        <ul>
                            <li><a href="/about">About Us</a></li>
                            <li><a href="/contact">Contact</a></li>
                            <li><a href="/privacy">Privacy Policy</a></li>
                        </ul>
                    </nav>
                </div>
            </footer>
        </div>
    );
}

export default Recruitment;
