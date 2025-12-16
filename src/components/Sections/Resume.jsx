// /Sections/Resume.jsx
import React from 'react';

function Resume() {
    return (
        <section id="resume" className="py-20 bg-gray-100">
            <h2 className="text-3xl text-center font-bold">Experience</h2>
            <ul className="mt-8">

                <li className="mb-6">
                   <h3 className="text-xl font-bold">Intesa San Paolo, Junior Software Engineer - Credit Risk</h3>
                   <strong><p className="text-gray-600">Turin, Italy (January 2026)</p> </strong>
                    <p className="text-gray-600">
                        Design and develop application software, collaborate with cross-functional teams, produce technical documentation, ensure compliance with corporate standards and regulations, analyze data models, and support project delivery and maintenance through proactive risk management and problem resolution.                    </p>
                </li>
                <li className="mb-6">
                   <h3 className="text-xl font-bold">Iriscube Reply, Consultant</h3>
                   <strong><p className="text-gray-600">Turin, Italy (November 2024 – January 2026)</p> </strong>
                    <p className="text-gray-600">
                        Analysis, design, and development of web-based applications using SPRING framework technology.
                    </p>
                </li>
                {/* First Experience */}
                <li className="mb-6">
                   <h3 className="text-xl font-bold">CMV Group, Web Developer</h3>
                   <strong><p className="text-gray-600">Cuneo, Italy (March 2023 – October 2023)</p> </strong>
                    <p className="text-gray-600">
                        Analysis, design, and development of web-based applications using LAMP technology.
                    </p>
                </li>

                {/* Second Experience */}
                <li className="mb-6">
                    <h3 className="text-xl font-bold">Web Developer Intern</h3>
                    <strong><p className="text-gray-600">Cuneo, Italy (July 2022 – October 2022)</p> </strong>
                    <p className="text-gray-600">
                        Analysis, design, and development of web-based applications using LAMP technology. 
                        Server-side development (PHP) and client-side development (HTML, CSS3, JS) 
                        with database connection (MySQL) and creation of queries in SQL language.
                    </p>
                </li>
            </ul>
        </section>
    );
}

export default Resume;
