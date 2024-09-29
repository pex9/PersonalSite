// HomeRoute.jsx
import React from 'react';
import About from './Sections/About';
import Footer from './Sections/Footer';
import Hero from './Sections/Hero';
import Portfolio from './Sections/Portfolio';
import Resume from './Sections/Resume';
import Header from './Sections/Header';
import Education from './Sections/Education';

function HomeRoute(props) {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Education/>
            <Resume />
            <Portfolio />
            <Footer />
        </>
    );
}

export default HomeRoute;