import React, { useEffect, useState } from "react";
import "./News.css";
import userImg from "../assets/images/user.jpg";
import NewsModal from "./NewsModal";
import Bookmarks from "./Bookmarks"; // Make sure this import exists
import axios from "axios";

const News = () => {
  const [headline, setHeadline] = useState(null);
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("general");
  const [searchInput, setSearchInput] = useState("");
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [showBookmarksModal, setShowBookmarksModal] = useState(false);

  const apiKey = "efa1b38a52ae4d789f762b532119276e";

  // Load bookmarks from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }
  }, []);

  const fetchNews = async (category = 'general') => {
    setLoading(true);
    try {
      // category mapping for NewsAPI
      const categoryMapping = {
        'general': 'general',
        'world': 'general', 
        'business': 'business',
        'technology': 'technology',
        'leisure': 'entertainment',
        'sport': 'sports',
        'science': 'science',
        'health': 'health',
        'nation': 'general'
      };

      // Map the display category to API category
      const apiCategory = categoryMapping[category];
      
      let url = `https://newsapi.org/v2/top-headlines?country=us&category=${apiCategory}&apiKey=${apiKey}&pageSize=10`;

      console.log(`Fetching ${category} news from URL:`, url);

      const { data } = await axios.get(url);

      if (data && data.articles && data.articles.length > 0) {
        const formattedArticles = data.articles.map(article => ({
          title: article.title,
          image: article.urlToImage,
          description: article.description,
          content: article.content,
          url: article.url,
          source: {
            name: article.source.name
          },
          publishedAt: article.publishedAt
        }));
        
        setHeadline(formattedArticles[0].title);
        setNews(formattedArticles);
      } else {
        setNews([]);
      }
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      
      // Check if it's a rate limit error
      if (error.response && error.response.status === 429) {
        console.log("Rate limit exceeded. Please wait before making more requests.");
        setNews([]);
        return;
      }
      
      setNews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setIsSearchMode(true);
    setSearchQuery(searchInput);
    
    try {
      const searchUrl = `https://newsapi.org/v2/everything?q=${encodeURIComponent(
        searchInput
      )}&language=en&sortBy=publishedAt&apiKey=${apiKey}&pageSize=10`;

      console.log(`Searching for: "${searchInput}"`);
      const { data } = await axios.get(searchUrl);
      
      if (data && data.articles && data.articles.length > 0) {
        const formattedArticles = data.articles.map((article) => ({
          title: article.title,
          image: article.urlToImage,
          description: article.description,
          content: article.content,
          url: article.url,
          source: {
            name: article.source.name
          },
          publishedAt: article.publishedAt,
        }));

        setHeadline(formattedArticles[0].title);
        setNews(formattedArticles);
        setActiveCategory("search");
      } else {
        setNews([]);
        setHeadline(`No results found for "${searchInput}"`);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
      if (error.response && error.response.status === 429) {
        console.log("Rate limit exceeded for search. Please wait before searching again.");
      }
      setNews([]);
      setHeadline(`Search failed for "${searchInput}"`);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    setIsSearchMode(false);
    setSearchQuery("");
    setActiveCategory("general");
  };

  // Handle category changes and bookmark viewing
  useEffect(() => {
    if (!isSearchMode && activeCategory !== 'bookmark') {
      fetchNews(activeCategory);
    } else if (activeCategory === 'bookmark') {
      setNews(bookmarks);
      setHeadline(bookmarks.length > 0 ? "Your Bookmarked Articles" : "No bookmarks yet");
      setLoading(false);
    }
  }, [activeCategory, isSearchMode, bookmarks]);

  // Handle category click
  const handleCategoryClick = (category) => {
    if (isSearchMode) {
      clearSearch();
    }
    
    if (category === 'bookmark') {
      setShowBookmarksModal(true);
    } else {
      setActiveCategory(category);
    }
  };

  const handleArticleClick = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const handleBookmarkClick = (e, article) => {
    e.stopPropagation(); // Prevent triggering article click
    setBookmarks((prevBookmarks) => {
      const isBookmarked = prevBookmarks.find((bookmark) => bookmark.title === article.title);
      const updatedBookmarks = isBookmarked
        ? prevBookmarks.filter((bookmark) => bookmark.title !== article.title)
        : [...prevBookmarks, article];
      
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  const handleDeleteBookmark = (article) => {
    setBookmarks((prevBookmarks) => {
      const updatedBookmarks = prevBookmarks.filter((bookmark) => bookmark.title !== article.title);
      localStorage.setItem('bookmarks', JSON.stringify(updatedBookmarks));
      return updatedBookmarks;
    });
  };

  const isBookmarked = (article) => {
    return bookmarks.some((bookmark) => bookmark.title === article.title);
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  if (news.length === 0 && activeCategory !== 'bookmark') {
    return <div className="error">Failed to load news. Please try again later.</div>;
  }

  return (
    <div className="news">
      <header className="news-header">
        <h1 className="logo">News & Blogs</h1>
        <div className="search-bar">
          <form onSubmit={handleSearch}>
            <input 
              type="text" 
              placeholder="Search News..." 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            <button type="submit">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            {isSearchMode && (
              <button type="button" onClick={clearSearch} className="clear-search-btn">
                <i className="fa-solid fa-times"></i>
              </button>
            )}
          </form>
        </div>
        {isSearchMode && (
          <div className="search-info">
            <p>Search results for: "<strong>{searchQuery}</strong>"</p>
          </div>
        )}
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
                className={`nav-link ${activeCategory === 'general' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('general')}
              >
                <i className="fa-solid fa-globe"></i> General
              </button>
              <button 
                className={`nav-link ${activeCategory === 'world' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('world')}
              >
                <i className="fa-solid fa-earth-americas"></i> World
              </button>
              <button 
                className={`nav-link ${activeCategory === 'business' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('business')}
              >
                <i className="fa-solid fa-chart-line"></i> Business
              </button>
              <button 
                className={`nav-link ${activeCategory === 'technology' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('technology')}
              >
                <i className="fa-solid fa-microchip"></i> Tech
              </button>
              <button 
                className={`nav-link ${activeCategory === 'leisure' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('leisure')}
              >
                <i className="fa-solid fa-film"></i> Leisure
              </button>
              <button 
                className={`nav-link ${activeCategory === 'sport' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('sport')}
              >
                <i className="fa-solid fa-basketball"></i> Sport
              </button>
              <button 
                className={`nav-link ${activeCategory === 'science' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('science')}
              >
                <i className="fa-solid fa-flask"></i> Science
              </button>
              <button 
                className={`nav-link ${activeCategory === 'health' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('health')}
              >
                <i className="fa-solid fa-heart-pulse"></i> Health
              </button>
              <button 
                className={`nav-link ${activeCategory === 'nation' && !isSearchMode ? 'active' : ''}`}
                onClick={() => handleCategoryClick('nation')}
              >
                <i className="fa-solid fa-flag"></i> Nation
              </button>
              <button 
                className={`nav-link ${showBookmarksModal ? 'active' : ''}`}
                onClick={() => handleCategoryClick('bookmark')}
              >
                <i className="fa-solid fa-bookmark"></i> Bookmark ({bookmarks.length})
              </button>
            </div>
          </nav>
        </div>

        <main className="news-section">
          {/* Show message for empty bookmarks */}
          {activeCategory === 'bookmark' && news.length === 0 ? (
            <div className="no-bookmarks">
              <h2>No bookmarked articles yet</h2>
              <p>Start bookmarking articles by clicking the bookmark icon on any news article!</p>
            </div>
          ) : (
            <>
              {/* HEADLINE */}
              <div className="headline" onClick={() => handleArticleClick(news[0])}>
                {news[0] && (
                  <>
                    <img
                      src={news[0].image || "https://via.placeholder.com/800"}
                      alt="Headline"
                      style={{cursor:"pointer"}}
                    />
                    <div 
                      className="bookmark-icon"
                      onClick={(e) => handleBookmarkClick(e, news[0])}
                    >
                      <i className={`fa${isBookmarked(news[0]) ? 's' : 'r'} fa-bookmark`}></i>
                    </div>
                    <h2 className="headline-title" style={{cursor:'pointer'}}>{headline}</h2>
                  </>
                )}
              </div>

              {/* News Grid */}
              <div className="news-grid">
                {news.slice(1, 10).map((item, index) => (
                  <div className="news-grid-item" key={index} onClick={() => handleArticleClick(item)}>
                    <img
                      src={item.image || "https://via.placeholder.com/400"}
                      alt={item.title}
                    />
                    <div 
                      className="bookmark-icon"
                      onClick={(e) => handleBookmarkClick(e, item)}
                    >
                      <i className={`fa${isBookmarked(item) ? 's' : 'r'} fa-bookmark`}></i>
                    </div>
                    <h3>{item.title}</h3>
                  </div>
                ))}
              </div>
            </>
          )}
        </main>

        {/* Modals */}
        <NewsModal 
          show={showModal} 
          article={selectedArticle}
          onClose={() => setShowModal(false)} 
        />

        <Bookmarks
          show={showBookmarksModal}
          bookmarks={bookmarks}
          onClose={() => setShowBookmarksModal(false)}
          onSelectArticle={(article) => {
            setShowBookmarksModal(false);
            handleArticleClick(article);
          }}
          onDeleteBookmark={handleDeleteBookmark}
        />

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