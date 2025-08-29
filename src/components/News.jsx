import React from "react";
import './News.css';
import userImg from '../assets/images/user.jpg';

const News = () => {
  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <div className="search-bar">
          <form>
            <input type="text" placeholder="Search News..." />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
          </form>
        </div> 
      </header>

      <div className="news-content">
        <div className="navbar">
          <div className="user">
            <img src={userImg} alt="User Image" />
            <p>Mary's Blog</p>
          </div>

          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              <a href="#" className="nav-link"><i className="fa-solid fa-globe"></i> General</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-earth-americas"></i> World</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-chart-line"></i> Business</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-microchip"></i> Technology</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-film"></i> Leisure</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-basketball"></i> Sport</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-flask"></i> Science</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-heart-pulse"></i> Health</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-flag"></i> Nation</a>
              <a href="#" className="nav-link"><i className="fa-solid fa-bookmark"></i> Bookmark</a>
            </div>
          </nav>
        </div>

        <main className="news-section">
          <div className="headline">
            <img src="https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800" alt="Headline" />
            <h2 className="headline-title">Breaking: Major News Event Happening Now</h2>
            <div className="bookmark">
              <i className="fa-regular fa-bookmark"></i>
            </div>
          </div>
          
          <div className="news-grid">
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1495020689067-958852a7765e?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>Technology Update</h3>
            </div>
            
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>Business News</h3>
            </div>
            
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1546198632-9ef6368bef12?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>Sports Update</h3>
            </div>
            
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>Health News</h3>
            </div>
            
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>Science Discovery</h3>
            </div>
            
            <div className="news-grid-item">
              <img src="https://images.unsplash.com/photo-1444653389962-8149286c578a?w=400" alt="News" />
              <div className="bookmark-icon">
                <i className="far fa-bookmark"></i>
              </div>
              <h3>World Events</h3>
            </div>
          </div>
        </main>

        <section className="my-blogs">
          <h2 className="my-blogs-heading">My Blogs</h2>
          <div className="blog-posts">
            <article className="blog-post">
              <img src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400" alt="Blog Post" />
              <h3>My Latest Thoughts</h3>
              <div className="post-buttons">
                <button><i className="fa-solid fa-pen"></i></button>
                <button><i className="fa-solid fa-trash"></i></button>
              </div>
            </article>
            
            <article className="blog-post">
              <img src="https://images.unsplash.com/photo-1486312338219-ce68e2c6b7dd?w=400" alt="Blog Post" />
              <h3>Tech Review</h3>
              <div className="post-buttons">
                <button><i className="fa-solid fa-pen"></i></button>
                <button><i className="fa-solid fa-trash"></i></button>
              </div>
            </article>
            
            <article className="blog-post">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400" alt="Blog Post" />
              <h3>Travel Stories</h3>
              <div className="post-buttons">
                <button><i className="fa-solid fa-pen"></i></button>
                <button><i className="fa-solid fa-trash"></i></button>
              </div>
            </article>
            
            <article className="blog-post">
              <img src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400" alt="Blog Post" />
              <h3>Food Adventures</h3>
              <div className="post-buttons">
                <button><i className="fa-solid fa-pen"></i></button>
                <button><i className="fa-solid fa-trash"></i></button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <footer className="news-footer">
        <p>© 2025 <span>News & Blogs</span> Platform</p>
        <p>Stay Connected & Informed</p>
      </footer>
    </div>
  );
};

export default News;