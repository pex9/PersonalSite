// /Sections/Education.jsx
import React from 'react';

function Education() {
    return (
        <section id="education" className="py-20 bg-gray-100">
            <h2 className="text-3xl text-center font-bold">Education</h2>
            <ul className="mt-8">
                {/* First Education Entry */}
                <li className="mb-6">
                    <h3 className="text-xl font-bold">M.Sc in Computer Engineering</h3>
                    <p className="text-gray-600">Politecnico di Torino (Sept 2023 – July 2025)</p>
                    <p className="text-gray-600"></p> {/* Additional content can be added here */}
                </li>

                {/* Second Education Entry */}
                <li className="mb-6">
                    <h3 className="text-xl font-bold">B.Sc in Computer Engineering</h3>
                    <p className="text-gray-600">Politecnico di Torino (Sept 2020 – July 2023)</p>
                    <p className="text-gray-600">GPA: 107/110</p>
                </li>
            </ul>
        </section>
    );
}

export default Education;