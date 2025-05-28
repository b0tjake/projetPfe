import React, { useState, useContext, useEffect } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FaSearch, FaPaperPlane, FaEllipsisV, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axios from 'axios';
import Sidebar from '../components/sideBar';
import { FiSend, FiPaperclip, FiImage } from 'react-icons/fi';

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
    if (selectedConversation) {
      fetchMessages(selectedConversation._id);
    }
  }, [selectedConversation]);

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/conversations', {
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

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`http://localhost:5000/api/messages/${conversationId}`, {
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
      await axios.post(
        'http://localhost:5000/api/messages',
        {
          conversationId: selectedConversation._id,
          content: newMessage
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setNewMessage('');
      fetchMessages(selectedConversation._id);
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const renderMessage = (msg) => {
    const isOwnMessage = msg.senderId === user?.id;
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage
            ? darkMode
              ? 'bg-blue-600 text-white'
              : 'bg-blue-500 text-white'
            : darkMode
            ? 'bg-gray-700 text-white'
            : 'bg-gray-200 text-gray-800'
        }`}>
          <p>{msg.content}</p>
          <span className={`text-xs mt-1 block ${
            isOwnMessage
              ? 'text-blue-100'
              : darkMode
              ? 'text-gray-400'
              : 'text-gray-500'
          }`}>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </motion.div>
    );
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
                Messages
              </h1>

              <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
                {/* Conversations List */}
                <div className={`w-full lg:w-1/3 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-4`}>
                  <h2 className={`text-lg font-semibold mb-4 ${
                    darkMode ? 'text-white' : 'text-gray-900'
                  }`}>
                    Conversations
                  </h2>
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {conversations.map((conversation) => (
                        <button
                          key={conversation._id}
                          onClick={() => setSelectedConversation(conversation)}
                          className={`w-full p-3 rounded-lg text-left transition-colors ${
                            selectedConversation?._id === conversation._id
                              ? darkMode
                                ? 'bg-gray-600'
                                : 'bg-gray-200'
                              : darkMode
                                ? 'hover:bg-gray-600'
                                : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            <img
                              src={`http://localhost:5000/${conversation.participant.image}`}
                              alt={conversation.participant.fullname}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h3 className={`font-medium ${
                                darkMode ? 'text-white' : 'text-gray-900'
                              }`}>
                                {conversation.participant.fullname}
                              </h3>
                              <p className={`text-sm ${
                                darkMode ? 'text-gray-400' : 'text-gray-500'
                              }`}>
                                @{conversation.participant.username}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Messages Area */}
                <div className={`flex-1 rounded-xl ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                } p-4 flex flex-col h-[calc(100vh-12rem)]`}>
                  {selectedConversation ? (
                    <>
                      {/* Messages Header */}
                      <div className="flex items-center space-x-3 mb-4 pb-4 border-b border-gray-200 dark:border-gray-600">
                        <img
                          src={`http://localhost:5000/${selectedConversation.participant.image}`}
                          alt={selectedConversation.participant.fullname}
                          className="w-10 h-10 rounded-full object-cover"
                        />
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
                      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                        {messages.map((message) => (
                          <div
                            key={message._id}
                            className={`flex ${
                              message.sender === localStorage.getItem('userId')
                                ? 'justify-end'
                                : 'justify-start'
                            }`}
                          >
                            <div
                              className={`max-w-[70%] rounded-lg p-3 ${
                                message.sender === localStorage.getItem('userId')
                                  ? darkMode
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-blue-500 text-white'
                                  : darkMode
                                    ? 'bg-gray-600 text-white'
                                    : 'bg-gray-200 text-gray-900'
                              }`}
                            >
                              <p>{message.content}</p>
                              <p className={`text-xs mt-1 ${
                                message.sender === localStorage.getItem('userId')
                                  ? 'text-blue-100'
                                  : darkMode
                                    ? 'text-gray-400'
                                    : 'text-gray-500'
                              }`}>
                                {new Date(message.createdAt).toLocaleTimeString()}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Message Input */}
                      <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Type a message..."
                          className={`flex-1 p-2 rounded-lg ${
                            darkMode
                              ? 'bg-gray-600 text-white placeholder-gray-400'
                              : 'bg-white text-gray-900 placeholder-gray-500'
                          } border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        />
                        <button
                          type="submit"
                          className={`p-2 rounded-lg ${
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
                      <p>Select a conversation to start messaging</p>
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