// /Sections/Hero.jsx
import React from 'react';
import TextAnimation from '../elements/TextAnimation';
function Hero() {
    return (
        <section id="hero">
           <p className="prose-sm text-stone-50 sm:prose-base lg:prose-lg">
                <strong className="text-sky-500">M.Sc in Computer Engineering</strong>
                <br></br>Currently a part-time Master's student specializing in Software Engineering
            </p>


            <div className='lg:flex-row text-left bg-black w-4/5 p-2 rounded-lg'>
                <div className='text-stone-300'><TextAnimation/></div>
            </div>

        </section>
    );
}

export default Hero;