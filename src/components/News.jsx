import React from "react";
import './News.css';
import userImg from '../assets/images/user.jpg';
import techImg from '../assets/images/tech.jpg';
import sportsImg from '../assets/images/sports.jpg';
import worldImg from '../assets/images/world.jpg';
import scienceImg from '../assets/images/science.jpg';
import nationImg from '../assets/images/nation.jpg';
import healthImg from '../assets/images/health.jpg';


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

           <nav class="categories">
                    <h1 class="nav-heading">Categories</h1>
                    <div class="nav-links">
                        <a href="#" class="nav-link"><i class="fa-solid fa-globe"></i> General</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-earth-americas"></i> World</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-chart-line"></i> Business</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-microchip"></i> Technology</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-film"></i>leisure</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-basketball"></i> Sport</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-flask"></i> Science</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-heart-pulse"></i> Health</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-flag"></i> Nation</a>
                        <a href="#" class="nav-link"><i class="fa-solid fa-bookmark"></i> Bookmark</a>

                    </div>
                   
                </nav>

       
        </div>

        <main className="news-section">
          <div className="headline">
            <img src={techImg} alt="headline image " />
            <h2 className="headline-title">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. 
              Repellat ratione ullam similique beatae eos quasi quam hic id.
              <i className="fa-regular fa-bookmark bookmark"></i>

            </h2>
            <img src="{ nationImg}" alt="" />
            <h2 className="headline-title">Breaking: Major News Event Happening Now</h2>
            <div className="bookmark">
              <i className="fa-regular fa-bookmark"></i>
            </div>
          </div>
          <div className="news-grid">
            <div className="news-grid-item">
              <img src="{sportsImg}" alt="" />
              <h3>Technology Update</h3>
            </div>
            {/* <div className="news-grid-item">
              <img src={businessImg} alt="News" />
              <h3>Business News</h3>
            </div> */}
            <div className="news-grid-item">
              <img src={sportsImg} alt="News" />
              <h3>Sports Update</h3>
            </div>
            <div className="news-grid-item">
              <img src={healthImg} alt="News" />
              <h3>Health News</h3>
            </div>
            <div className="news-grid-item">
              <img src={scienceImg} alt="News" />
              <h3>Science Discovery</h3>
            </div>
            <div className="news-grid-item">
              <img src={worldImg} alt="News" />
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