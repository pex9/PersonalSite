// /Sections/Portfolio.jsx
import React from 'react';

function Portfolio() {
    return (
        <section id="portfolio">
            <h2>Portfolio</h2>
            <div className="projects">
                <div className="project">
                    <h3>Project 1</h3>
                    <p>A web app built using React and Node.js.</p>
                </div>
                <div className="project">
                    <h3>Project 2</h3>
                    <p>A portfolio site developed using HTML, CSS, and JavaScript.</p>
                </div>
            </div>
        </section>
    );
}

export default Portfolio;