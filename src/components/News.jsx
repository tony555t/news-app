import React, { useEffect, useState, useCallback } from "react";
import "./News.css";
import userImg from "../assets/images/user.jpg";
import NewsModal from "./NewsModal";
import Bookmarks from "./Bookmarks";
import BlogCreateModal from "./BlogCreateModal.jsx";
import BlogsModal from "./BlogsModal";
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
  const [error, setError] = useState(null);

  // Blog state variables
  const [blogs, setBlogs] = useState([]);
  const [showBlogCreateModal, setShowBlogCreateModal] = useState(false);
  const [showBlogModal, setShowBlogModal] = useState(false);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [editingBlog, setEditingBlog] = useState(null);

  const apiKey = "efa1b38a52ae4d789f762b532119276e";

  // Load bookmarks and blogs from localStorage on component mount
  useEffect(() => {
    const savedBookmarks = localStorage.getItem('bookmarks');
    if (savedBookmarks) {
      setBookmarks(JSON.parse(savedBookmarks));
    }

    const savedBlogs = localStorage.getItem('blogs');
    if (savedBlogs) {
      setBlogs(JSON.parse(savedBlogs));
    }
  }, []);

  // Blog functions
  const handleCreateBlog = (newBlog) => {
    const updatedBlogs = [newBlog, ...blogs];
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
  };

  const handleEditBlog = (blog) => {
    setEditingBlog(blog);
    setShowBlogCreateModal(true);
  };

  const handleUpdateBlog = (updatedBlog) => {
    const updatedBlogs = blogs.map(blog => 
      blog.id === updatedBlog.id ? updatedBlog : blog
    );
    setBlogs(updatedBlogs);
    localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    setEditingBlog(null);
  };

  const handleDeleteBlog = (blogId) => {
    if (window.confirm('Are you sure you want to delete this blog?')) {
      const updatedBlogs = blogs.filter(blog => blog.id !== blogId);
      setBlogs(updatedBlogs);
      localStorage.setItem('blogs', JSON.stringify(updatedBlogs));
    }
  };

  const handleBlogClick = (blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  };

  // Add rate limiting and caching
  const [lastFetchTime, setLastFetchTime] = useState({});
  const CACHE_DURATION = 5 * 60 * 1000;

  const fetchNews = useCallback(async (category = 'general') => {
  
    const cacheKey = `news_${category}`;
    const lastFetch = lastFetchTime[cacheKey];
    const now = Date.now();
    
    if (lastFetch && (now - lastFetch) < CACHE_DURATION) {
      console.log(`Using cached data for ${category}`);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
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
     
        setLastFetchTime(prev => ({
          ...prev,
          [cacheKey]: now
        }));
      } else {
        setNews([]);
        setHeadline("No news available");
      }
    } catch (error) {
      console.error(`Error fetching ${category} news:`, error);
      
      if (error.response) {
        if (error.response.status === 429) {
          setError("Rate limit exceeded. Please wait before making more requests.");
        } else if (error.response.status === 426) {
          setError("API key limit reached. Please upgrade your plan or try again tomorrow.");
        } else {
          setError(`API Error: ${error.response.status}`);
        }
      } else {
        setError("Network error. Please check your connection.");
      }
      
      setNews([]);
      setHeadline("Failed to load news");
    } finally {
      setLoading(false);
    }
  }, [apiKey, lastFetchTime]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;

    setLoading(true);
    setIsSearchMode(true);
    setSearchQuery(searchInput);
    setError(null);
    
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
        setError("Rate limit exceeded for search. Please wait before searching again.");
      } else {
        setError("Search failed. Please try again.");
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
    setError(null);
  };

  useEffect(() => {
    if (!isSearchMode && activeCategory !== 'bookmark') {
      fetchNews(activeCategory);
    } else if (activeCategory === 'bookmark') {
      setNews(bookmarks);
      setHeadline(bookmarks.length > 0 ? "Your Bookmarked Articles" : "No bookmarks yet");
      setLoading(false);
    }
  }, [activeCategory, isSearchMode, fetchNews]);

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
    e.stopPropagation();
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

  const handleImageError = (e) => {
    e.target.src = 'https://placehold.co/400x300/e2e8f0/64748b?text=No+Image';
  };

  const handleHeadlineImageError = (e) => {
    e.target.src = 'https://placehold.co/800x400/e2e8f0/64748b?text=No+Image';
  };

  if (loading) {
    return <div className="loading">Loading news...</div>;
  }

  if (error) {
    return (
      <div className="error">
        <h2>Error Loading News</h2>
        <p>{error}</p>
        <button onClick={() => window.location.reload()}>Retry</button>
      </div>
    );
  }

  if (news.length === 0 && activeCategory !== 'bookmark') {
    return (
      <div className="error">
        <h2>No News Available</h2>
        <p>Failed to load news. Please try again later.</p>
        <button onClick={() => fetchNews(activeCategory)}>Retry</button>
      </div>
    );
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
                className={`nav-link flex items-center gap-2 w-full whitespace-nowrap ${showBookmarksModal ? 'active' : ''}`}
                onClick={() => handleCategoryClick('bookmark')}
              >
                <i className="fa-solid fa-bookmark"></i> 
                BOOKMARK 
                <span className="text-purple-400">({bookmarks.length})</span>
              </button>
            </div>
          </nav>
        </div>

        <main className="news-section">
          {activeCategory === 'bookmark' && news.length === 0 ? (
            <div className="no-bookmarks">
              <h2>No bookmarked articles yet</h2>
              <p>Start bookmarking articles by clicking the bookmark icon on any news article!</p>
            </div>
          ) : (
            <>
            
              <div className="headline" onClick={() => handleArticleClick(news[0])}>
                {news[0] && (
                  <>
                    <img
                      src={news[0].image || "https://placehold.co/800x400/e2e8f0/64748b?text=No+Image"}
                      alt="Headline"
                      style={{cursor:"pointer"}}
                      onError={handleHeadlineImageError}
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

           
              <div className="news-grid">
                {news.slice(1, 10).map((item, index) => (
                  <div className="news-grid-item" key={index} onClick={() => handleArticleClick(item)}>
                    <img
                      src={item.image || "https://placehold.co/400x300/e2e8f0/64748b?text=No+Image"}
                      alt={item.title}
                      onError={handleImageError}
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

        {/* Blog Modals */}
        <BlogCreateModal
          show={showBlogCreateModal}
          onClose={() => {
            setShowBlogCreateModal(false);
            setEditingBlog(null);
          }}
          onSubmit={editingBlog ? handleUpdateBlog : handleCreateBlog}
          editingBlog={editingBlog}
        />

        <BlogsModal
          show={showBlogModal}
          blog={selectedBlog}
          onClose={() => {
            setShowBlogModal(false);
            setSelectedBlog(null);
          }}
        />

<div className="my-blogs">
  {/* Blog Section Header */}
  <div className="blog-section-header">
    <div className={`blog-header-content ${blogs.length > 0 ? 'with-stats' : ''}`}>
      <div className="blog-title-section">
        <h2>My Blogs</h2>
        <p className="blog-subtitle">Create and manage your personal blog posts</p>
      </div>
      
      <div className="blog-actions">
        <button 
          onClick={() => setShowBlogCreateModal(true)}
          className="create-blog-btn"
        >
          <i className="fa-solid fa-plus"></i>
          Create New Post
        </button>
      </div>
    </div>

    {/* Blog Statistics - Only show when there are blogs */}
    {blogs.length > 0 && (
      <div className="blog-stats">
        <div className="blog-stat-card">
          <div className="blog-stat-number">{blogs.length}</div>
          <div className="blog-stat-label">Posts</div>
        </div>
        <div className="blog-stat-card">
          <div className="blog-stat-number">
            {blogs.reduce((total, blog) => total + Math.round(blog.content.split(' ').length), 0)}
          </div>
          <div className="blog-stat-label">Words</div>
        </div>
        <div className="blog-stat-card">
          <div className="blog-stat-number">
            {new Date(Math.max(...blogs.map(blog => new Date(blog.createdAt)))).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            })}
          </div>
          <div className="blog-stat-label">Latest</div>
        </div>
      </div>
    )}
  </div>

  {/* Blog Posts Container */}
  <div className="blog-posts-container">
    {blogs.length === 0 ? (
      /* Empty State */
      <div className="empty-blog-state">
        <div className="empty-state-icon">📝</div>
        <h3 className="empty-state-title">No Blog Posts Yet!</h3>
        <p className="empty-state-message">
          Start sharing your thoughts and ideas with the world. Create your first blog post to get started.
        </p>
        <button 
          onClick={() => setShowBlogCreateModal(true)}
          className="create-first-post-btn"
        >
          <i className="fa-solid fa-pen-to-square"></i>
          Create Your First Post
        </button>
      </div>
    ) : (
      /* Blog Posts Grid */
      <div className="blog-posts">
        {blogs.map((blog) => (
          <div key={blog.id} className="blog-post">
            <img
              src={blog.image}
              alt={blog.title}
              onClick={() => handleBlogClick(blog)}
            />
            
            <div className="post-buttons">
              <button 
                onClick={() => handleEditBlog(blog)}
                className="edit-btn"
                title="Edit post"
              >
                <i className="fa-solid fa-pen"></i>
              </button>
              <button 
                onClick={() => handleDeleteBlog(blog.id)}
                className="delete-btn"
                title="Delete post"
              >
                <i className="fa-solid fa-trash"></i>
              </button>
            </div>
            
            <div className="blog-post-content">
              <h3 onClick={() => handleBlogClick(blog)}>
                {blog.title}
              </h3>
              <div className="blog-post-meta">
                <span className="blog-post-date">
                  {new Date(blog.createdAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric'
                  })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
</div>
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