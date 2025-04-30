import React, { useEffect, useState } from 'react'

const Page1 = () => {
    const [animateText, setAnimateText] = useState(false);
    const [animateBoxes, setAnimateBoxes] = useState(false);

    useEffect(() => {
        // Trigger animations after the component mounts
        const timer = setTimeout(() => {
            setAnimateText(true); // Start text animation
        }, 100); // Slight delay to ensure smooth transition

        const timer2 = setTimeout(() => {
            setAnimateBoxes(true); // Start boxes animation
        }, 300); // Delay for box animation

        return () => {
            clearTimeout(timer);
            clearTimeout(timer2);
        };
    }, []);
    return (
        <div className="flex flex-row h-[80vh] w-[90vw] mx-auto gap-64">
            {/* Text Section Animation */}
            <div
                className={`mt-40 text-center text-5xl font-serif pt-5 transform transition-transform duration-1000 ease-out ${animateText ? "scale-100" : "scale-0"
                    }`}
            >
                <p className='pb-2'>Find the best <span className="text-5xl font-bold bg-gradient-to-r from-purple-600 via-pink-500 
                                     to-indigo-600 bg-clip-text text-transparent animate-gradient-x 
                                     transition-all duration-300 group-hover:scale-105">
                            AI Learning
                        </span> </p>
                <p>for growth of your skills & define</p>
                <p>your career.</p>
            </div>
            <div className='w-[380px] h-[400px] mt-32 bg-[url(https://miro.medium.com/v2/resize:fit:1280/1*KnysljyGv_C1hi9rBSUAKg.gif)]  bg-cover'>
                
            </div>

        </div>
    )
}

export default Page1