import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiUserPlus, FiUserMinus, FiSearch, FiUserCheck, FiUserX } from 'react-icons/fi';
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
          <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen`}>
            {/* Header and Tabs */}
            <div className="mb-6">
              <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Friends
              </h1>
              <div className="flex space-x-4 border-b border-gray-200">
                {[
                  { id: 'friends', label: 'Friends', count: state.friends.length },
                  { id: 'received', label: 'Friend Requests', count: state.receivedRequests.length },
                  { id: 'sent', label: 'Sent Requests', count: state.sentRequests.length }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setState(prev => ({ ...prev, activeTab: tab.id }))}
                    className={`pb-2 px-1 ${
                      state.activeTab === tab.id
                        ? `border-b-2 border-blue-500 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`
                        : `${darkMode ? 'text-gray-400' : 'text-gray-500'}`
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Search..."
                  value={state.searchQuery}
                  onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
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

            {/* Content */}
            {state.loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <div className="max-w-3xl mx-auto space-y-4">
                {filteredData().map((user) => (
                  <div
                    key={user._id}
                    className={`${darkMode ? 'bg-gray-700' : 'bg-white'} rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden`}
                  >
                    <div className="p-6">
                      <div className="flex items-center space-x-4">
                        <img
                          src={`http://localhost:5000/${user.image}`}
                          alt={user.fullname}
                          className="w-16 h-16 rounded-full object-cover border-2 border-blue-500"
                        />
                        <div className="flex-1">
                          <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {user.fullname}
                          </h3>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            @{user.username}
                          </p>
                          {user.profession && (
                            <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                              {user.profession}
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {/* Action Buttons */}
                      <div className="mt-4 flex justify-end space-x-3">
                        {state.activeTab === 'friends' && (
                          <button
                            onClick={() => handleUnfriend(user._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              darkMode
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-50 text-red-500 hover:bg-red-100'
                            } transition-colors duration-200`}
                          >
                            Unfriend
                          </button>
                        )}
                        
                        {state.activeTab === 'received' && (
                          <>
                            <button
                              onClick={() => handleDeclineRequest(user._id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                darkMode
                                  ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                  : 'bg-red-50 text-red-500 hover:bg-red-100'
                              } transition-colors duration-200`}
                            >
                              Decline
                            </button>
                            <button
                              onClick={() => handleAcceptRequest(user._id)}
                              className={`px-4 py-2 rounded-lg text-sm font-medium ${
                                darkMode
                                  ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20'
                                  : 'bg-green-50 text-green-500 hover:bg-green-100'
                              } transition-colors duration-200`}
                            >
                              Accept
                            </button>
                          </>
                        )}
                        
                        {state.activeTab === 'sent' && (
                          <button
                            onClick={() => handleCancelRequest(user._id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium ${
                              darkMode
                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20'
                                : 'bg-red-50 text-red-500 hover:bg-red-100'
                            } transition-colors duration-200`}
                          >
                            Cancel Request
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {!state.loading && filteredData().length === 0 && (
              <div className={`text-center py-12 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                <div className="max-w-sm mx-auto">
                  <p className="text-lg font-medium mb-2">
                    {state.activeTab === 'friends' && "No friends found"}
                    {state.activeTab === 'received' && "No friend requests"}
                    {state.activeTab === 'sent' && "No sent requests"}
                  </p>
                  <p className="text-sm opacity-75">
                    {state.activeTab === 'friends' && "Start connecting with other users to build your network"}
                    {state.activeTab === 'received' && "You don't have any pending friend requests"}
                    {state.activeTab === 'sent' && "You haven't sent any friend requests yet"}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 