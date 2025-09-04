import React from "react";
import demoImg from '../assets/images/demo.jpg';

const NewsModal = () => {
  return <div className="modal-overlay">
    <div className="modal-content">
    <span className="close-button">
      <i className="fa-solid fa-xmark"></i>
    </span>
    <img src={demoImg}alt="demo" className="modal-image "/>
    <h2 className="modal-title">lorem ipsum dolor</h2>
    <p className="modal-source"> source:the guardian</p>
    <p className="modal-date">jun 24,2024, 04:15</p>
    <p className="modal-content-text"></p>
    <a href="" className="read-more-link">read more</a>
  </div>
  </div>
}

export default NewsModal