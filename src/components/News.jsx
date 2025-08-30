import React, { useEffect, useState } from "react";
import "./News.css";
import userImg from "../assets/images/user.jpg";
import axios from "axios";

const News = () => {
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('general'); // Track active category

  // Move fetchNews outside useEffect so it can be called from category clicks
  const fetchNews = async (category = 'general') => {
    setLoading(true);
    try {
      const apiKey = "b8a8d6918f0d2d580ad338bf7409299a";
      
      // Complete category mapping for GNews API
      const categoryMapping = {
        'general': 'general',
        'world': 'world', 
        'business': 'business',
        'technology': 'technology',
        'leisure': 'entertainment',
        'sport': 'sports',
        'science': 'science',
        'health': 'health',
        'nation': 'nation'
      };

      // Map the display category to API category
      const apiCategory = categoryMapping[category];
      
      let url;
      
      if (!apiCategory) {
        // For categories not supported by API (like bookmark), use general
        url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&max=10`;
      } else if (apiCategory === 'general') {
        // For general category, don't specify category parameter
        url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&max=10`;
      } else {
        // For specific categories
        url = `https://gnews.io/api/v4/top-headlines?token=${apiKey}&lang=en&country=us&category=${apiCategory}&max=10`;
      }

      console.log(`Fetching ${category} news from URL:`, url);

      const { data } = await axios.get(url);

      if (data && data.articles && data.articles.length > 0) {
        const formattedArticles = data.articles.map(article => ({
          title: article.title,
          image_url: article.image,
          description: article.description,
          url: article.url,
          source: article.source.name,
          publishedAt: article.publishedAt
        }));
        
        setHeadline(formattedArticles[0].title);
        setNews(formattedArticles);
      } else {
        // If no articles found, try alternative approach
        console.log(`No ${category} articles found, trying search approach...`);
        
        // Alternative: Use search API for categories that might not work with top-headlines
        const searchUrl = `https://gnews.io/api/v4/search?token=${apiKey}&q=${category}&lang=en&country=us&max=10`;
        
        const searchResponse = await axios.get(searchUrl);
        
        if (searchResponse.data && searchResponse.data.articles && searchResponse.data.articles.length > 0) {
          const formattedArticles = searchResponse.data.articles.map(article => ({
            title: article.title,
            image_url: article.image,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
          }));
          
          setHeadline(formattedArticles[0].title);
          setNews(formattedArticles);
        } else {
          setNews([]);
        }
      }
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      
      // If category-specific request fails, try search as fallback
      try {
        console.log(`Trying search fallback for ${category}...`);
        const fallbackUrl = `https://gnews.io/api/v4/search?token=${apiKey}&q=${category}&lang=en&max=10`;
        const fallbackResponse = await axios.get(fallbackUrl);
        
        if (fallbackResponse.data && fallbackResponse.data.articles && fallbackResponse.data.articles.length > 0) {
          const formattedArticles = fallbackResponse.data.articles.map(article => ({
            title: article.title,
            image_url: article.image,
            description: article.description,
            url: article.url,
            source: article.source.name,
            publishedAt: article.publishedAt
          }));
          
          setHeadline(formattedArticles[0].title);
          setNews(formattedArticles);
        } else {
          setNews([]);
        }
      } catch (fallbackError) {
        console.error(`Fallback search also failed for ${category}:`, fallbackError);
        setNews([]);
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle category click
  const handleCategoryClick = (category) => {
    setActiveCategory(category);
    fetchNews(category);
  };

  useEffect(() => {
    fetchNews('general'); // Load general news on initial mount
  }, []);

  if (loading) {
    return <p>Loading news...</p>;
  }

  if (news.length === 0) {
    return <p>Failed to load news. Please try again later.</p>;
  }

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
            <img src={userImg} alt="User" />
            <p>Mary's Blog</p>
          </div>

          <nav className="categories">
            <h1 className="nav-heading">Categories</h1>
            <div className="nav-links">
              <button 
                className={`nav-link ${activeCategory === 'general' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('general')}
              >
                <i className="fa-solid fa-globe"></i> General
              </button>
              <button 
                className={`nav-link ${activeCategory === 'world' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('world')}
              >
                <i className="fa-solid fa-earth-americas"></i> World
              </button>
              <button 
                className={`nav-link ${activeCategory === 'business' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('business')}
              >
                <i className="fa-solid fa-chart-line"></i> Business
              </button>
              <button 
                className={`nav-link ${activeCategory === 'technology' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('technology')}
              >
                <i className="fa-solid fa-microchip"></i> Tech
              </button>
              <button 
                className={`nav-link ${activeCategory === 'leisure' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('leisure')}
              >
                <i className="fa-solid fa-film"></i> Leisure
              </button>
              <button 
                className={`nav-link ${activeCategory === 'sport' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('sport')}
              >
                <i className="fa-solid fa-basketball"></i> Sport
              </button>
              <button 
                className={`nav-link ${activeCategory === 'science' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('science')}
              >
                <i className="fa-solid fa-flask"></i> Science
              </button>
              <button 
                className={`nav-link ${activeCategory === 'health' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('health')}
              >
                <i className="fa-solid fa-heart-pulse"></i> Health
              </button>
              <button 
                className={`nav-link ${activeCategory === 'nation' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('nation')}
              >
                <i className="fa-solid fa-flag"></i> Nation
              </button>
              <button 
                className={`nav-link ${activeCategory === 'bookmark' ? 'active' : ''}`}
                onClick={() => handleCategoryClick('bookmark')}
              >
                <i className="fa-solid fa-bookmark"></i> Bookmark
              </button>
            </div>
          </nav>
        </div>

        <main className="news-section">
          {/* HEADLINE  */}
          <div className="headline">
            {news[0] && (
              <>
                <img
                  src={news[0].image_url || "https://via.placeholder.com/800"}
                  alt="Headline"
                />
                <div className="bookmark-icon">
                  <i className="far fa-bookmark"></i>
                </div>
                <h2 className="headline-title">{headline}</h2>
              </>
            )}
          </div>

          {/* News Grid  */}
          <div className="news-grid">
            {news.slice(1,10).map((item, index) => {
              console.log(`Rendering grid item ${index}:`, item);
              return (
                <div className="news-grid-item" key={index}>
                  <img
                    src={item.image_url || "https://via.placeholder.com/400"}
                    alt={item.title}
                  />
                  <div className="bookmark-icon">
                    <i className="far fa-bookmark"></i>
                  </div>
                  <h3>{item.title}</h3>
                </div>
              );
            })}
          </div>
        </main>

        {/* My Blogs Section (Static) */}
        <section className="my-blogs">
          <h2 className="my-blogs-heading">My Blogs</h2>
          <div className="blog-posts">
            <article className="blog-post">
              <img
                src="https://images.unsplash.com/photo-1432821596592-e2c18b78144f?w=400"
                alt="Blog Post"
              />
              <h3>My Latest Thoughts</h3>
              <div className="post-buttons">
                <button>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </article>

            <article className="blog-post">
              <img
                src="https://images.unsplash.com/photo-1486312338219-ce68e2c6b7dd?w=400"
                alt="Blog Post"
              />
              <h3>Tech Review</h3>
              <div className="post-buttons">
                <button>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </article>

            <article className="blog-post">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400"
                alt="Blog Post"
              />
              <h3>Travel Stories</h3>
              <div className="post-buttons">
                <button>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </article>

            <article className="blog-post">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400"
                alt="Blog Post"
              />
              <h3>Food Adventures</h3>
              <div className="post-buttons">
                <button>
                  <i className="fa-solid fa-pen"></i>
                </button>
                <button>
                  <i className="fa-solid fa-trash"></i>
                </button>
              </div>
            </article>
          </div>
        </section>
      </div>

      <footer className="news-footer">
        <p>
          © 2025 <span>News & Blogs</span> Platform
        </p>
        <p>Stay Connected & Informed</p>
      </footer>
    </div>
  );
};

export default News;