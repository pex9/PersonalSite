/* eslint-disable */

import React from 'react';
import {TypeAnimation} from 'react-type-animation';

const TextAnimation = () => {
    return (

        <TypeAnimation
            sequence={[
                'Proficient in coding with ReactJS, JavaScript',
                3000,
                'Certainly adept in HTML, Php.',
                4000,
                () => {
                    console.log('Done typing!');
                }
            ]}
            wrapper="div"
            cursor={true}
            repeat={Infinity}
            omitDeletionAnimation={false}
            className={"before:content-['Resume-Website/']"}

            //   style={{ fontSize: '15px' }}
        />


    );
};


export default TextAnimation;
