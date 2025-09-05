import React from "react";
// import demoImg from '../assets/images/demo.jpg';
import './NewsModal.css'
import './Modal.css'

const NewsModal = ({show, article, onClose}) => {
  if(!show){
    return null;
  }

  return( 
    <div className="modal-overlay">
      <div className="modal-content">
        <span className="close-button" onClick={onClose}>
          <i className="fa-solid fa-xmark"></i>
        </span>
        <img src={article?.image || 'default-image.jpg'} alt="demo" className="modal-image" />
        <h2 className="modal-title">{article?.title}</h2>
        <p className="modal-source">{article?.source?.name}</p>
        <p className="modal-date">
          {article?.publishedAt ? new Date(article.publishedAt).toLocaleString('en-US',{
            month:'short',
            day:'2-digit',
            year:'numeric',
            hour:'2-digit',
            minute:'2-digit'
          }) : ''}
        </p>
        <p className="modal-content-text">{article?.content}</p>
        <a href={article?.url || '#'}
          target="_blank" 
          rel="noopener noreferrer"
          className="read-more-link">
          read more
        </a>
      </div>
    </div>
  )
}

export default NewsModal;