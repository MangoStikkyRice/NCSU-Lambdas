// Media.jsx
import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Slider from 'react-slick';
import { FaYoutube, FaInstagram, FaImages } from 'react-icons/fa';
import './Media.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Media() {
    const containerRef = useRef(null);

    // Sample data for YouTube videos
    const youtubeVideos = [
        {
            title: 'Charter Conquest',
            url: 'https://youtu.be/RUQTrrlLkx8',
            thumbnail: 'https://i.ytimg.com/vi/RUQTrrlLkx8/hqdefault.jpg',
        },
        {
            title: 'Alpha Ascension',
            url: 'https://youtu.be/9zngWsr6LE4',
            thumbnail: 'https://i.ytimg.com/vi/9zngWsr6LE4/hqdefault.jpg',
        },
        {
            title: 'Beta Battalion',
            url: 'https://youtu.be/DGXhEBjH81E',
            thumbnail: 'https://i.ytimg.com/vi/DGXhEBjH81E/hqdefault.jpg',
        },
        {
            title: 'Gamma Guardians',
            url: 'https://youtu.be/OrSyEHm372o',
            thumbnail: 'https://i.ytimg.com/vi/OrSyEHm372o/hqdefault.jpg',
        },
        {
            title: 'Delta Dimension',
            url: 'https://youtu.be/Wx1MEwTpfEo',
            thumbnail: 'https://i.ytimg.com/vi/Wx1MEwTpfEo/hqdefault.jpg',
        },
        {
            title: 'Epsilon Eclipse',
            url: 'https://youtu.be/SBTsNR2__e4',
            thumbnail: 'https://i.ytimg.com/vi/SBTsNR2__e4/hqdefault.jpg',
        },
        {
            title: 'Zeta Zaibatsu',
            url: 'https://youtu.be/VAUJxBy--yc',
            thumbnail: 'https://i.ytimg.com/vi/VAUJxBy--yc/hqdefault.jpg',
        },
        {
            title: 'Iota Immortals',
            url: 'https://www.youtube.com/watch?v=TBdsb6LB-tg',
            thumbnail: 'https://i.ytimg.com/vi/TBdsb6LB-tg/hqdefault.jpg',
        },
        {
            title: 'Mu Monarchs',
            url: 'https://youtu.be/ttDvgZ6D9NE',
            thumbnail: 'https://i.ytimg.com/vi/ttDvgZ6D9NE/hqdefault.jpg',
        },
        {
            title: 'Nu Nen',
            url: 'https://youtu.be/VAHC-5UoZPY',
            thumbnail: 'https://i.ytimg.com/vi/VAHC-5UoZPY/hqdefault.jpg',
        },
        {
            title: 'Xi Xin',
            url: 'https://youtu.be/6cm_sYJfTB8',
            thumbnail: 'https://i.ytimg.com/vi/6cm_sYJfTB8/hqdefault.jpg',
        },
    ];

    // Sample data for Instagram posts
    const instagramPosts = [
        {
            id: 1,
            image: 'https://via.placeholder.com/600x400?text=Instagram+1',
            link: 'https://www.instagram.com/p/POST_ID1/',
        },
        {
            id: 2,
            image: 'https://via.placeholder.com/600x400?text=Instagram+2',
            link: 'https://www.instagram.com/p/POST_ID2/',
        },
        // Add more Instagram posts as needed
    ];

    // Sample data for Gallery
    const galleryPhotos = [
        'https://via.placeholder.com/600x400?text=Gallery+1',
        'https://via.placeholder.com/600x400?text=Gallery+2',
        'https://via.placeholder.com/600x400?text=Gallery+3',
        'https://via.placeholder.com/600x400?text=Gallery+4',
        // Add more photos as needed
    ];

    // Settings for react-slick carousel
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        responsive: [
            {
                breakpoint: 1024,
                settings: { slidesToShow: 2 },
            },
            {
                breakpoint: 600,
                settings: { slidesToShow: 1 },
            },
        ],
    };

    return (
        <div className="media-container" ref={containerRef}>
            <h1 className="media-title">
                <FaImages /> Media Page
            </h1>
            <section className="youtube-section">
                <h2><FaYoutube /> YouTube Videos</h2>
                <div className="youtube-grid">
                    {youtubeVideos.map((video, index) => (
                        <a
                            key={index}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="youtube-card"
                        >
                            <img src={video.thumbnail} alt={video.title} />
                            <div className="youtube-info">
                                <h3>{video.title}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </section>

            <section className="instagram-section">
                <h2><FaInstagram /> Instagram Feed</h2>
                <Slider {...sliderSettings}>
                    {instagramPosts.map(post => (
                        <div key={post.id} className="instagram-slide">
                            <a href={post.link} target="_blank" rel="noopener noreferrer">
                                <img src={post.image} alt={`Instagram Post ${post.id}`} />
                            </a>
                        </div>
                    ))}
                </Slider>
            </section>

            <section className="gallery-section">
                <h2>Gallery Photo Dumps</h2>
                <div className="gallery-grid">
                    {galleryPhotos.map((photo, index) => (
                        <div key={index} className="gallery-item">
                            <img src={photo} alt={`Gallery ${index + 1}`} />
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
