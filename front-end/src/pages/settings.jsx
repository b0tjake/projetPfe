import React, { useState, useEffect, useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiUser, FiLock, FiBell, FiShield, FiHelpCircle, FiGlobe, FiMoon, FiSun } from 'react-icons/fi';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { jwtDecode } from "jwt-decode";

export default function Settings() {
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    fullname: '',
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
    notifications: {
      email: true,
      push: true,
      mentions: true,
      comments: true
    },
    language: 'en'
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  let userId = null;
  try {
    const token = localStorage.getItem("token");
    if (token) {
      userId = jwtDecode(token).id;
    }
  } catch (e) {}

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = jwtDecode(token).id;
      const response = await axios.get(`http://localhost:5000/api/profile/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
      setFormData(prev => ({
        ...prev,
        fullname: response.data.user.fullname,
        username: response.data.user.username,
        email: response.data.user.email
      }));
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNotificationChange = (type) => {
    setFormData(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
      }
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/profile/updateInfo/${userId}`,
        {
          fullname: formData.fullname,
          username: formData.username,
          email: formData.email,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Profile updated successfully!");
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error updating profile. Please try again."
      );
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage("");
    setErrorMessage("");
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("New passwords do not match.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/profile/updatePassword/${userId}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSuccessMessage("Password updated successfully!");
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Error updating password. Please try again."
      );
    }
  };

  const settingsTabs = [
    { id: 'profile', icon: <FiUser />, label: 'Profile' },
    { id: 'security', icon: <FiLock />, label: 'Security' },
    { id: 'notifications', icon: <FiBell />, label: 'Notifications' },
    { id: 'privacy', icon: <FiShield />, label: 'Privacy' },
    { id: 'language', icon: <FiGlobe />, label: 'Language' },
    { id: 'appearance', icon: darkMode ? <FiSun /> : <FiMoon />, label: 'Appearance' },
    { id: 'help', icon: <FiHelpCircle />, label: 'Help & Support' }
  ];

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
    { code: 'ar', name: 'العربية' },
    { code: 'es', name: 'Español' }
  ];

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
                Settings
              </h1>

              <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
                {/* Settings Navigation */}
                <div className={`w-full lg:w-64 space-y-2 ${
                  darkMode ? 'text-gray-300' : 'text-gray-600'
                }`}>
                  <div className="flex overflow-x-auto lg:flex-col pb-2 lg:pb-0">
                    {settingsTabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex-shrink-0 lg:w-full flex items-center p-3 rounded-lg transition-colors ${
                          activeTab === tab.id
                            ? darkMode
                              ? 'bg-blue-900 text-white'
                              : 'bg-blue-50 text-blue-600'
                            : darkMode
                            ? 'hover:bg-gray-700 hover:text-white'
                            : 'hover:bg-gray-50 hover:text-blue-600'
                        }`}
                      >
                        <span className="text-xl mr-3">{tab.icon}</span>
                        <span className="font-medium">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Settings Content */}
                <div className="flex-1">
                  {loading ? (
                    <div className="flex justify-center items-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-4 sm:p-6 rounded-xl ${
                        darkMode ? 'bg-gray-700' : 'bg-gray-50'
                      }`}
                    >
                      {/* Profile Settings */}
                      {activeTab === 'profile' && (
                        <form onSubmit={handleProfileSubmit} className="space-y-4 sm:space-y-6">
                          <div className="flex flex-col space-y-4">
                            <div>
                              <label className={`block mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Full Name
                              </label>
                              <input
                                type="text"
                                name="fullname"
                                value={formData.fullname}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${
                                  darkMode
                                    ? 'bg-gray-600 text-white border-gray-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                            <div>
                              <label className={`block mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Username
                              </label>
                              <input
                                type="text"
                                name="username"
                                value={formData.username}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${
                                  darkMode
                                    ? 'bg-gray-600 text-white border-gray-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                            <div>
                              <label className={`block mb-2 ${
                                darkMode ? 'text-gray-300' : 'text-gray-700'
                              }`}>
                                Email
                              </label>
                              <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full p-2 rounded-lg ${
                                  darkMode
                                    ? 'bg-gray-600 text-white border-gray-500'
                                    : 'bg-white text-gray-900 border-gray-300'
                                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                              />
                            </div>
                          </div>
                          {successMessage && <div className="text-green-600">{successMessage}</div>}
                          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      )}

                      {/* Security Settings */}
                      {activeTab === 'security' && (
                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                          <div>
                            <label className={`block mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Current Password
                            </label>
                            <input
                              type="password"
                              name="currentPassword"
                              value={formData.currentPassword}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded-lg ${
                                darkMode
                                  ? 'bg-gray-600 text-white border-gray-500'
                                  : 'bg-white text-gray-900 border-gray-300'
                              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label className={`block mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              New Password
                            </label>
                            <input
                              type="password"
                              name="newPassword"
                              value={formData.newPassword}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded-lg ${
                                darkMode
                                  ? 'bg-gray-600 text-white border-gray-500'
                                  : 'bg-white text-gray-900 border-gray-300'
                              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                          </div>
                          <div>
                            <label className={`block mb-2 ${
                              darkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              Confirm New Password
                            </label>
                            <input
                              type="password"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                              className={`w-full p-2 rounded-lg ${
                                darkMode
                                  ? 'bg-gray-600 text-white border-gray-500'
                                  : 'bg-white text-gray-900 border-gray-300'
                              } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                            />
                          </div>
                          {successMessage && <div className="text-green-600">{successMessage}</div>}
                          {errorMessage && <div className="text-red-600">{errorMessage}</div>}
                          <button
                            type="submit"
                            className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                          >
                            Update Password
                          </button>
                        </form>
                      )}

                      {/* Notifications Settings */}
                      {activeTab === 'notifications' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                Email Notifications
                              </h3>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Receive notifications via email
                              </p>
                            </div>
                            <button
                              onClick={() => handleNotificationChange('email')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                formData.notifications.email ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  formData.notifications.email ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                Push Notifications
                              </h3>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Receive push notifications
                              </p>
                            </div>
                            <button
                              onClick={() => handleNotificationChange('push')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                formData.notifications.push ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  formData.notifications.push ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Privacy Settings */}
                      {activeTab === 'privacy' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                Profile Visibility
                              </h3>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Make your profile visible to everyone
                              </p>
                            </div>
                            <button
                              onClick={() => handleNotificationChange('profileVisibility')}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                formData.notifications.profileVisibility ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  formData.notifications.profileVisibility ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Language Settings */}
                      {activeTab === 'language' && (
                        <div className="space-y-4 sm:space-y-6">
                          <div className={`p-4 sm:p-6 rounded-xl ${
                            darkMode ? 'bg-gray-700' : 'bg-gray-50'
                          }`}>
                            <h2 className={`text-lg sm:text-xl font-semibold mb-4 ${
                              darkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                              Language Settings
                            </h2>
                            <div className="space-y-3 sm:space-y-4">
                              {languages.map((lang) => (
                                <div
                                  key={lang.code}
                                  className={`flex items-center p-3 sm:p-4 rounded-lg border ${
                                    darkMode ? 'border-gray-600' : 'border-gray-200'
                                  } ${
                                    formData.language === lang.code
                                      ? darkMode
                                        ? 'bg-blue-900 border-blue-700'
                                        : 'bg-blue-50 border-blue-200'
                                      : darkMode
                                      ? 'hover:bg-gray-600'
                                      : 'hover:bg-gray-50'
                                  } cursor-pointer transition-colors duration-200`}
                                  onClick={() => setFormData(prev => ({ ...prev, language: lang.code }))}
                                >
                                  <input
                                    type="radio"
                                    name="language"
                                    checked={formData.language === lang.code}
                                    onChange={() => {}}
                                    className={`mr-3 ${
                                      darkMode ? 'text-blue-500' : 'text-blue-600'
                                    }`}
                                  />
                                  <span className={`${
                                    darkMode ? 'text-gray-200' : 'text-gray-700'
                                  }`}>
                                    {lang.name}
                                  </span>
                                </div>
                              ))}
                            </div>
                            <div className="mt-6 flex justify-end">
                              <button
                                onClick={handleSubmit}
                                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                              >
                                Save Changes
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Appearance Settings */}
                      {activeTab === 'appearance' && (
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 dark:border-gray-600">
                            <div>
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                Appearance
                              </h3>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                Choose your preferred appearance
                              </p>
                            </div>
                            <button
                              onClick={toggleDarkMode}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                darkMode ? 'bg-blue-600' : 'bg-gray-200'
                              }`}
                            >
                              <span
                                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                  darkMode ? 'translate-x-6' : 'translate-x-1'
                                }`}
                              />
                            </button>
                          </div>
                        </div>
                      )}

                      {/* Help & Support */}
                      {activeTab === 'help' && (
                        <div className={`space-y-4 ${
                          darkMode ? 'text-gray-300' : 'text-gray-700'
                        }`}>
                          <h3 className="text-lg sm:text-xl font-semibold mb-4">Help & Support</h3>
                          <p>Need help? Here are some resources:</p>
                          <ul className="list-disc list-inside space-y-2">
                            <li>FAQ</li>
                            <li>Contact Support</li>
                            <li>User Guide</li>
                            <li>Community Forum</li>
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 