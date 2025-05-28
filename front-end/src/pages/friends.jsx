import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiUserPlus, FiUserMinus, FiSearch } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/sideBar';

export default function Friends() {
  const { darkMode } = useContext(DarkModeContext);
  const [friends, setFriends] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/friends', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setFriends(response.data);
    } catch (error) {
      console.error('Error fetching friends:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/friends/add', { friendId }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchFriends();
    } catch (error) {
      console.error('Error adding friend:', error);
    }
  };

  const handleRemoveFriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/friends/${friendId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      fetchFriends();
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const filteredFriends = friends.filter(friend =>
    friend.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
    friend.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                Friends
              </h1>

              {/* Search Bar */}
              <div className="mb-6">
                <div className={`relative max-w-md mx-auto lg:mx-0`}>
                  <input
                    type="text"
                    placeholder="Search friends..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 rounded-lg ${
                      darkMode
                        ? 'bg-gray-700 text-white border-gray-600'
                        : 'bg-white text-gray-900 border-gray-300'
                    } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {filteredFriends.map((friend) => (
                    <div
                      key={friend._id}
                      className={`p-4 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        <img
                          src={`http://localhost:5000/${friend.image}`}
                          alt={friend.fullname}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className={`text-sm font-medium truncate ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {friend.fullname}
                          </h3>
                          <p className={`text-sm truncate ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            @{friend.username}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className={`p-2 rounded-full ${
                            darkMode
                              ? 'text-red-400 hover:bg-red-900/50'
                              : 'text-red-500 hover:bg-red-50'
                          } transition-colors`}
                        >
                          <FiUserMinus className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && filteredFriends.length === 0 && (
                <div className={`text-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <p>No friends found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 