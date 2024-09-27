import { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import panel1 from '../assets/images/panel1.jpeg';
import panel2 from '../assets/images/panel2.jpg';
import panel3 from '../assets/images/panel3.jpeg';
import panel4 from '../assets/images/panel4.png';
import './Home.css';
import StartupOverlay from '../components/startupoverlay/StartupOverlay';

function Home() {
    const [overlayVisible, setOverlayVisible] = useState(true);
    const [posts, setPosts] = useState([]); // Initialize as an empty array
    const [isFading, setIsFading] = useState(false); // State to handle fade-out
    const navigate = useNavigate(); // Hook for navigation

    const handleOverlayComplete = () => {
        setOverlayVisible(false);
    };

    useEffect(() => {
        const fetchInstagramPosts = async () => {
            const token = 'IGQWRPaFFsMHIxc2RFcmpod2R5NmhxU1VRWmNTcGJ5cFpyME1LOVVuVG9EWklEdXhOeXI2T1JlQXZAmZAmVQRVVlWVZAIMWJaV2hYeU9ZAem9yZAW9uVmRVSnVVdVN4RFdVQW4wdzIyVGQ5ZAzNNVTNfZAUwwaVlCRHJsZAVUZD'; // Replace with your Instagram access token
            const userId = 'ncsulphie'; // Replace with your Instagram user ID
            const url = `https://graph.instagram.com/${userId}/media?fields=id,caption,media_url,permalink&access_token=${token}`;
            try {
                const response = await fetch(url);
                const data = await response.json();
                console.log(data); // Log the response to check structure
                setPosts(data.data || []); // Ensure posts is always an array
            } catch (error) {
                console.error('Error fetching Instagram posts:', error);
                setPosts([]); // Ensure posts is an empty array in case of error
            }
        };

        fetchInstagramPosts();
    }, []);

    // Function to handle fade out and navigate
    const handlePanelClick = (path) => {
        setIsFading(true); // Trigger fade-out effect
        setTimeout(() => {
            navigate(path); // Navigate to the new page after fade-out
        }, 500); // Match timeout with the duration of the fade-out animation
    };

    return (
        <div id="home" className={isFading ? 'fade-out' : ''}>
            {overlayVisible && <StartupOverlay onComplete={handleOverlayComplete} />}
            <Container fluid className="custom-container">
                <Row>
                    <Col md={6} className="pr-md-2">
                        <a onClick={() => handlePanelClick('/recruitment')}>
                            <Card className="mb-4 image-card large-card">
                                <Card.Img variant="top" src={panel1} />
                                <Card.ImgOverlay className="d-flex align-items-center justify-content-center">
                                    <div className="card-title">Recruitment</div>
                                </Card.ImgOverlay>
                            </Card>
                        </a>
                        <a onClick={() => handlePanelClick('/brothers')}>
                            <Card className="mb-4 image-card small-card">
                                <Card.Img variant="top" src={panel3} />
                                <Card.ImgOverlay className="d-flex align-items-center justify-content-center">
                                    <div className="card-title">Brothers</div>
                                </Card.ImgOverlay>
                            </Card>
                        </a>
                    </Col>
                    <Col md={6} className="pl-md-2">
                        <Link onClick={() => handlePanelClick('/legacy')}>
                            <Card className="mb-4 image-card small-card">
                                <Card.Img variant="top" src={panel4} />
                                <Card.ImgOverlay className="d-flex align-items-center justify-content-center">
                                    <div className="card-title">Legacy</div>
                                </Card.ImgOverlay>
                            </Card>
                        </Link>
                        <a onClick={() => handlePanelClick('/media')}>
                            <Card className="image-card large-card">
                                <Card.Img variant="top" src={panel2} />
                                <Card.ImgOverlay className="d-flex align-items-center justify-content-center">
                                    <div className="card-title">Media</div>
                                </Card.ImgOverlay>
                            </Card>
                        </a>
                    </Col>
                </Row>
                <div className="instagram-carousel">
                    {posts && posts.length > 0 ? (
                        posts.map(post => (
                            <a key={post.id} href={post.permalink} target="_blank" rel="noopener noreferrer">
                                <img src={post.media_url} alt={post.caption} />
                            </a>
                        ))
                    ) : (
                        <p>No posts available</p>
                    )}
                </div>
            </Container>
        </div>
    );
}

export default Home;
