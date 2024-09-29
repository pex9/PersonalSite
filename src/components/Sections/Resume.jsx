// /Sections/Resume.jsx
import React from 'react';

function Resume() {
    return (
        <section id="resume" className="py-20 bg-gray-100">
            <h2 className="text-3xl text-center font-bold">Experience</h2>
            <ul className="mt-8">
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
