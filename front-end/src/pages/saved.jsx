import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiHeart, FiMessageSquare, FiBookmark, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/sideBar';

export default function Saved() {
  const { darkMode } = useContext(DarkModeContext);
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/posts/saved', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedPosts(response.data);
    } catch (error) {
      console.error('Error fetching saved posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnsavePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/posts/${postId}/unsave`, {}, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSavedPosts(savedPosts.filter(post => post._id !== postId));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen`}>
              <h1 className={`text-xl sm:text-2xl font-bold mb-4 sm:mb-6 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}>
                Saved Posts
              </h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {savedPosts.map((post) => (
                    <div
                      key={post._id}
                      className={`p-4 sm:p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      {/* Post Header */}
                      <div className="flex items-center space-x-3 mb-4">
                        <img
                          src={`http://localhost:5000/${post.user.image}`}
                          alt={post.user.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {post.user.fullname}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            @{post.user.username}
                          </p>
                        </div>
                      </div>

                      {/* Post Content */}
                      <p className={`mb-4 ${
                        darkMode ? 'text-gray-200' : 'text-gray-700'
                      }`}>
                        {post.content}
                      </p>

                      {/* Post Image */}
                      {post.image && (
                        <div className="mb-4">
                          <img
                            src={`http://localhost:5000/${post.image}`}
                            alt="Post"
                            className="w-full rounded-lg object-cover max-h-96"
                          />
                        </div>
                      )}

                      {/* Post Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-600">
                        <div className="flex items-center space-x-4">
                          <button className={`flex items-center space-x-1 ${
                            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}>
                            <FiHeart className="w-5 h-5" />
                            <span>{post.likes.length}</span>
                          </button>
                          <button className={`flex items-center space-x-1 ${
                            darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                          }`}>
                            <FiMessageSquare className="w-5 h-5" />
                            <span>{post.comments.length}</span>
                          </button>
                        </div>
                        <button
                          onClick={() => handleUnsavePost(post._id)}
                          className={`p-2 rounded-full ${
                            darkMode
                              ? 'text-red-400 hover:bg-red-900/50'
                              : 'text-red-500 hover:bg-red-50'
                          } transition-colors`}
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && savedPosts.length === 0 && (
                <div className={`text-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FiBookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No saved posts</p>
                  <p>Posts you save will appear here</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 