import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [error, setError] = useState(null);
  const [saveChanges, setSaveChanges] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [profession, setProfession] = useState("");

  const { id } = useParams();
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      } catch (err) {
        console.error("Invalid token", err);
        setError("Invalid token");
      }
    } else {
      setError("Please login to view the profile");
    }
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/profile/${id}`);
        setUserData(res.data.user);
        setUserPosts(res.data.posts);
      } catch (err) {
        console.log(err);
        setError("Couldn't fetch user data");
      }
    };

    fetchUser();
  }, [id]);

  useEffect(() => {
    if (userData) {
      setBio(userData.bio || "");
      setCity(userData.city || "");
      setPhone(userData.phone || "");
      setProfession(userData.profession || "");
    }
  }, [userData]);

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/profile/saveChanges/${id}`, {
        bio,
        city,
        phone,
        profession,
      });
      setSaveChanges("Changes saved successfully!");
      setIsEditing(false);
      setTimeout(() => setSaveChanges(""), 3000);
    } catch (err) {
      console.log(err);
      setError("Couldn't save changes");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    setSaveChanges("");
  };

  if (error) return <div className="text-red-500 text-center py-10 text-lg">{error}</div>;
  if (!userData) return <div className="text-center mt-10 text-gray-600">Loading profile...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="relative bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl shadow-lg h-64 flex items-end px-8 pb-8">
        <div className="flex items-end gap-6">
          <div className="relative group">
            <img
              src={`http://localhost:5000/${userData.image}`}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
            />
            {decoded && userData._id === decoded.id && (
              <div className="absolute inset-0 rounded-full cursor-pointer bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                <span className="text-white text-sm hover:underline">Change</span>
              </div>
            )}
          </div>
          <div className="flex flex-col justify-center gap-2 selection:">
            <h1 className="text-3xl font-bold text-white">{userData.fullname}</h1>
            <p className="text-gray-50 text-sm">{bio || "No profession specified"}</p>
          </div>
        </div>
      </div>
  
      {/* Main Content */}
      <div className="mt-20 grid lg:grid-cols-3 gap-10">
        {/* Profile Info */}
        <div className="lg:col-span-2 bg-white shadow-md rounded-xl p-6 space-y-6">
          <div className="flex justify-between items-center border-b pb-4">
            <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
            {decoded && userData._id === decoded.id && (
              <button
                onClick={handleEditToggle}
                className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700 transition"
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </button>
            )}
          </div>
  
          {[
            ["Full Name", userData.fullname],
            ["Email", userData.email],
            ["Profession", profession, setProfession],
            ["Location", city, setCity],
            ["Phone", phone, setPhone],
            ["Bio", bio, setBio, true],
          ].map(([label, value, setter, isTextArea]) => (
            <div key={label} className="flex flex-col sm:flex-row sm:items-center gap-4">
              <label className="w-32 text-gray-600 font-medium">{label}</label>
              {isEditing && setter ? (
                isTextArea ? (
                  <textarea
                    className="flex-1 border rounded-lg px-3 py-2 min-h-[100px] focus:ring-2 focus:ring-indigo-500"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`Your ${label.toLowerCase()}`}
                  />
                ) : (
                  <input
                    className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                    value={value}
                    onChange={(e) => setter(e.target.value)}
                    placeholder={`Your ${label.toLowerCase()}`}
                  />
                )
              ) : (
                <div className="flex-1 text-gray-800 whitespace-pre-line">
                  {value || "Not specified"}
                </div>
              )}
            </div>
          ))}
  
          {isEditing && (
            <div className="pt-4 flex items-center gap-4">
              <button
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#006BA3] transition"
              >
                Save Changes
              </button>
              {saveChanges && <span className="text-green-600 text-sm">{saveChanges}</span>}
            </div>
          )}
        </div>
  
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Stats */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Activity Stats</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Posts</span>
                <span className="font-medium">{userPosts.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Member Since</span>
                <span className="font-medium">
                  {new Date(userData.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
  
          {/* Settings */}
          {decoded && userData._id === decoded.id && (
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Account Settings</h3>
              <div className="space-y-2 text-sm">
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Change Password
                </button>
                <button className="w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                  Privacy Settings
                </button>
                <button className="w-full text-left px-3 py-2 text-red-600 hover:bg-red-50 rounded-md">
                  Deactivate Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Posts */}
      <div className="mt-12 bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Posts</h2>
        {userPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {userPosts.map((post) => (
              <div
                key={post._id}
                className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition"
              >
                {post.image && (
                  <img
                    src={`http://localhost:5000/${post.image}`}
                    alt="Post"
                    className="w-full h-48 object-cover"
                  />
                )}
                <div className="p-5">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">{post.title}</h3>
                  <p className="text-gray-600 text-sm line-clamp-3">{post.content}</p>
                  <div className="mt-4 text-xs text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-10">
            <p>No posts yet. Start sharing your thoughts!</p>
            {decoded && userData._id === decoded.id && (
              <button className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                Create Your First Post
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
  
};

export default Profile;