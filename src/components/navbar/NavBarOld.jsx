/**
 * LambdaNav is the implementation of the navigation bar. All of its
 * functions are defined here, including the offset dropdown bar and its
 * contents.
 * 
 * @author Jordan "InterstellHer" Miller
 * @since June 5, 2024
 */

// Import components for the navigation bar
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Offcanvas from 'react-bootstrap/Offcanvas';
import React from 'react';

// Import CSS styling
import './NavBar.css'

// Import assets
import ncsu_logo from '../assets/images/ncsu_logo.png'
import lphie_logo2 from '../assets/images/lphie_logo2.png'

/**
 * Definition and properties for an offcanvas example navigation bar. This
 * is a functional component in React.
 * 
 * @returns The navigation bar JSX with offcanvas functionality.
 */
function NavBarOld() {
    return (
        <>
            {[false].map((expand) => (
                <Navbar
                    key={expand}
                    expand={expand}
                    className="navbar-transparent mb-3"
                    style={{ position: 'sticky', top: '0', zIndex: '1000', backgroundColor: '#fff' }} // Make the navbar sticky
                >
                    <Container fluid>
                        <Navbar.Brand href="/">
                            <img src={lphie_logo2} alt="Logo" className="navbar-logo" style={{ height: '70px', backgroundColor: 'transparent' }} />
                        </Navbar.Brand>
                        <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
                        <Navbar.Offcanvas
                            id={`offcanvasNavbar-expand-${expand}`}
                            aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                            placement="end"
                        >
                            <Offcanvas.Header closeButton>
                                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                                    <img src={ncsu_logo} alt="Logo" style={{ height: '80px' }} />
                                </Offcanvas.Title>
                            </Offcanvas.Header>
                            <Offcanvas.Body className='nav-link-fonts'>
                                <Nav className="justify-content-end flex-grow-1 pe-3">
                                    <Nav.Link href="#action1" className="cascade-link">Recruitment</Nav.Link>
                                    <Nav.Link href="#action2" className="cascade-link">Brothers</Nav.Link>
                                    <Nav.Link href="legacy" className="cascade-link">Legacy</Nav.Link>
                                    <Nav.Link href="#action4" className="cascade-link">Media</Nav.Link>
                                    <div className="divider cascade-link"></div>
                                    <Nav.Link href="#action5" className="cascade-link">Contact Us</Nav.Link>
                                </Nav>
                            </Offcanvas.Body>
                        </Navbar.Offcanvas>
                    </Container>
                </Navbar>
            ))}
        </>
    );
}

export default NavBarOld;
