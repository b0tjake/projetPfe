import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiBookmark, FiSearch, FiMessageSquare, FiHeart } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { Link } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

export default function SavedPosts() {
  const { darkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [userId, setUserId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to view saved posts');
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setUserId(decodedToken.id);
    } catch (error) {
      console.error('Error decoding token:', error);
      setError('Invalid token. Please log in again.');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchSavedPosts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Please log in to view saved posts');
          navigate('/login');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/posts/saved', {
          headers: {
            Authorization: `Bearer ${token}`,
          }
        });

        if (response.data && Array.isArray(response.data)) {
          setSavedPosts(response.data);
        } else {
          setSavedPosts([]);
        }
        setError('');
      } catch (error) {
        console.error('Error fetching saved posts:', error);
        if (error.response?.status === 401) {
          setError('Please log in to view saved posts');
          navigate('/login');
        } else {
          setError(error.response?.data?.message || 'Failed to fetch saved posts');
        }
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchSavedPosts();
    }
  }, [userId, navigate]);

  const handleUnsavePost = async (postId) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Please log in to unsave posts');
        navigate('/login');
        return;
      }

      await axios.post(
        `http://localhost:5000/api/posts/${postId}/unsave`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSavedPosts((prev) => prev.filter((post) => post._id !== postId));
      setError('');
    } catch (error) {
      console.error('Error unsaving post:', error);
      if (error.response?.status === 401) {
        setError('Please log in to unsave posts');
        navigate('/login');
      } else {
        setError(error.response?.data?.message || 'Failed to unsave post');
      }
    }
  };

  const filteredPosts = savedPosts.filter((post) => {
    if (!post || !post.content) return false;
    return post.content.toLowerCase().includes(searchQuery.toLowerCase());
  });

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

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

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  {error}
                </div>
              )}

              {filteredPosts.length === 0 ? (
                <div className={`col-span-full text-center py-12 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <FiBookmark className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No saved posts</p>
                  <p>Posts you save will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredPosts.map((post) => (
                    <motion.div
                      key={post._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`rounded-xl overflow-hidden shadow-lg ${
                        darkMode ? 'bg-gray-700' : 'bg-white'
                      }`}
                    >
                      <Link to={`/post/${post._id}`}>
                        <img
                          src={`http://localhost:5000/${post.image}`}
                          alt={post.title}
                          className="w-full h-48 object-cover"
                        />
                      </Link>
                      <div className="p-4">
                        <Link to={`/post/${post._id}`}>
                          <h3 className={`font-semibold text-lg mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {post.title}
                          </h3>
                        </Link>
                        <p className={`text-sm mb-4 line-clamp-2 ${
                          darkMode ? 'text-gray-300' : 'text-gray-600'
                        }`}>
                          {post.content}
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
                                {post.likes?.length || 0}
                              </span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <FiMessageSquare className={`w-4 h-4 ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`} />
                              <span className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                {post.comments?.length || 0}
                              </span>
                            </div>
                          </div>
                          <button
                            onClick={() => handleUnsavePost(post._id)}
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
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 