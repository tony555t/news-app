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
                    className="text-5xl font-light text-gray-300 tracking-wider mb-8"
                    style={{ fontFamily: 'Bebas Neue, sans-serif' }}
                >
                    Bookmark News
                </h2>
                
                {bookmarks.length === 0 ? (
                    <div className="no-bookmarks">
                        <p>No bookmarked articles yet!</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        {bookmarks.map((article, index) => (
                            <div
                                className="flex items-center justify-center gap-8 cursor-pointer"
                                key={index}
                                onClick={() => onSelectArticle && onSelectArticle(article)}
                            >
                                <img
                                    src={article.image || demoImg}
                                    alt={article.title || 'Article'}
                                    className="w-28 h-28 object-cover rounded-xl mr-4"
                                />
                                
                                <h3 
                                    className="text-2xl font-bold text-white flex-1"
                                    style={{ fontFamily: 'Comfortaa, sans-serif' }}
                                >
                                    {article.title || 'Untitled'}
                                </h3>
                                
                                <span
                                    className="text-4xl text-purple-400 cursor-pointer hover:text-purple-300 transition-colors duration-200"
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