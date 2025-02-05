import React from 'react';
import "./Constitution.scss";

import constitution from '../../assets/images/constitution.jpg';

function Constitution() {
    return (
        <div className="Constitution-page">
            <h1>Constitution</h1>
            <div className="Constitution-body">
                <img src={constitution}></img>
                <a
                    href="https://docs.google.com/document/d/1KuqyxZ0QIB6uYrvdcCjWJc6YRqvPtH1Wz8CC9uPjn4c/edit?usp=drive_link"
                    className="Constitution-button"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    View Constitution
                </a>
            </div>
        </div>
    );
}

export default Constitution;