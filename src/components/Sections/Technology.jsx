import React from 'react';

// Importing your WebP images
import openAiPic from '../../images/tech/open_ai.webp';
import pythonPic from '../../images/tech/python.webp';
import githubPic from '../../images/tech/github.webp';
import gitPic from '../../images/tech/git.webp';
import dockerPic from '../../images/tech/docker.webp';
import mysqlPic from '../../images/tech/mysql.webp';
import javascriptPic from '../../images/tech/js.webp';
import reactPic from '../../images/tech/react.webp';

export const FavoriteTechItems = [
    {
        title: 'OpenAI',
        image: openAiPic,
    },
    {
        title: 'Python 3+',
        image: pythonPic,
    },
    {
        title: 'GitHub',
        image: githubPic,
    },
    {
        title: 'Git',
        image: gitPic,
    },
    {
        title: 'Docker',
        image: dockerPic,
    },
    {
        title: 'MySQL/SQL',
        image: mysqlPic,
    },
    {
        title: 'JavaScript',
        image: javascriptPic,
    },
    {
        title: 'React',
        image: reactPic,
    },
];

function Technology() {
    return (
        <section id="technology" className="py-20">
            <h2 className="text-3xl text-center font-bold">Favorite Technologies</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
                {FavoriteTechItems.map((item, index) => (
                    <div key={index} className="tech-item flex flex-col items-center p-4">
                        <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-16 h-16 mb-2 object-contain" // Use object-contain for better scaling
                        />
                        <h3 className="text-lg text-center">{item.title}</h3>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default Technology;