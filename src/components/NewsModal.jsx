import React from "react";

const NewsModal = ({ show, article, onClose }) => {
  if (!show) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-[1000]">
      <div className="w-[90%] max-w-[60rem] h-auto max-h-full bg-[#111214] p-16 rounded-2xl shadow-[0_0_5rem_4rem_rgba(0,0,0,0.5)] relative overflow-y-auto scrollbar-hide">
        <span 
          className="absolute top-4 right-8 text-2xl text-white cursor-pointer hover:text-gray-300 transition-colors"
          onClick={onClose}
        >
          <i className="fa-solid fa-xmark"></i>
        </span>
        
        <img 
          src={article?.image || 'default-image.jpg'} 
          alt="demo" 
          className="w-full h-auto max-h-[30rem] object-cover rounded-2xl opacity-50"
        />
        
        <h2 className="font-['Bebas_Neue'] text-4xl text-white tracking-wider mt-8">
          {article?.title}
        </h2>
        
        <p className="font-['Comfortaa'] text-lg text-[#bbb] mt-4">
          {article?.source?.name}
        </p>
        
        <p className="font-['Comfortaa'] text-lg text-[#bbb] mt-4">
          {article?.publishedAt ? new Date(article.publishedAt).toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }) : ''}
        </p>
        
        <p className="text-xl mt-8 leading-[2.7rem] text-[#ddd]">
          {article?.content}
        </p>
        
        <a 
          href={article?.url || '#'}
          target="_blank" 
          rel="noopener noreferrer"
          className="w-60 inline-block bg-gradient-to-r from-[#b88efc] to-[#6877f4] mt-8 py-4 px-8 text-white rounded-full text-xl text-center uppercase tracking-wider hover:transform hover:scale-105 active:translate-y-1 transition-all duration-200"
        >
          Read more
        </a>
      </div>
    </div>
  );
};

export default NewsModal;