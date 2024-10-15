import React from 'react';
import './Recruitment.css';
import heroImage from '../assets/images/rec.jpg'; // Replace with the correct path to your hero image
import NavBarNew from '../components/navbar/NavBarNew';

function Recruitment() {
    return (
        <div>
            <NavBarNew />
            {/* Hero Image Section */}
            <div className="hero-image-recruitment" style={{ backgroundImage: `url(${heroImage})` }}>
                <div className="hero-text-recruitment">
                    <h1>RUSH LPhiE</h1>
                    <p>Discover Brotherhood, Leadership, and Legacy</p>
                </div>
            </div>

            {/* Recruitment FAQ Section */}
            <div className="recruitment-faqs">
                <h2>Recruitment FAQs</h2>

                <div className="faq-item">
                    <h3>WHAT IS RECRUITMENT/RUSH WEEK?</h3>
                    <p>Recruitment week is a two week period for students to get a chance to meet the brothers of Lambda Phi Epsilon and to learn more about the fraternity through a variety of social events. Recruitment events are <strong>non-committal</strong> and occur usually at the beginning of every semester.</p>
                </div>

                <div className="faq-item">
                    <h3>WHAT CAN I EXPECT?</h3>
                    <p>Expect a lot of friendly faces! We're here to know more about each other and have a great time. There will be multiple social events with transportation, food, and new faces to meet!</p>
                </div>

                <div className="faq-item">
                    <h3>SHOULD I ATTEND ALL THE RECRUITMENT EVENTS?</h3>
                    <p>In order to be eligible to receive a bid (an invitation to join our brotherhood), you must attend <strong>two</strong> social events and <strong>one</strong> info session. However, we encourage attending as many recruitment events as you want in order to get a glimpse into the fraternity life as well as to get a better understanding if Lambda Phi Epsilon is for you.</p>
                </div>

                <div className="faq-item">
                    <h3>AM I REQUIRED TO JOIN IF I ATTEND RECRUITMENT?</h3>
                    <p>No, recruitment events are <strong>non-binding</strong> and are solely to provide both an opportunity to familiarize yourself with the fraternity and Greek life while also providing you an opportunity to meet the brothers of Lambda Phi Epsilon.</p>
                </div>

                <div className="faq-item">
                    <h3>WHAT HAPPENS AFTER RECRUITMENT?</h3>
                    <p>After recruitment week has completed and you have completed the necessary recruitment requirements (attending <strong>two</strong> social events and <strong>one</strong> info session), you will be eligible for a formal interview with the brothers of Lambda Phi Epsilon.</p>
                </div>

                <div className="faq-item">
                    <h3>WILL JOINING A FRATERNITY IMPACT MY EDUCATION?</h3>
                    <p>One of Lambda Phi Epsilon's core and founding purposes is to promote academic achievement. Like any commitment, joining a fraternity will require time and effort, but managing school and joining a fraternity is definitely possible. As fellow students, the brothers of Lambda Phi Epsilon will also be committed to helping you achieve academic responsibility and success. Our info sessions will provide more details with time-commitments and management, but the best estimate would be relating the initiation process to a 3-hour credit course.</p>
                </div>

                <div className="faq-item">
                    <h3>DO I HAVE TO BE ASIAN TO BE A MEMBER?</h3>
                    <p>No, Lambda Phi Epsilon is an Asian-interest fraternity that focuses on the promotion of Asian American awareness. Members of any ethnicity, race, religion, gender identity, sexuality, and background are always welcomed in our brotherhood.</p>
                </div>

                <p>For any other further questions about recruitment, feel free to contact us on our Instagram!</p>
            </div>
        </div>
    );
}

export default Recruitment;
