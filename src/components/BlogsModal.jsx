import React, { useState, useEffect } from 'react';
import userImg from '../assets/images/user.jpg';

const BlogCreateModal = ({ show, onClose, onSubmit, editingBlog }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || '');
      setContent(editingBlog.content || '');
      setImage(editingBlog.image || '');
    }
  }, [editingBlog]);

  if (!show) {
    return null;
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = true;
    if (!content.trim()) newErrors.content = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const blogData = {
        id: editingBlog ? editingBlog.id : Date.now(),
        title: title.trim(),
        content: content.trim(),
        image: image || `https://picsum.photos/400/300?random=${Date.now()}`,
        createdAt: editingBlog ? editingBlog.createdAt : new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      onSubmit(blogData);
      setIsSubmitted(true);
      
      setTimeout(() => {
        resetForm();
        onClose();
        setIsSubmitted(false);
      }, 2000);
    }
  };

  const resetForm = () => {
    setTitle('');
    setContent('');
    setImage('');
    setImageFile(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="blogs">
        <div className="blogs-left">
          <img src={userImg} alt="User Profile" />
        </div>
        
        <div className="blogs-right">
          <button className="blogs-close-btn" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </button>

          {isSubmitted ? (
            <div className="flex flex-col items-center justify-center">
              <h1 className="submission-message">
                {editingBlog ? 'Updated!' : 'Published!'}
              </h1>
              <p className="text-white mt-4 text-center text-lg">
                Your blog post has been {editingBlog ? 'updated' : 'created'} successfully!
              </p>
            </div>
          ) : (
            <div className="blogs-right-form visible">
              <h1>{editingBlog ? 'Edit Blog Post' : 'Create Blog Post'}</h1>
              
              <form onSubmit={handleSubmit}>
                {/* Image Upload */}
                <label htmlFor="image-upload" className="file-upload">
                  <i className="fa-solid fa-image"></i>
                  <span>
                    {imageFile 
                      ? imageFile.name 
                      : image 
                      ? 'Change Image' 
                      : 'Upload Cover Image'
                    }
                  </span>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: 'none' }}
                  />
                </label>

                {/* Image Preview */}
                {image && (
                  <div className="image-preview">
                    <img src={image} alt="Preview" />
                  </div>
                )}

                {/* Title Input */}
                <input
                  type="text"
                  className={`title-input ${errors.title ? 'invalid' : ''}`}
                  placeholder="Enter your blog title..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  maxLength={100}
                />

                {/* Content Input */}
                <textarea
                  className={`text-input ${errors.content ? 'invalid' : ''}`}
                  placeholder="Share your thoughts and ideas..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />

                {/* Character Count */}
                <div className="text-sm text-gray-400 text-right -mt-2">
                  {content.length} characters
                </div>

                {/* Submit Button */}
                <button type="submit" className="submit-btn">
                  {editingBlog ? (
                    <>
                      <i className="fa-solid fa-pen mr-2"></i>
                      Update Blog Post
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane mr-2"></i>
                      Publish Blog Post
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogCreateModal;