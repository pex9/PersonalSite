// HomeRoute.jsx
import React from 'react';
import About from './Sections/About';
import Contact from './Sections/Contact';
import Footer from './Sections/Footer';
import Hero from './Sections/Hero';
import Portfolio from './Sections/Portfolio';
import Resume from './Sections/Resume';
import Header from './Sections/Header';

function HomeRoute(props) {
    return (
        <>
            <Header />
            <Hero />
            <About />
            <Resume />
            <Portfolio />
            <Contact />
            <Footer />
        </>
    );
}

export default HomeRoute;