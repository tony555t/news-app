import React from "react";
import './News.css';

const News = () => {
  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & BlOGS</h1>
        <div className="search-bar">
          <Form>
            <input type="text" placeholder="Search News..." />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </Form>
        </div>
      </header>
      
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