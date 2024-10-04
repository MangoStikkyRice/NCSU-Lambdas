import { useRef, useEffect } from 'react'; 
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Philanthropy.scss';
import EVANCHEN from "../../assets/images/EVANCHEN.png";

const items = [
    {
        id: 1,
        title: "Be The Match 1",
        img: EVANCHEN,
        desc: "EVAN CHEN!",
    },
    {
        id: 2,
        title: "Be The Match 2",
        img: EVANCHEN,
        desc: "EVAN CHEN!",
    },
    {
        id: 3,
        title: "Be The Match 3",
        img: EVANCHEN,
        desc: "EVAN CHEN!",
    },
    {
        id: 4,
        title: "Be The Match 4",
        img: EVANCHEN,
        desc: "EVAN CHEN!",
    }
];

const Single = ({ item }) => {
    const ref = useRef();

    useEffect(() => {
        gsap.registerPlugin(ScrollTrigger);

        const element = ref.current;
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: element,
                start: 'top bottom',
                end: 'bottom top',
                scrub: 1,
            },
        });

        tl.fromTo(
            element.querySelector('.imageContainer'),
            { y: 300, ease: 'power1.inOut' },
            { y: -300, ease: 'power1.out' },
        );

        return () => {
            tl.scrollTrigger.kill();
        };
    }, []);

    return (
        <section ref={ref}>
            <div className="container">
                <div className="wrapper">
                    <div className="imageContainer">
                        <img src={item.img} alt="" />
                    </div>
                    <div className="textContainer">
                        <h2>{item.title}</h2>
                        <p>{item.desc}</p>
                        <button>DEMO</button>
                    </div>
                </div>
            </div>
        </section>
    );
};

function Philanthropy() {
    const philanthropyRef = useRef(null);
    const progressBarRef = useRef(null);

    useEffect(() => {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (prefersReducedMotion) {
            // If user prefers reduced motion, set progress bar to full scale
            gsap.set(progressBarRef.current, { scaleX: 1 });
            // Optionally, set opacity or other properties if needed
            return;
        }

        gsap.registerPlugin(ScrollTrigger);

        // GSAP Animation for Progress Bar - from center outward
        gsap.fromTo(
            progressBarRef.current,
            { scaleX: 0 }, // Start scale
            {
                scaleX: 1, // End scale
                ease: 'none',
                transformOrigin: 'center center', // Ensure origin is center
                scrollTrigger: {
                    trigger: philanthropyRef.current,
                    start: 'top top',
                    end: 'bottom bottom',
                    scrub: true,
                    // markers: true, // Uncomment for debugging
                }
            }
        );

        // Optional: Animate the items or other elements as needed
        // Example: Fade in items as they enter the viewport
        gsap.utils.toArray('.single-item').forEach((item) => {
            gsap.from(item, {
                opacity: 0,
                y: 50,
                duration: 1,
                ease: 'power1.out',
                scrollTrigger: {
                    trigger: item,
                    start: 'top 80%',
                    toggleActions: 'play none none reverse',
                    // markers: true, // Uncomment for debugging
                }
            });
        });

        // Cleanup ScrollTriggers on unmount
        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        };
    }, []);

    return (
        <div className="philanthropy" ref={philanthropyRef}>
            <div className="progress">
                <h1>Featured Works</h1>
                <div ref={progressBarRef} className="progressBar"></div>
            </div>
            {items.map(item => (
                <Single item={item} key={item.id} />
            ))}
        </div>
    );
}

export default Philanthropy;
