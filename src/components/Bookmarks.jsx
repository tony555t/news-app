import React from 'react'
import './Modal.css'
import demoImg from '../assets/images/demo.jpg'
import './Bookmarks.css'
 
const Bookmark = ({ show, Bookmark, onClose, onSelectArticle, onDeleteBookmark}) => {
    if(!show){
        return null
    }
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button" onClick={onClose}>
                    <i className='fa-solid fa-xmark'></i>
                </span>
                <h2 className='bookmark-heading'>bookmark news</h2>
                <div className="bookmark-list">
                    {Bookmark.map((article,index)=>(
                        <div className="bookmark-item" key={index} onClick={() => onSelectArticle(article)}>
                            <img src={article.image || demoImg} alt={article.title} />
                            <h3>{article.title}</h3>
                            <span className='delete-button' onClick={(e)=>{
                                e.stopPropagation()
                                onDeleteBookmark(article)
                            }}>
                                <i className="fa-regular fa-circle-xmark"></i>
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Bookmark