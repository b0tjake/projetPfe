import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiHeart, FiMessageSquare, FiUserPlus, FiUserCheck } from 'react-icons/fi';
import axios from 'axios';
import Sidebar from '../components/sideBar';

export default function Notifications() {
  const { darkMode } = useContext(DarkModeContext);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/notifications', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return <FiHeart className="w-5 h-5" />;
      case 'comment':
        return <FiMessageSquare className="w-5 h-5" />;
      case 'follow':
        return <FiUserPlus className="w-5 h-5" />;
      case 'friend_request':
        return <FiUserCheck className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'like':
        return 'text-red-500';
      case 'comment':
        return 'text-blue-500';
      case 'follow':
        return 'text-green-500';
      case 'friend_request':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
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
                Notifications
              </h1>

              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className={`p-4 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-2 rounded-full ${
                          darkMode ? 'bg-gray-600' : 'bg-gray-200'
                        } ${getNotificationColor(notification.type)}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {notification.message}
                          </p>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            {new Date(notification.createdAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && notifications.length === 0 && (
                <div className={`text-center py-8 ${
                  darkMode ? 'text-gray-400' : 'text-gray-500'
                }`}>
                  <p className="text-lg font-medium mb-2">No notifications</p>
                  <p>You're all caught up!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 