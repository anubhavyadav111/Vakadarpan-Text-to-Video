"use client"
// animation 
import React, { useState, useEffect } from 'react';
import { NewsCanvas } from './canvas';

const Hero = () => {
  const [zIndex, setZIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setZIndex((prevZIndex) => (prevZIndex === 0 ? 10 : 0));
    }, 8000); // Adjust the time interval (in milliseconds) here

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative mx-auto ">
      <div className="items-center justify-center relative">
        <div className="text-9xl text-center relative z-10">
          <div>Welcome to</div>
          <div>
            the <span className="letter-color">Vakyadarpan</span>
          </div>
        </div>
        <div className={`absolute top-0 left-0 w-full h-96 z-${zIndex}`}>
          <NewsCanvas />
        </div>
      </div>
    </section>
  );
};

export default Hero;
