// /Sections/About.jsx
import React from 'react';
import { MapIcon, FlagIcon, SparklesIcon, AcademicCapIcon } from '@heroicons/react/outline';
import { FaDownload } from 'react-icons/fa'; // Importing download icon from react-icons

function About() {
    return (
        <section id="about" className="about-section">
            <h2 className="about-title">About Me</h2>
            <div className="about-description">
                <p>
                    Bachelor's degree in Computer Engineering from the Polytechnic University of Turin. 
                    Currently a part-time Master's student specializing in Software Engineering.
                    I am looking for a part-time job as a software developer to combine with my university studies,
                    with the goal of applying my knowledge and helping the company achieve its objectives.
                </p>
            </div>
            
            {/* CV Download Button */}
            <div className="mt-6 about-item">
                    <a 
                        href="https://www.linkedin.com/in/davide-pellegrino-53609a221/overlay/1727703096694/single-media-viewer/?profileId=ACoAADe4L3oBPuoJYBt6r8D0Tqrop7n1RqjBDdA"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-600 text py-2 px-4 rounded hover:bg-blue-700 transition duration-300 flex items-center justify-center w-full space-x-2"
                    >
                        <FaDownload className="h-5 w-5" /> {/* Download Icon */}
                        <span>Download CV</span>
                    </a>
            </div>

            {/* About Items */}
            <div className="about-items">
                {/* Location */}
                <div className="about-item">
                    <MapIcon className="icon" />
                    <span>Cuneo, Italy</span>
                </div>

                {/* Nationality */}
                <div className="about-item">
                    <FlagIcon className="icon" />
                    <span>Italian</span>
                </div>

                {/* Interests */}
                <div className="about-item">
                    <SparklesIcon className="icon" />
                    <span>Development, Technology, Cooking</span>
                </div>

                {/* Study */}
                <div className="about-item">
                    <AcademicCapIcon className="icon" />
                    <span>Politecnico di Torino</span>
                </div>
            </div>

            {/* Social Links */}
<div className="about-links mt-8">
    <h3 className="text-xl font-bold">Connect with me</h3>

    {/* LinkedIn Link */}
    <div className="about-item mt-4">
        <a 
            href="https://www.linkedin.com/in/davide-pellegrino-53609a221/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="icon-link flex items-center space-x-2"
        >
            <i className="fab fa-linkedin-in text-blue-700"></i> {/* LinkedIn Icon */}
            <span>LinkedIn</span>
        </a>
    </div>

    {/* GitHub Link */}
    <div className="about-item mt-4">
        <a 
            href="https://github.com/pex9" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="icon-link flex items-center space-x-2"
        >
            <i className="fab fa-github text-gray-800"></i> {/* GitHub Icon */}
            <span>GitHub</span>
        </a>
    </div>
</div>

        </section>
    );
}

export default About;
