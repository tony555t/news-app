import React from "react";
import './News.css';

const News = () => {
  return (
    <div className="news">
      <header className="news-header">News Header</header>
      
      <div className="news-content">
        <div className="navbar">
          <div className="user">User</div>
          <nav className="categories">Categories</nav>
        </div>
        
        <div className="news-section">
          <div className="heading">Headline</div>
          <div className="news-grid">News Grid</div>
        </div>
        
        <div className="my-blogs">My Blogs</div>
      </div>
      
      <footer className="news-footer">Footer</footer>
    </div>
  );
};

export default News;