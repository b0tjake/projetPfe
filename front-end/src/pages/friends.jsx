import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiUserPlus, FiUserMinus, FiSearch, FiUserCheck, FiUserX, FiUsers, FiUser, FiSend } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

export default function Friends() {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [state, setState] = useState({
    friends: [],
    receivedRequests: [],
    sentRequests: [],
    activeTab: 'friends',
    searchQuery: '',
    loading: true,
    error: null
  });
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
      fetchUserData(decodedToken.id);
    } catch (err) {
      setState(prev => ({ ...prev, error: "Invalid token" }));
    }
  }, [navigate]);

  const fetchUserData = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/profile/${userId}`);
      const userData = res.data.user;
      
      // Fetch details for friends, received requests, and sent requests
      const [friendsData, receivedData, sentData] = await Promise.all([
        Promise.all(userData.friends.map(id => axios.get(`http://localhost:5000/api/profile/profile/${id}`))),
        Promise.all(userData.friendRequestsReceived.map(id => axios.get(`http://localhost:5000/api/profile/profile/${id}`))),
        Promise.all(userData.friendRequestsSent.map(id => axios.get(`http://localhost:5000/api/profile/profile/${id}`)))
      ]);

      setState(prev => ({
        ...prev,
        friends: friendsData.map(res => res.data.user),
        receivedRequests: receivedData.map(res => res.data.user),
        sentRequests: sentData.map(res => res.data.user),
        loading: false
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: "Couldn't fetch user data",
        loading: false
      }));
    }
  };

  const handleAcceptRequest = async (senderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/friends/accept/${senderId}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUserData(decoded.id);
    } catch (error) {
      console.error('Error accepting friend request:', error);
    }
  };

  const handleDeclineRequest = async (senderId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/friends/decline/${senderId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUserData(decoded.id);
    } catch (error) {
      console.error('Error declining friend request:', error);
    }
  };

  const handleCancelRequest = async (receiverId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/friends/cancel/${receiverId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUserData(decoded.id);
    } catch (error) {
      console.error('Error canceling friend request:', error);
    }
  };

  const handleUnfriend = async (friendId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/friends/decline/${friendId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      fetchUserData(decoded.id);
    } catch (error) {
      console.error('Error removing friend:', error);
    }
  };

  const filteredData = () => {
    const searchLower = state.searchQuery.toLowerCase();
    const data = {
      friends: state.friends,
      received: state.receivedRequests,
      sent: state.sentRequests
    }[state.activeTab] || [];

    return data.filter(user =>
      user.fullname.toLowerCase().includes(searchLower) ||
      user.username?.toLowerCase().includes(searchLower)
    );
  };

  if (state.error) return <div className="text-red-500 text-center py-10">{state.error}</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          <div className={`p-4 sm:p-8 ${darkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen`}>
            {/* Header and Tabs */}
            <div className="mb-8">
              <div className="flex items-center space-x-3 mb-6">
                {/* <FiUsers className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} /> */}
                {/* <h1 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}> */}
                  {/* Friends */}
                {/* </h1> */}
              </div>
              <div className="flex space-x-6 border-b border-gray-200">
                {[
                  { id: 'friends', label: 'Friends', count: state.friends.length, icon: FiUsers },
                  { id: 'received', label: 'Friend Requests', count: state.receivedRequests.length, icon: FiUser },
                  { id: 'sent', label: 'Sent Requests', count: state.sentRequests.length, icon: FiSend }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
                    className={`flex items-center space-x-2 pb-3 px-1 transition-all duration-200 ${
                      state.activeTab === tab.id
                        ? `border-b-2 border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                        : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                  >
                    <tab.icon className="text-lg" />
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      state.activeTab === tab.id
                        ? darkMode ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-600'
                        : darkMode ? 'bg-gray-700 text-gray-400' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search friends..."
                  value={state.searchQuery}
                  onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
                  className={`w-full pl-12 pr-4 py-3 rounded-xl ${
                    darkMode
                      ? 'bg-gray-700 text-white border-gray-600 placeholder-gray-400'
                      : 'bg-white text-gray-900 border-gray-300 placeholder-gray-500'
                  } border focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200`}
                />
                <FiSearch className={`absolute left-4 top-1/2 transform -translate-y-1/2 text-xl ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`} />
              </div>
            </div>

            {/* Content */}
            {state.loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
              </div>
            ) : (
              <div className="max-w-2xl px-4 sm:px-6">
                {/* mx-auto */}
                {filteredData().length === 0 ? (
                  <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <FiUsers className="mx-auto text-5xl mb-4 opacity-50" />
                    <p className="text-lg">No {state.activeTab} found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {filteredData().map((user) => (
                      <div
                        key={user._id}
                        className={`flex items-center justify-between p-3 ${
                          darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-50'
                        } rounded-lg transition-all duration-200`}
                      >
                        <div 
                          className="flex items-center space-x-3 flex-1 cursor-pointer"
                          onClick={() => navigate(`/profile/${user._id}`)}
                        >
                          <div className="relative flex-shrink-0">
                            <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-full overflow-hidden">
                              <img
                                src={`http://localhost:5000/${user.image}`}
                                alt={user.fullname}
                                className="w-full h-full object-cover"
                              />
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className={`text-sm sm:text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'} truncate`}>
                              {user.fullname}
                            </h3>
                            <p className={`text-xs sm:text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'} truncate`}>
                              @{user.username}
                            </p>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center space-x-1 sm:space-x-2 ml-2">
                          {state.activeTab === 'friends' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleUnfriend(user._id);
                              }}
                              className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                darkMode
                                  ? 'text-red-400 hover:bg-red-500/10'
                                  : 'text-red-500 hover:bg-red-50'
                              }`}
                            >
                              {/* Unfriend */}
                            </button>
                          )}
                          
                          {state.activeTab === 'received' && (
                            <div className="flex space-x-1 sm:space-x-2">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeclineRequest(user._id);
                                }}
                                className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                  darkMode
                                    ? 'text-red-400 hover:bg-red-500/10'
                                    : 'text-red-500 hover:bg-red-50'
                                }`}
                              >
                                Decline
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAcceptRequest(user._id);
                                }}
                                className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                  darkMode
                                    ? 'text-blue-400 hover:bg-blue-500/10'
                                    : 'text-blue-500 hover:bg-blue-50'
                                }`}
                              >
                                Accept
                              </button>
                            </div>
                          )}
                          
                          {state.activeTab === 'sent' && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCancelRequest(user._id);
                              }}
                              className={`px-2 sm:px-4 py-1 sm:py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 ${
                                darkMode
                                  ? 'text-gray-400 hover:bg-gray-600'
                                  : 'text-gray-500 hover:bg-gray-100'
                              }`}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 