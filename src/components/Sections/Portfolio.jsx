// /Sections/Portfolio.jsx
import React from 'react';
import collaborantAnt from '../../images/portfolio/collaborant.webp';
import backupApp from '../../images/portfolio/backupapp.webp';

function Portfolio() {
    return (
        <section id="portfolio" className="py-20 bg-gray-100">
            <h2 className="text-3xl text-center font-bold">Portfolio</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8 container mx-auto px-4">
                {/* First Project */}
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1">
                    {/* Image Container with fixed dimensions */}
                    <div
                        className="overflow-hidden rounded"
                        style={{ width: '100%', height: '200px', maxHeight: '200px' }}
                    >
                        <img
                            src={collaborantAnt}
                            alt="CollaborAnt, mobile application"
                            className="w-full h-full object-cover"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                    <h3 className="text-xl font-bold mt-4">CollaborAnt, mobile application</h3>
                    <p className="text-gray-600">
                        CollaborAnt provides a platform where users can work together seamlessly, share ideas, and manage projects effectively.
                    </p>
                    <a
                        href="https://github.com/pex9/CollaborAnt"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-2 block hover:underline"
                    >
                        View Project
                    </a>
                </div>

                {/* Second Project */}
                <div className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition duration-200 ease-in-out transform hover:-translate-y-1">
                    {/* Image Container with fixed dimensions */}
                    <div
                        className="overflow-hidden rounded"
                        style={{ width: '100%', height: '200px', maxHeight: '200px' }}
                    >
                        <img
                            src={backupApp}
                            alt="Emergency Backup"
                            className="w-full h-full object-cover"
                            style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                        />
                    </div>
                    <h3 className="text-xl font-bold mt-4">Emergency Backup</h3>
                    <p className="text-gray-600">
                        This Rust application is designed to perform backups on a PC, especially in scenarios where the screen is not accessible.
                    </p>
                    <a
                        href="https://github.com/pex9/Backup-application"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 mt-2 block hover:underline"
                    >
                        View Project
                    </a>
                </div>
            </div>
        </section>
    );
}

export default Portfolio;
