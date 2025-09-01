import React, { useState } from 'react';
import demoImg from '../assets/images/demo.jpg';
// import import "./NewsModal.css";
import "./NewsModal.css";



const NewsModal = () => {
  const [isOpen, setIsOpen] = useState(true); // State to control modal visibility

  if (!isOpen) return null; // Hide modal when closed

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
      <div className="bg-gray-900 rounded-2xl p-6 max-w-3xl w-full relative">
        
        {/* Close Button (Top Right) */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 text-white text-3xl hover:text-red-500 transition"
        >
          <i className="fa-solid fa-xmark"></i>
        </button>
        
        {/* Modal Image */}
        <img
          src={demoImg}
          alt="modal"
          className="w-full h-auto max-h-[30rem] object-cover rounded-xl opacity-50"
        />

        {/* Title */}
        <h2 className="font-bebas text-3xl text-white tracking-wide mt-6">
          Lorem ipsum dolor sit amet consectetur,
          adipisicing elit. Exercitationem ea ipsa atque cupiditate quibusdam
          dolorum itaque? Architecto beatae error sapiente quasi nesciunt neque!
          Harum necessitatibus totam fugiat, nobis quae neque.
        </h2>

        {/* Source & Date */}
        <p className="font-comfortaa text-lg text-gray-400 mt-4">
          Source: The Guardian
        </p>
        <p className="font-comfortaa text-lg text-gray-400 mt-2">
          Jan 23, 2025, 04:15
        </p>

        {/* Content */}
        <p className="text-lg mt-6 leading-8 text-gray-300">
          lprem
        </p>

        {/* Read More Button */}
        <a
          href="#"
          className="inline-block mt-6 w-40 bg-gradient-to-r from-purple-400 to-indigo-500 text-white text-center uppercase tracking-wider py-3 rounded-full text-lg hover:opacity-90 active:translate-y-0.5 transition"
        >
          Read More
        </a>
      </div>
    </div>
  );
};

export default NewsModal;
