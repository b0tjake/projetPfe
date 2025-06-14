import { useEffect, useState, useRef, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { FaHeart, FaComment, FaEllipsisV, FaMapMarkerAlt, FaPhone, FaUserEdit, FaSun, FaMoon, FaImage, FaUserPlus, FaTimes, FaCheck, FaUserMinus, FaEnvelope } from "react-icons/fa";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { DarkModeContext } from "../assets/darkmode";

const Profile = () => {
  const navigate = useNavigate();
  const { darkMode } = useContext(DarkModeContext);
  const [state, setState] = useState({
    userData: null,
    userPosts: [],
    error: null,
    saveChanges: "",
    isEditing: false,
    bio: "",
    city: "",
    phone: "",
    profession: "",
    activeTab: "Posts",
    showMenu: null,
    showConfirm: false,
    postToDelete: null,
    isLoading: true,
    friendStatus: null,
  });

  const { id } = useParams();
  const [decoded, setDecoded] = useState(null);
  const fileInputRef = useRef(null);
  const sectionRefs = useRef([]);
  const [showCreatePostModal, setShowCreatePostModal] = useState(false);
  const [newPost, setNewPost] = useState({ content: '', image: null });
  const postImageRef = useRef(null);
  const [commentInputs, setCommentInputs] = useState({});
  const [showComments, setShowComments] = useState({});
  const [userId, setUserId] = useState(null);
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Add section to refs array for animations
  const addToRefs = (el) => {
    if (el && !sectionRefs.current.includes(el)) {
      sectionRefs.current.push(el);
    }
  };

  // Initialize animations
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    // Section animations
    sectionRefs.current.forEach((section) => {
      gsap.from(section, {
        scrollTrigger: {
          trigger: section,
          start: "top 80%",
          toggleActions: "play none none none"
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power2.out"
      });
    });

    return () => ScrollTrigger.getAll().forEach(trigger => trigger.kill());
  }, []);

  // Check authentication and decode token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setState(prev => ({ ...prev, error: "Please login to view the profile" }));
      navigate('/login');
      return;
    }

    try {
      const decodedToken = jwtDecode(token);
      setDecoded(decodedToken);
      setUser(decodedToken);
      setUserId(decodedToken.id);
      fetchUserData();
    } catch (err) {
      setState(prev => ({ ...prev, error: "Invalid token" }));
    }
  }, [id, navigate]);

  // Fetch user data
  const fetchUserData = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/profile/profile/${id}`);
      setState(prev => ({
        ...prev,
        userData: res.data.user,
        userPosts: res.data.posts,
        bio: res.data.user.bio || "",
        city: res.data.user.city || "",
        phone: res.data.user.phone || "",
        profession: res.data.user.profession || "",
        isLoading: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: "Couldn't fetch user data", isLoading: false }));
    }
  };

  // Handle form field changes
  const handleChange = (field, value) => {
    setState(prev => ({ ...prev, [field]: value }));
  };

  // Save profile changes
  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/profile/saveChanges/${id}`, {
        bio: state.bio,
        city: state.city,
        phone: state.phone,
        profession: state.profession,
      });
      setState(prev => ({
        ...prev,
        saveChanges: "Changes saved successfully!",
        isEditing: false
      }));
      setTimeout(() => handleChange('saveChanges', ""), 3000);
    } catch (err) {
      setState(prev => ({ ...prev, error: "Couldn't save changes" }));
    }
  };

  // Delete a post
  const handleDeletePost = async (postId) => {
    try {
      await axios.delete(`http://localhost:5000/api/posts/${postId}`);
      setState(prev => ({
        ...prev,
        userPosts: prev.userPosts.filter(post => post._id !== postId),
        showMenu: null,
        showConfirm: false
      }));
    } catch (err) {
      setState(prev => ({ ...prev, error: "Couldn't delete the post" }));
    }
  };

  // Update profile photo
  const editPhoto = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      await axios.put(`http://localhost:5000/api/profile/editPhoto/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchUserData(); // Refresh user data
    } catch (error) {
      setState(prev => ({ ...prev, error: "Error updating photo" }));
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Add this new function to handle post creation
  const handleCreatePost = async () => {
    try {
      const formData = new FormData();
      formData.append('content', newPost.content);
      if (newPost.image) {
        formData.append('image', newPost.image);
      }

      const response = await axios.post('http://localhost:5000/api/posts', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      setState(prev => ({
        ...prev,
        userPosts: [response.data, ...prev.userPosts]
      }));
      setShowCreatePostModal(false);
      setNewPost({ content: '', image: null });
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const fetchFriendStatus = async (loggedUserId, profileUserId) => {
    try {
      // Get user data to check friend status
      const res = await axios.get(`http://localhost:5000/api/profile/profile/${profileUserId}`);
      const user = res.data.user;
      
      if (user.friends.includes(loggedUserId)) {
        return setState(prev => ({ ...prev, friendStatus: 'friends' }));
      }
      if (user.friendRequestsReceived.includes(loggedUserId)) {
        return setState(prev => ({ ...prev, friendStatus: 'requested' }));
      }
      if (user.friendRequestsSent.includes(loggedUserId)) {
        return setState(prev => ({ ...prev, friendStatus: 'pending' }));
      }
      setState(prev => ({ ...prev, friendStatus: 'not_friends' }));
    } catch (error) {
      console.error("Error fetching friend status:", error);
    }
  };

  const sendFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/friends/send/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setState(prev => ({ ...prev, friendStatus: "requested" }));
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  const cancelFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/friends/cancel/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setState(prev => ({ ...prev, friendStatus: "not_friends" }));
    } catch (error) {
      console.error("Error canceling friend request:", error);
    }
  };

  const acceptFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/friends/accept/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setState(prev => ({ ...prev, friendStatus: "friends" }));
    } catch (error) {
      console.error("Error accepting friend request:", error);
    }
  };

  const declineFriendRequest = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(
        `http://localhost:5000/api/friends/decline/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setState(prev => ({ ...prev, friendStatus: "not_friends" }));
    } catch (error) {
      console.error("Error declining friend request:", error);
    }
  };

  // Add this useEffect after the other useEffects
  useEffect(() => {
    if (decoded && id && decoded.id !== id) {
      fetchFriendStatus(decoded.id, id);
    }
  }, [decoded, id]);

  const handleLike = async (postId) => {
    try {
      const res = await axios.post("http://localhost:5000/api/posts/like", {
        postId,
        userId,
      });
      setState(prev => ({
        ...prev,
        userPosts: prev.userPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                likes: res.data.likes,
                likesCount: res.data.likes.length,
              }
            : p
        )
      }));
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const toggleComments = (postId) => {
    setShowComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleComment = async (postId) => {
    try {
      const textValue = commentInputs[postId];
      if (!textValue.trim()) return;

      const res = await axios.post("http://localhost:5000/api/posts/comment", {
        userId,
        postId,
        textValue,
      });

      setState(prev => ({
        ...prev,
        userPosts: prev.userPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                comments: res.data.comments || [],
                commentsCount: Array.isArray(res.data.comments)
                  ? res.data.comments.length
                  : 0,
              }
            : p
        )
      }));

      setCommentInputs((prev) => ({
        ...prev,
        [postId]: "",
      }));
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleSavePost = async (postId) => {
    if (!token) {
      setState(prev => ({ ...prev, error: "Please log in to save posts" }));
      return;
    }

    try {
      const isSaved = state.userPosts.find(p => p._id === postId)?.savedBy?.includes(userId);
      const endpoint = isSaved ? "unsave" : "save";
      
      const res = await axios.post(
        `http://localhost:5000/api/posts/${postId}/${endpoint}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setState(prev => ({
        ...prev,
        userPosts: prev.userPosts.map((p) =>
          p._id === postId
            ? {
                ...p,
                savedBy: res.data.savedBy || [],
                savedCount: res.data.savedBy?.length || 0,
              }
            : p
        )
      }));
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
      setState(prev => ({ ...prev, error: error.response?.data?.message || "Failed to save post" }));
    }
  };

  const handleMessage = () => {
    navigate(`/messages/${id}`);
  };

  if (state.error) return <div className="text-red-500 text-center py-10 text-lg">{state.error}</div>;
  if (state.isLoading) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
  if (!state.userData) return <div className="text-center mt-10 text-gray-600">User not found</div>;

  const isOwnProfile = decoded && decoded.id === state.userData._id;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div 
            ref={addToRefs}
            className={`w-full md:w-1/3 lg:w-1/4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 h-fit flex flex-col items-center`}
          >
            {/* Profile Picture Section */}
            <div className="relative group mb-4">
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className="hidden"
                onChange={(e) => e.target.files[0] && editPhoto(e.target.files[0])}
              />
              <img
                src={`http://localhost:5000/${state.userData.image}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg object-cover"
              />
              {decoded && state.userData._id === decoded.id && (
                <button
                  onClick={() => fileInputRef.current.click()}
                  className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                  aria-label="Change profile picture"
                >
                  <FaUserEdit className="w-4 h-4" />
                </button>
              )}
            </div>

            <h2 className="text-xl font-bold text-center mb-2">{state.userData.fullname}</h2>
            <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center mb-4`}>
              {state.profession || "No profession specified"}
            </p>

            {/* Friend Buttons Section */}
            {!isOwnProfile && decoded && (
              <div className="flex flex-col space-y-3 w-full mb-6">
                {state.friendStatus === "not_friends" && (
                  <button
                    onClick={sendFriendRequest}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                  >
                    <FaUserPlus className="w-4 h-4" />
                    Add Friend
                  </button>
                )}
                {state.friendStatus === "requested" && (
                  <button
                    onClick={cancelFriendRequest}
                    className="w-full bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                  >
                    <FaTimes className="w-4 h-4" />
                    Cancel Request
                  </button>
                )}
                {state.friendStatus === "pending" && (
                  <div className="flex flex-col space-y-2 w-full">
                    <button
                      onClick={acceptFriendRequest}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                    >
                      <FaCheck className="w-4 h-4" />
                      Accept Friend Request
                    </button>
                    <button
                      onClick={declineFriendRequest}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                    >
                      <FaTimes className="w-4 h-4" />
                      Decline Request
                    </button>
                  </div>
                )}
                {state.friendStatus === "friends" && (
                  <div className="flex flex-col space-y-3 w-full">
                    <button
                      onClick={declineFriendRequest}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2"
                    >
                      <FaUserMinus className="w-4 h-4" />
                      Unfriend
                    </button>
                    <button
                      onClick={handleMessage}
                      className={`w-full bg-blue-600 hover:bg-[#0077B6] text-white py-2 px-4 rounded-md transition flex items-center justify-center gap-2`}
                    >
                      <FaEnvelope className="w-4 h-4" />
                      Message
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Profile Completion */}
            {decoded && state.userData._id === decoded.id && (
              <div className={`w-full p-4 rounded-lg mb-6 ${darkMode ? 'bg-gray-700' : 'bg-blue-50'}`}>
                <div className="flex justify-between items-center mb-2">
                  <h3 className={`text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                    Profile Completion
                  </h3>
                  <span className="text-xs font-semibold text-blue-600">60%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-blue-600 h-1.5 rounded-full" 
                    style={{ width: '60%' }}
                  />
                </div>
                <p className={`text-xs mt-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  Complete your profile to get better visibility
                </p>
              </div>
            )}

            {/* Stats */}
            <div className="flex justify-center w-full border-t pt-4 mb-6">
              <div className="flex space-x-12">
                {[
                  { value: state.userPosts.length, label: "Posts" },
                  { value: state.userData.friends?.length || 0, label: "Friends" }
                ].map((stat, index) => (
                  <div key={index} className="text-center">
                    <p className="font-bold text-lg">{stat.value}</p>
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Contact Info */}
            <div className="w-full space-y-3">
              <div className="flex items-center">
                <FaMapMarkerAlt className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {state.city || "Not specified"}
                </span>
              </div>
              <div className="flex items-center">
                <FaPhone className={`w-5 h-5 mr-2 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`} />
                <span className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {state.phone || "Not specified"}
                </span>
              </div>
            </div>

            {/* Bio */}
            <div className="w-full mt-6">
              <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>About</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {state.bio || "No bio provided"}
              </p>
            </div>

            {/* Edit Profile Button */}
            {decoded && state.userData._id === decoded.id && (
              <button
                onClick={() => handleChange('isEditing', !state.isEditing)}
                className="w-full mt-6 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
              >
                {state.isEditing ? "Cancel Editing" : "Edit Profile"}
              </button>
            )}
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Tabs */}
            <div 
              ref={addToRefs}
              className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}
            >
              <nav className="flex -mb-px">
                {['Posts', 'About'].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-3 text-sm font-medium ${
                      state.activeTab === tab
                        ? `${darkMode ? 'border-blue-500 text-blue-400' : 'border-blue-500 text-blue-600'} border-b-2`
                        : `${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'}`
                    }`}
                    onClick={() => handleChange('activeTab', tab)}
                  >
                    {tab}
                  </button>
                ))}
              </nav>
            </div>

            {/* Profile Editing */}
            {state.isEditing && (
              <div 
                ref={addToRefs}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 mb-6`}
              >
                <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
                <div className="space-y-4">
                  {[
                    { label: "Profession", value: state.profession, field: 'profession' },
                    { label: "Location", value: state.city, field: 'city' },
                    { label: "Phone", value: state.phone, field: 'phone', type: 'tel' },
                    { label: "Bio", value: state.bio, field: 'bio', isTextArea: true }
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col">
                      <label className={`mb-1 text-sm font-medium ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                        {item.label}
                      </label>
                      {item.isTextArea ? (
                        <textarea
                          className={`rounded-lg px-3 py-2 ${
                            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                          } border`}
                          value={item.value}
                          onChange={(e) => handleChange(item.field, e.target.value)}
                          rows={4}
                        />
                      ) : (
                        <input
                          type={item.type || "text"}
                          className={`rounded-lg px-3 py-2 ${
                            darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                          } border`}
                          value={item.value}
                          onChange={(e) => handleChange(item.field, e.target.value)}
                        />
                      )}
                    </div>
                  ))}
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={handleSaveChanges}
                      className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Save Changes
                    </button>
                  </div>
                  {state.saveChanges && (
                    <div className={`text-sm mt-2 ${
                      state.saveChanges.includes('success') ? 'text-green-500' : 'text-red-500'
                    }`}>
                      {state.saveChanges}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Posts */}
            {state.activeTab === "Posts" && (
              <div className="grid grid-cols-1 gap-6">
                {state.userPosts.length > 0 ? (
                  state.userPosts.map((post) => (
                    <div 
                      key={post._id}
                      ref={addToRefs}
                      className={`rounded-lg shadow-sm border overflow-hidden transition-all duration-300 ${
                        darkMode 
                          ? 'bg-gray-800 border-gray-700' 
                          : 'bg-white border-gray-200'
                      }`}
                    >
                      {/* User info section with timestamp */}
                      <div className="p-3">
                        <div className="flex items-center">
                          <Link to={`profile/${state.userData._id}`} className="flex-shrink-0">
                            <img 
                              src={`http://localhost:5000/${state.userData.image}`} 
                              alt="User" 
                              className="w-10 h-10 rounded-full object-cover" 
                            />
                          </Link>
                          <div className="flex-1 ml-3">
                            <Link 
                              to={`profile/${state.userData._id}`} 
                              className={`font-semibold text-[15px] hover:underline ${
                                darkMode ? 'text-gray-100' : 'text-gray-900'
                              }`}
                            >
                              {state.userData.fullname}
                            </Link>
                            <div className={`flex items-center text-[13px] ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                              <span>{formatDate(post.createdAt)}</span>
                              <span className="mx-1">•</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          {state.userData._id === decoded?.id && (
                            <div className="relative">
                              <button
                                onClick={() => handleChange(
                                  'showMenu', 
                                  post._id === state.showMenu ? null : post._id
                                )}
                                className={`p-1.5 rounded-full hover:bg-gray-100 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}
                              >
                                <FaEllipsisV className="w-5 h-5" />
                              </button>
                              {state.showMenu === post._id && (
                                <div className={`absolute right-0 mt-1 w-48 rounded-md shadow-lg z-10 ${
                                  darkMode ? 'bg-gray-700' : 'bg-white'
                                } ring-1 ${darkMode ? 'ring-gray-600' : 'ring-gray-200'}`}>
                                  <div className="py-1">
                                    <button
                                      onClick={() => {
                                        handleChange('postToDelete', post._id);
                                        handleChange('showConfirm', true);
                                      }}
                                      className={`block w-full text-left px-4 py-2 text-sm ${
                                        darkMode ? 'text-red-400 hover:bg-gray-600' : 'text-red-600 hover:bg-gray-100'
                                      }`}
                                    >
                                      Delete Post
                                    </button>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Post content */}
                      <div className="px-3 pb-3">
                        <p className={`text-[15px] leading-5 ${darkMode ? 'text-gray-200' : 'text-gray-900'}`}>
                          {post.content}
                        </p>
                      </div>

                      {/* Post image */}
                      {post.image && (
                        <div className="relative">
                          <img 
                            src={`http://localhost:5000/${post.image}`} 
                            alt="Post" 
                            className="w-full h-auto object-cover" 
                          />
                        </div>
                      )}

                      {/* Likes and comments count */}
                      <div className={`px-3 py-2 border-b flex items-center justify-between text-[13px] ${
                        darkMode ? 'border-gray-700 text-gray-400' : 'border-gray-200 text-gray-500'
                      }`}>
                        <div className="flex items-center">
                          <div className="flex items-center -space-x-1">
                            <div className="bg-blue-500 rounded-full p-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                            </div>
                          </div>
                          <span className="ml-2">{post.likesCount > 0 ? post.likesCount : ''} {post.likesCount === 1 ? "like" : post.likesCount > 1 ? "likes" : ""}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          {post.commentsCount > 0 && (
                            <button onClick={() => toggleComments(post._id)} className="hover:underline">
                              {post.commentsCount} {post.commentsCount === 1 ? "comment" : "comments"}
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className={`px-2 py-1 flex items-center justify-between ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      }`}>
                        <button
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${
                            post.likes?.includes(userId) ? "text-blue-600" : ""
                          } ${darkMode ? 'hover:bg-gray-700' : ''}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${post.likes?.includes(userId) ? "fill-blue-600" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-[15px] font-medium">Like</span>
                        </button>

                        <button
                          onClick={() => toggleComments(post._id)}
                          className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${darkMode ? 'hover:bg-gray-700' : ''}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span className="text-[15px] font-medium">Comment</span>
                        </button>

                        <button
                          onClick={() => handleSavePost(post._id)}
                          className={`flex items-center justify-center flex-1 py-2 rounded-md mx-1 hover:bg-gray-100 transition-colors ${
                            post.savedBy?.includes(userId) ? "text-blue-600" : ""
                          } ${darkMode ? 'hover:bg-gray-700' : ''}`}
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-1 ${post.savedBy?.includes(userId) ? "fill-blue-600" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                            <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                          </svg>
                          <span className="text-[15px] font-medium">Save</span>
                        </button>
                      </div>

                      {/* Comments section */}
                      {showComments[post._id] && (
                        <div className={`px-3 py-2 border-t ${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
                          {/* Existing comments */}
                          {post.comments?.length > 0 && (
                            <div className="space-y-2 mb-3">
                              {post.comments.map((comment, index) => (
                                <div key={index} className="flex items-start">
                                  <Link to={`profile/${comment.user?._id}`} className="flex-shrink-0">
                                    <img src={`http://localhost:5000/${comment.user?.image}`} alt="User" className="w-8 h-8 rounded-full object-cover" />
                                  </Link>
                                  <div className="flex-1 ml-2">
                                    <div className={`inline-block px-3 py-2 rounded-2xl ${
                                      darkMode ? 'bg-gray-700' : 'bg-gray-100'
                                    }`}>
                                      <Link to={`profile/${comment.user?._id}`} className={`font-semibold text-[13px] hover:underline ${
                                        darkMode ? 'text-gray-100' : 'text-gray-900'
                                      }`}>
                                        {comment.user?.fullname}
                                      </Link>
                                      <p className={`text-[15px] mt-1 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
                                        {comment.text}
                                      </p>
                                    </div>
                                    <div className={`flex items-center mt-1 space-x-3 text-[12px] ${
                                      darkMode ? 'text-gray-400' : 'text-gray-500'
                                    }`}>
                                      <button className="hover:underline font-semibold">Like</button>
                                      <button className="hover:underline font-semibold">Reply</button>
                                      <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                          {/* Comment input */}
                          <div className="flex items-center">
                            <img 
                              src={`http://localhost:5000/${jwtDecode(token)?.image}`} 
                              alt="User" 
                              className="w-8 h-8 rounded-full object-cover flex-shrink-0" 
                            />
                            <div className={`flex-1 flex rounded-full border overflow-hidden ml-2 ${
                              darkMode ? 'bg-gray-700 border-gray-600' : 'bg-gray-100 border-gray-200'
                            }`}>
                              <input
                                type="text"
                                value={commentInputs[post._id] || ""}
                                onChange={(e) => handleCommentChange(post._id, e.target.value)}
                                placeholder="Write a comment..."
                                className={`flex-1 px-4 py-2 text-[15px] focus:outline-none ${
                                  darkMode ? 'bg-gray-700 text-gray-100 placeholder-gray-400' : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                                }`}
                              />
                              <button
                                onClick={() => handleComment(post._id)}
                                className={`px-3 font-medium text-[15px] ${
                                  darkMode ? 'text-blue-400 hover:bg-gray-600' : 'text-blue-600 hover:bg-gray-200'
                                }`}
                                disabled={!commentInputs[post._id]?.trim()}
                              >
                                Post
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div 
                    ref={addToRefs}
                    className={`text-center py-10 rounded-xl ${
                      darkMode ? 'bg-gray-800' : 'bg-white'
                    } shadow-sm`}
                  >
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      No posts yet. Start sharing your journeys!
                    </p>
                    {decoded && state.userData._id === decoded.id && (
                      <button 
                        onClick={() => setShowCreatePostModal(true)}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                      >
                        Create Your First Post
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* About Tab */}
            {state.activeTab === "About" && (
              <div 
                ref={addToRefs}
                className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6`}
              >
                <h2 className="text-xl font-semibold mb-4">About {state.userData.fullname}</h2>
                <div className="space-y-6">
                  <div>
                    <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Bio</h3>
                    <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {state.bio || "No bio provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className={`font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { label: "Profession", value: state.profession },
                        { label: "Location", value: state.city },
                        { label: "Phone", value: state.phone },
                        { label: "Member Since", value: formatDate(state.userData.createdAt) }
                      ].map((item, index) => (
                        <div key={index}>
                          <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                            {item.label}
                          </p>
                          <p className={`${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                            {item.value || "Not specified"}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {state.showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg max-w-sm w-full p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <h2 className={`text-lg font-semibold mb-4 ${
              darkMode ? 'text-white' : 'text-gray-800'
            }`}>
              Confirm Deletion
            </h2>
            <p className={`mb-6 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Are you sure you want to delete this post? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => handleChange('showConfirm', false)}
                className={`px-4 py-2 rounded-lg ${
                  darkMode ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeletePost(state.postToDelete)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create Post Modal */}
      {showCreatePostModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className={`rounded-xl shadow-lg max-w-2xl w-full p-6 ${
            darkMode ? 'bg-gray-800' : 'bg-white'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h2 className={`text-xl font-semibold ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}>
                Create New Post
              </h2>
              <button
                onClick={() => setShowCreatePostModal(false)}
                className={`p-2 rounded-full ${
                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              {/* User info section */}
              <div className="flex items-center space-x-3 mb-4">
                <img
                  src={`http://localhost:5000/${state.userData.image}`}
                  alt="Profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
                />
                <div>
                  <h3 className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                    {state.userData.fullname}
                  </h3>
                  <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    @{state.userData.username}
                  </p>
                </div>
              </div>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                placeholder="What's on your mind?"
                className={`w-full p-4 rounded-lg resize-none ${
                  darkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-white border-gray-300'
                } border focus:ring-2 focus:ring-blue-500 focus:border-transparent`}
                rows="4"
              />
              <div className="flex items-center justify-between">
                <button
                  onClick={() => postImageRef.current.click()}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
                    darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  <FaImage className="w-5 h-5" />
                  <span>Add Image</span>
                </button>
                <input
                  type="file"
                  ref={postImageRef}
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setNewPost(prev => ({ ...prev, image: e.target.files[0] }))}
                />
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className={`px-6 py-2 rounded-lg ${
                    newPost.content.trim()
                      ? 'bg-blue-500 hover:bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  Post
                </button>
              </div>
              {newPost.image && (
                <div className="relative">
                  <img
                    src={URL.createObjectURL(newPost.image)}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <button
                    onClick={() => setNewPost(prev => ({ ...prev, image: null }))}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;