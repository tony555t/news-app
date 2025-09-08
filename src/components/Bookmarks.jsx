import React from 'react'
import './Modal.css'
import demoImg from '../assets/images/demo.jpg'

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
                
                <h2 
                    className="bookmarks-heading"
                    style={{
                        fontFamily: 'Bebas Neue, sans-serif',
                        fontSize: '3rem',
                        fontWeight: 300,
                        color: '#ddd',
                        letterSpacing: '0.1rem',
                        marginBottom: '2rem'
                    }}
                >
                    Bookmark News
                </h2>
                
                {bookmarks.length === 0 ? (
                    <div className="no-bookmarks">
                        <p>No bookmarked articles yet!</p>
                    </div>
                ) : (
                    <div 
                        className="bookmarks-list"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem'
                        }}
                    >
                        {bookmarks.map((article, index) => (
                            <div
                                className="bookmark-item"
                                key={index}
                                onClick={() => onSelectArticle && onSelectArticle(article)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'flex-start',
                                    gap: '1.5rem',
                                    cursor: 'pointer',
                                    padding: '1rem',
                                    borderRadius: '0.8rem',
                                    transition: 'background-color 0.2s ease',
                                    width: '100%'
                                }}
                                onMouseEnter={(e) => {
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
                                }}
                                onMouseLeave={(e) => {
                                    e.target.style.backgroundColor = 'transparent'
                                }}
                            >
                                <img
                                    src={article.image || demoImg}
                                    alt={article.title || 'Article'}
                                    style={{
                                        width: '7rem',
                                        height: '7rem',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        flexShrink: 0,
                                        margin: 0
                                    }}
                                />
                                
                                <h3
                                    style={{
                                        fontFamily: 'Comfortaa, sans-serif',
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold',
                                        color: '#fff',
                                        flex: 1,
                                        margin: 0,
                                        lineHeight: 1.4,
                                        textAlign: 'left'
                                    }}
                                >
                                    {article.title || 'Untitled'}
                                </h3>
                                
                                <span
                                    className="delete-button"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onDeleteBookmark && onDeleteBookmark(article)
                                    }}
                                    style={{
                                        fontSize: '2.4rem',
                                        color: '#b88efc',
                                        cursor: 'pointer',
                                        flexShrink: 0,
                                        padding: '0.5rem',
                                        borderRadius: '50%',
                                        transition: 'color 0.2s ease, background-color 0.2s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.target.style.color = '#a078f0'
                                        e.target.style.backgroundColor = 'rgba(184, 142, 252, 0.1)'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.target.style.color = '#b88efc'
                                        e.target.style.backgroundColor = 'transparent'
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