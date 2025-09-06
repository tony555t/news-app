import React from 'react'
import './Modal.css'
import demoImg from '../assets/images/demo.jpg'
import './Bookmarks.css'

const Bookmarks = ({ show, bookmarks = [], onClose, onSelectArticle, onDeleteBookmark }) => {
    if (!show) {
        return null
    }

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>
                    <i className='fa-solid fa-xmark'></i>
                </span>
                <h2 className='bookmark-heading'>Bookmark News</h2>
                
                {bookmarks.length === 0 ? (
                    <div className="no-bookmarks">
                        <p>No bookmarked articles yet!</p>
                    </div>
                ) : (
                    <div className="bookmark-list">
                        {bookmarks.map((article, index) => (
                            <div 
                                className="bookmark-item" 
                                key={index} 
                                onClick={() => onSelectArticle && onSelectArticle(article)}
                            >
                                <img 
                                    src={article.image || demoImg} 
                                    alt={article.title || 'Article'} 
                                />
                                <h3>{article.title || 'Untitled'}</h3>
                                <span 
                                    className='delete-button' 
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteBookmark && onDeleteBookmark(article)
                                    }}
                                >
                                    <i className="fa-regular fa-circle-xmark"></i>
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default Bookmarks