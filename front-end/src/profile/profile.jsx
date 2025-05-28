import { useEffect, useState, useRef, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";
import { FaHeart, FaComment, FaEllipsisV, FaMapMarkerAlt, FaPhone, FaUserEdit, FaSun, FaMoon } from "react-icons/fa";
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
    isLoading: true
  });

  const { id } = useParams();
  const [decoded, setDecoded] = useState(null);
  const fileInputRef = useRef(null);
  const sectionRefs = useRef([]);

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

  if (state.error) return <div className="text-red-500 text-center py-10 text-lg">{state.error}</div>;
  if (state.isLoading) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;
  if (!state.userData) return <div className="text-center mt-10 text-gray-600">User not found</div>;

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900 text-gray-100' : 'bg-gray-50 text-gray-900'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Sidebar */}
          <div 
            ref={addToRefs}
            className={`w-full md:w-1/3 lg:w-1/4 ${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-md p-6 h-fit flex top-8`}
          >
            <div className="flex flex-col items-center">
              {/* Profile Picture */}
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

              <h2 className="text-xl font-bold text-center">{state.userData.fullname}</h2>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'} text-center mb-6`}>
                {state.profession || "No profession specified"}
              </p>

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
              <div className="flex justify-between w-full border-t pt-4 mb-6">
                {[
                  { value: state.userPosts.length, label: "Posts" },
                  { value: 0, label: "Followers" },
                  { value: 0, label: "Following" }
                ].map((stat, index) => (
                  <div key={index} className="text-center px-2">
                    <p className="font-bold">{stat.value}</p>
                    <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                      {stat.label}
                    </p>
                  </div>
                ))}
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
          </div>

          {/* Main Content */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            {/* Tabs */}
            <div 
              ref={addToRefs}
              className={`border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'} mb-6`}
            >
              <nav className="flex -mb-px">
                {['Posts', 'Saved', 'About'].map((tab) => (
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
                      className={`rounded-xl overflow-hidden transition-shadow ${
                        darkMode ? 'bg-gray-800 hover:shadow-lg' : 'bg-white hover:shadow-md'
                      } shadow-sm`}
                    >
                      {/* Post header */}
                      <div className={`p-4 border-b ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center space-x-3">
                            <img
                              src={`http://localhost:5000/${state.userData.image}`}
                              className="w-10 h-10 rounded-full object-cover"
                              alt="User"
                            />
                            <div>
                              <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                {state.userData.fullname}
                              </h3>
                              <p className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                {formatDate(post.createdAt)}
                              </p>
                            </div>
                          </div>
                          {state.userData._id === decoded?.id && (
                            <div className="relative">
                              <button
                                onClick={() => handleChange(
                                  'showMenu', 
                                  post._id === state.showMenu ? null : post._id
                                )}
                                className={`p-1 rounded-full ${
                                  darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'
                                }`}
                                aria-label="Post options"
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
                      <div className="p-4">
                        <p className={`mb-3 ${darkMode ? 'text-gray-300' : 'text-gray-800'}`}>
                          {post.content}
                        </p>
                        {post.image && (
                          <img
                            src={`http://localhost:5000/${post.image}`}
                            className="w-full h-64 object-cover rounded-lg"
                            alt="Post"
                          />
                        )}
                      </div>

                      {/* Post actions */}
                      <div className={`p-3 border-t ${
                        darkMode ? 'border-gray-700' : 'border-gray-200'
                      } flex space-x-4`}>
                        <button className={`flex items-center space-x-1 ${
                          darkMode ? 'text-gray-400 hover:text-blue-400' : 'text-gray-500 hover:text-blue-500'
                        }`}>
                          <FaHeart className="w-5 h-5" />
                          <span className="text-sm">Like</span>
                        </button>
                        <button className={`flex items-center space-x-1 ${
                          darkMode ? 'text-gray-400 hover:text-green-400' : 'text-gray-500 hover:text-green-500'
                        }`}>
                          <FaComment className="w-5 h-5" />
                          <span className="text-sm">Comment</span>
                        </button>
                      </div>
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
                      <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
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
    </div>
  );
};

export default Profile;