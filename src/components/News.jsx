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
  const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

  const fetchNews = useCallback(async (category = 'general') => {
    // Check cache to prevent excessive API calls
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
        
        // Update cache timestamp
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

  // Fixed useEffect with proper dependencies
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

  // Improved image error handling
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
              {/* HEADLINE */}
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

              {/* News Grid */}
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

        {/* My Blogs Section - Now Dynamic */}
        {/* My Blogs Section - Professional Tailwind Design */}
<section className="pt-8 mt-16 border-t border-white/10">
  
  {/* Blog Header */}
  <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-10 pb-4 border-b border-purple-400/20">
    <div className="mb-6 md:mb-0">
      <h2 className="text-4xl font-light text-white tracking-wide font-['Bebas_Neue'] mb-2">
        My Blogs
      </h2>
      <p className="text-gray-400 text-lg">
        Create and manage your personal blog posts
      </p>
    </div>
    <button 
      onClick={() => setShowBlogCreateModal(true)}
      className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 px-6 py-3 rounded-xl text-white font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-500/25 flex items-center gap-2 w-fit"
    >
      <i className="fa-solid fa-plus"></i>
      Create New Post
    </button>
  </div>

  {/* Blog Stats */}
  {blogs.length > 0 && (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
        <div className="text-3xl font-bold text-purple-400 mb-2">
          {blogs.length}
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-wider">
          Posts
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
        <div className="text-3xl font-bold text-purple-400 mb-2">
          {blogs.reduce((total, blog) => total + Math.round(blog.content.split(' ').length), 0)}
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-wider">
          Words
        </div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 text-center hover:bg-white/10 transition-all duration-300">
        <div className="text-3xl font-bold text-purple-400 mb-2">
          {new Date(Math.max(...blogs.map(blog => new Date(blog.createdAt)))).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
        </div>
        <div className="text-sm text-gray-400 uppercase tracking-wider">
          Latest
        </div>
      </div>
    </div>
  )}
  
  {/* Blog Content */}
  {blogs.length === 0 ? (
    <div className="text-center py-16 px-8 bg-white/5 backdrop-blur-sm border-2 border-dashed border-purple-400/30 rounded-3xl">
      <div className="max-w-md mx-auto">
        <div className="w-20 h-20 bg-purple-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <i className="fa-solid fa-pen-to-square text-3xl text-purple-400"></i>
        </div>
        <h3 className="text-2xl font-semibold text-white mb-4">
          No blog posts yet!
        </h3>
        <p className="text-gray-400 text-lg mb-8 leading-relaxed">
          Start sharing your thoughts and ideas with the world. Create your first blog post to get started.
        </p>
        <button 
          onClick={() => setShowBlogCreateModal(true)}
          className="bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 px-8 py-4 rounded-2xl text-white font-semibold transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/25 inline-flex items-center gap-3"
        >
          <i className="fa-solid fa-pen-to-square"></i>
          Create Your First Post
        </button>
      </div>
    </div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {blogs.map((blog) => (
        <article 
          key={blog.id} 
          className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-purple-400/30 hover:-translate-y-2 transition-all duration-300 hover:shadow-2xl hover:shadow-black/20 group"
        >
          <div className="relative overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              onClick={() => handleBlogClick(blog)}
              className="w-full h-48 object-cover cursor-pointer group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          <div className="p-6">
            <h3 
              onClick={() => handleBlogClick(blog)}
              className="text-xl font-semibold text-white mb-4 cursor-pointer hover:text-purple-400 transition-colors duration-300 line-clamp-2 leading-tight font-['Comfortaa']"
            >
              {blog.title}
            </h3>
            
            <div className="flex justify-between items-center pt-4 border-t border-white/10">
              <span className="text-sm text-gray-400">
                {new Date(blog.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => handleEditBlog(blog)}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-green-400/20 text-gray-400 hover:text-green-400 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center group"
                  title="Edit post"
                >
                  <i className="fa-solid fa-pen text-sm"></i>
                </button>
                <button 
                  onClick={() => handleDeleteBlog(blog.id)}
                  className="w-9 h-9 rounded-lg bg-white/5 hover:bg-red-400/20 text-gray-400 hover:text-red-400 transition-all duration-300 hover:-translate-y-1 flex items-center justify-center group"
                  title="Delete post"
                >
                  <i className="fa-solid fa-trash text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  )}
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