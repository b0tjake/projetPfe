import React, { useState, useContext, useEffect } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { FiSend, FiPaperclip, FiImage, FiMessageSquare } from 'react-icons/fi';
import { useParams } from 'react-router-dom';

export default function Messages() {
  const { darkMode } = useContext(DarkModeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const { userId } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUser(decodedToken);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      // If we have a userId from the URL, find or create the conversation
      const findOrCreateConversation = async () => {
        try {
          const token = localStorage.getItem('token');
          // First try to find an existing conversation
          const response = await axios.get('http://localhost:5000/api/messages/conversations', {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          const existingConversation = response.data.find(
            conv => conv.participant._id === userId
          );

          if (existingConversation) {
            setSelectedConversation(existingConversation);
            fetchMessages(userId);
          } else {
            // If no conversation exists, create a new one
            const userResponse = await axios.get(`http://localhost:5000/api/profile/profile/${userId}`, {
              headers: {
                Authorization: `Bearer ${token}`
              }
            });
            
            const newConversation = {
              _id: Date.now().toString(), // Temporary ID
              participant: userResponse.data.user,
              lastMessage: null,
              unreadCount: 0
            };
            
            setSelectedConversation(newConversation);
            setConversations(prev => [newConversation, ...prev]);
          }
        } catch (error) {
          console.error('Error finding/creating conversation:', error);
        }
      };

      findOrCreateConversation();
    }
  }, [userId]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation.participant._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/messages/conversations', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMessages = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/messages/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `http://localhost:5000/api/messages/${selectedConversation.participant._id}`,
        { content: newMessage },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setMessages([...messages, response.data]);
      setNewMessage('');
      // Refresh conversations to update the last message
      fetchConversations();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="flex flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1">
          <div className={`p-4 sm:p-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} min-h-screen`}>
            <div className="max-w-7xl mx-auto">
              <div className="flex items-center space-x-3 mb-6">
                <FiMessageSquare className={`text-3xl ${darkMode ? 'text-blue-400' : 'text-blue-600'}`} />
                <h1 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Messages
                </h1>
              </div>

              <div className="flex flex-col lg:flex-row gap-6">
                {/* Conversations List */}
                <div className={`w-full lg:w-1/3 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-4 shadow-lg`}>
                  <div className="mb-4">
                    <div className={`relative ${
                      darkMode ? 'bg-gray-600' : 'bg-white'
                    } rounded-lg`}>
                      <input
                        type="text"
                        placeholder="Search conversations..."
                        className={`w-full p-3 pl-10 rounded-lg ${
                          darkMode 
                            ? 'bg-gray-600 text-white placeholder-gray-400' 
                            : 'bg-white text-gray-900 placeholder-gray-500'
                        } border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                      />
                      <FaSearch className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
                        darkMode ? 'text-gray-400' : 'text-gray-500'
                      }`} />
                    </div>
                  </div>

                  <div className="space-y-2 max-h-[calc(100vh-12rem)] overflow-y-auto">
                    {loading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                      </div>
                    ) : (
                      conversations.map((conversation) => (
                        <motion.button
                          key={conversation._id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`w-full p-3 rounded-lg text-left transition-all duration-200 ${
                            selectedConversation?._id === conversation._id
                              ? darkMode
                                ? 'bg-gray-600 shadow-lg'
                                : 'bg-blue-50 shadow-md'
                              : darkMode
                                ? 'hover:bg-gray-600/50'
                                : 'hover:bg-gray-100'
                          }`}
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                        >
                          <div className="flex items-center space-x-3">
                            {conversation.participant.image ? (
                              <img
                                src={`http://localhost:5000/${conversation.participant.image}`}
                                alt={conversation.participant.fullname}
                                className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                              />
                            ) : (
                              <FaUserCircle className="w-12 h-12 text-gray-400" />
                            )}
                            <div className="flex-1 min-w-0">
                              <h3 className={`font-medium truncate ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {conversation.participant.fullname}
                              </h3>
                              <p className={`text-sm truncate ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                @{conversation.participant.username}
                              </p>
                            </div>
                            {conversation.unreadCount > 0 && (
                              <span className="flex-shrink-0 bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                        </motion.button>
                      ))
                    )}
                  </div>
                </div>

                {/* Messages Area */}
                <div className={`flex-1 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-4 shadow-lg flex flex-col h-[calc(100vh-12rem)]`}>
                  {selectedConversation ? (
                    <>
                      {/* Messages Header */}
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                        {selectedConversation.participant.image ? (
                          <img
                            src={`http://localhost:5000/${selectedConversation.participant.image}`}
                            alt={selectedConversation.participant.fullname}
                            className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                          />
                        ) : (
                          <FaUserCircle className="w-12 h-12 text-gray-400" />
                        )}
                        <div>
                          <h3 className={`font-medium ${
                            darkMode ? 'text-white' : 'text-gray-900'
                          }`}>
                            {selectedConversation.participant.fullname}
                          </h3>
                          <p className={`text-sm ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                          }`}>
                            @{selectedConversation.participant.username}
                          </p>
                        </div>
                      </div>

                      {/* Messages List */}
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4 px-2">
                        {messages.map((message) => (
                          <motion.div
                            key={message._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex ${
                              message.sender._id === user?.id
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl p-3 ${
                                message.sender._id === user?.id
                                  ? darkMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                  : darkMode
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p className="text-sm sm:text-base">{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender._id === user?.id
                                  ? 'text-blue-100'
                                  : darkMode
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </motion.div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <form onSubmit={handleSendMessage} className="flex items-center space-x-2 mt-auto">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className={`flex-1 p-3 rounded-lg ${
                            darkMode
                              ? 'bg-gray-600 text-white placeholder-gray-400'
                              : 'bg-white text-gray-900 placeholder-gray-500'
                          } border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          type="submit"
                          className={`p-3 rounded-lg ${
                            darkMode
                              ? 'bg-blue-600 hover:bg-blue-700'
                              : 'bg-blue-500 hover:bg-blue-600'
                          } text-white transition-colors`}
                        >
                          <FiSend className="w-5 h-5" />
                        </button>
                      </form>
                    </>
                  ) : (
                    <div className={`flex-1 flex items-center justify-center ${
                      darkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      <div className="text-center">
                        <FiMessageSquare className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">Select a conversation to start messaging</p>
                      </div>
                    </div>
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