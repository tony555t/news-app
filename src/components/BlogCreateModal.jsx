import React, { useState, useEffect } from "react";
import userImg from "../assets/images/user.jpg";

const BlogCreateModal = ({ show, onClose, onSubmit, editingBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (editingBlog) {
      setTitle(editingBlog.title || "");
      setContent(editingBlog.content || "");
      setImage(editingBlog.image || "");
    }
  }, [editingBlog]);

  if (!show) return null;

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!title.trim()) newErrors.title = "Title is required";
    if (!content.trim()) newErrors.content = "Content is required";
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
    setTitle("");
    setContent("");
    setImage("");
    setImageFile(null);
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-80">
      <div className="w-full max-w-6xl max-h-screen overflow-auto bg-gray-900 rounded-3xl shadow-2xl">
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center text-gray-300 hover:text-white transition-all duration-300"
        >
          <i className="fa-solid fa-xmark text-xl"></i>
        </button>

        {isSubmitted ? (
          <div className="flex flex-col items-center justify-center h-96 text-center p-8">
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mb-6">
              <i className="fa-solid fa-check text-3xl text-white"></i>
            </div>
            <h1 className="text-5xl font-bold text-white mb-4">
              {editingBlog ? "Updated!" : "Published!"}
            </h1>
            <p className="text-gray-300 text-xl">
              Your blog post has been {editingBlog ? "updated" : "created"} successfully!
            </p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row min-h-96">
            
            {/* Left Side - Profile */}
            <div className="lg:w-2/5 bg-gradient-to-br from-purple-600 to-blue-600 flex items-center justify-center p-8 relative">
              <div className="absolute inset-0 bg-black opacity-20"></div>
              <div className="relative z-10 text-center">
                <img
                  src={userImg}
                  alt="User Profile"
                  className="w-40 h-40 rounded-full border-4 border-white shadow-xl mx-auto mb-4"
                />
                <h2 className="text-2xl font-bold text-white">Mary's Blog</h2>
                <p className="text-purple-100">Share your thoughts with the world</p>
              </div>
            </div>

            {/* Right Side - Form */}
            <div className="lg:w-3/5 p-8 lg:p-12">
              <h1 className="text-4xl font-bold text-white text-center mb-8">
                {editingBlog ? "Edit Your Blog" : "Create New Blog"}
              </h1>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Image Upload */}
                <div className="space-y-4">
                  <label
                    htmlFor="image-upload"
                    className="block w-full p-8 border-2 border-dashed border-purple-400 rounded-2xl cursor-pointer hover:border-purple-300 hover:bg-purple-900 hover:bg-opacity-10 transition-all duration-300"
                  >
                    <div className="text-center">
                      <i className="fa-solid fa-image text-4xl text-purple-400 mb-4"></i>
                      <p className="text-purple-300 font-semibold text-lg">
                        {imageFile
                          ? imageFile.name
                          : image
                          ? "Change Cover Image"
                          : "Upload Cover Image"}
                      </p>
                      <p className="text-gray-400 text-sm mt-2">Click to browse files</p>
                    </div>
                  </label>
                  <input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>

                {/* Image Preview */}
                {image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border-4 border-purple-400 shadow-lg">
                    <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}

                {/* Title Input */}
                <div>
                  <input
                    type="text"
                    className={`w-full px-6 py-4 bg-gray-800 border-2 rounded-2xl text-white text-lg placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-750 transition-all duration-300 ${
                      errors.title ? "border-red-400 bg-red-900 bg-opacity-20" : "border-gray-600"
                    }`}
                    placeholder="Enter your blog title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    maxLength={100}
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-2 ml-2">{errors.title}</p>
                  )}
                </div>

                {/* Content Input */}
                <div>
                  <textarea
                    className={`w-full px-6 py-4 bg-gray-800 border-2 rounded-2xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:bg-gray-750 resize-none transition-all duration-300 ${
                      errors.content ? "border-red-400 bg-red-900 bg-opacity-20" : "border-gray-600"
                    }`}
                    placeholder="Share your thoughts and ideas..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    rows={8}
                  />
                  {errors.content && (
                    <p className="text-red-400 text-sm mt-2 ml-2">{errors.content}</p>
                  )}
                  <div className="text-gray-400 text-sm text-right mt-2">
                    {content.length} characters
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 rounded-2xl text-white font-bold text-lg transition-all duration-300 shadow-lg hover:shadow-2xl hover:shadow-purple-500 hover:shadow-opacity-50 transform hover:scale-105 flex items-center justify-center gap-3"
                >
                  {editingBlog ? (
                    <>
                      <i className="fa-solid fa-pen"></i>
                      Update Blog Post
                    </>
                  ) : (
                    <>
                      <i className="fa-solid fa-paper-plane"></i>
                      Publish Blog Post
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogCreateModal;