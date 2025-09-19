import React, { useState, useEffect } from "react";

const BlogCreateModal = ({ show, onClose, onSubmit, editingBlog }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");

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
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const blogData = {
      id: editingBlog ? editingBlog.id : Date.now(),
      title: title.trim(),
      content: content.trim(),
      image: image || `https://picsum.photos/400/300?random=${Date.now()}`,
      createdAt: editingBlog ? editingBlog.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSubmit(blogData);
    setTitle("");
    setContent("");
    setImage("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[10000] p-5">
      <div className="bg-white rounded-lg p-8 w-full max-w-md max-h-[90vh] overflow-auto shadow-2xl">
        
        <div className="flex justify-between items-center mb-5">
          <h2 className="m-0 text-2xl text-gray-800 font-semibold">
            {editingBlog ? "Edit Blog" : "Create Blog"}
          </h2>
          <button
            onClick={onClose}
            className="bg-transparent border-none text-3xl cursor-pointer text-gray-500 p-1 rounded w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="mb-5">
            <label className="block mb-2 text-gray-800 font-medium text-sm">
              Cover Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-full p-2 border border-gray-300 rounded text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {image && (
              <img 
                src={image} 
                alt="Preview" 
                className="w-full h-36 object-cover mt-3 rounded border border-gray-300"
              />
            )}
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-gray-800 font-medium text-sm">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title..."
              required
              className="w-full p-3 border border-gray-300 rounded text-base outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <div className="mb-5">
            <label className="block mb-2 text-gray-800 font-medium text-sm">
              Content
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your blog content..."
              required
              rows={8}
              className="w-full p-3 border border-gray-300 rounded text-base resize-y outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-200 font-inherit"
            />
          </div>

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-5 border border-gray-300 rounded bg-gray-50 cursor-pointer text-base font-medium transition-all hover:bg-gray-200 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-3 px-5 border-none rounded bg-blue-600 text-white cursor-pointer text-base font-medium transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!title.trim() || !content.trim()}
            >
              {editingBlog ? "Update" : "Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BlogCreateModal;