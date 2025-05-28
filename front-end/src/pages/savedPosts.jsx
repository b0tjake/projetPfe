import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiBookmark, FiSearch, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { Link } from 'react-router-dom';

export default function SavedPosts() {
  const { darkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSavedPosts();
  }, []);

  const fetchSavedPosts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/posts/saved', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
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
      await axios.delete(`http://localhost:5000/api/posts/${postId}/unsave`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      // Remove the post from the saved posts list
      setSavedPosts(savedPosts.filter(post => post.id !== postId));
    } catch (error) {
      console.error('Error unsaving post:', error);
    }
  };

  const filteredPosts = savedPosts.filter(post =>
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex">
        <Sidebar />
        <div className="flex-1">
          <div className={`h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className={`p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} h-full`}>
              <div className="flex justify-between items-center mb-6">
                <h1 className={`text-2xl font-bold ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  Saved Posts
                </h1>
                <div className={`relative ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-100'
                } rounded-xl w-64`}>
                  <input
                    type="text"
                    placeholder="Search saved posts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full py-2 pl-10 pr-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'
                    }`}
                  />
                  <FiSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`} />
                </div>
              </div>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.length === 0 ? (
                    <div className={`col-span-full text-center py-12 ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <FiBookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium mb-2">No saved posts</p>
                      <p>Posts you save will appear here</p>
                    </div>
                  ) : (
                    filteredPosts.map((post) => (
                      <motion.div
                        key={post.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`rounded-xl overflow-hidden shadow-lg ${
                          darkMode ? 'bg-gray-700' : 'bg-white'
                        }`}
                      >
                        <Link to={`/post/${post.id}`}>
                          <img
                            src={`http://localhost:5000/${post.image}`}
                            alt={post.title}
                            className="w-full h-48 object-cover"
                          />
                        </Link>
                        <div className="p-4">
                          <Link to={`/post/${post.id}`}>
                            <h3 className={`font-semibold text-lg mb-2 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              {post.title}
                            </h3>
                          </Link>
                          <p className={`text-sm mb-4 line-clamp-2 ${
                            darkMode ? 'text-gray-300' : 'text-gray-600'
                          }`}>
                            {post.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-4">
                              <div className="flex items-center space-x-1">
                                <FiHeart className={`w-4 h-4 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {post.likes}
                                </span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <FiMessageSquare className={`w-4 h-4 ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`} />
                                <span className={`text-sm ${
                                  darkMode ? 'text-gray-400' : 'text-gray-500'
                                }`}>
                                  {post.comments}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleUnsavePost(post.id)}
                              className={`p-2 rounded-lg transition-colors ${
                                darkMode
                                  ? 'text-yellow-400 hover:bg-yellow-900/20'
                                  : 'text-yellow-500 hover:bg-yellow-50'
                              }`}
                            >
                              <FiBookmark className="w-5 h-5" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 