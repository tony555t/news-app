import React from 'react'
import './Modal.css'
import demoImg from '../assets/images/demo.jpg'
import './Bookmarks.css'
 
const Bookmark = ({ show, Bookmark, onClose, onselectArticle,onDeleteBookmark})=>{
    if(!show){
        return null
    }
    return(
        <div className="modal-overlay">
            <div className="modal-content">
                <span className="close-button">
                    <i className='fa-solid fa-xmark'></i>
                </span>
                <h2 className='bookmark-heading'>bookmark news</h2>
                <div className="bookmark-list">
                    
                </div>
            </div>
        </div>
    )
}



export default Bookmarks