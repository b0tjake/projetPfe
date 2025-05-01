import { useEffect, useState, useRef } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import axios from "axios";
import gsap from "gsap";

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
  const [showPosts, setShowPosts] = useState(false);

  const infoRef = useRef(null);
  const postRef = useRef(null);

  const { id } = useParams();
  const [decoded, setDecoded] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setDecoded(decodedToken);
      } catch (err) {
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

  useEffect(() => {
    if (showPosts) {
      gsap.fromTo(
        postRef.current,
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo('.showPo',
        { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    } else {
      gsap.fromTo(
        infoRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" }
      );
      gsap.fromTo(".showPr", 
        { x: 100, opacity: 0 }, { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" });
    }
  }, [showPosts]);

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
    <div className="w-full mx-auto bg-[#f3f4f6] py-10">
      <div className="w-2/3 mx-auto px-4">
        {/* Header */}
        <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-lg h-64 flex items-end px-8 pb-8">
          <div className="flex items-end gap-6">
            <div className="relative group cursor-pointer">
              <img
                src={`http://localhost:5000/${userData.image}`}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
              />
              {decoded && userData._id === decoded.id && (
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-sm hover:underline">Change</span>
                </div>
              )}
            </div>
            <div className="flex flex-col justify-center gap-2">
              <h1 className="text-3xl font-bold text-white">{userData.fullname}</h1>
              <p className="text-gray-50 text-sm">{  bio === "add a BIO to your profile" ? "" : bio|| "No profession specified"}</p>
            </div>
          </div>
        </div>

        {/* Toggle Buttons */}
        <div className="flex justify-center mt-10 gap-4">
          <button
            onClick={() => setShowPosts(false)}
            className={`w-1/2 px-6 py-3 text-black font-semibold `}
          >
            
            Profile Info
            <div className={`w-full px-6 py-3 text-black font-semibold ${
              !showPosts ? "flex border-b-2 border-black showPr" : "flex border-b-2 border-grey-200"
            }`} ></div>
          </button>
          <button
            onClick={() => setShowPosts(true)}
            className={`w-1/2 px-6 py-3 text-black font-semibold `}
          >
            Posts
            <div className={`w-full px-6 py-3 text-black font-semibold ${
              showPosts ? "flex border-b-2 border-black showPo" : "flex border-b-2 border-grey-200"
            }`} ></div>
          </button>
        </div>

        {/* Profile Info */}
        <div ref={infoRef} className={`mt-10 ${showPosts ? "hidden" : "block"}`}>
          <div className="bg-white shadow-md rounded-xl p-6 space-y-6">
            <div className="flex justify-between items-center border-b pb-4">
              <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              {decoded && userData._id === decoded.id && (
                <button
                  onClick={handleEditToggle}
                  className="text-sm px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200 text-gray-700"
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
                    />
                  ) : (
                    <input
                      className="flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                    />
                  )
                ) : (
                  <div className="flex-1 text-gray-800 whitespace-pre-line">{value || "Not specified"}</div>
                )}
              </div>
            ))}

            {isEditing && (
              <div className="pt-4 flex items-center gap-4">
                <button
                  onClick={handleSaveChanges}
                  className="px-6 py-2 bg-[#0077B6] text-white rounded-lg hover:bg-[#006BA3]"
                >
                  Save Changes
                </button>
                {saveChanges && <span className="text-green-600 text-sm">{saveChanges}</span>}
              </div>
            )}
          </div>
        </div>

        {/* Posts */}
        <div ref={postRef} className={`mt-10 ${showPosts ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" : "hidden"}`}>
          {userPosts.length > 0 ? (
            userPosts.map((post) => (
              <div key={post._id} className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="flex items-center gap-3 p-4">
                  <img
                    src={`http://localhost:5000/${userData.image}`}
                    alt="User"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold">{userData.fullname}</p>
                    <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                {post.image && (
                  <img src={`http://localhost:5000/${post.image}`} alt="Post" className="w-full h-48 object-cover" />
                )}
                <div className="p-4">
                  <p className="text-gray-800 text-sm mb-2">{post.content}</p>
                  <div className="flex justify-between text-sm text-gray-500 mt-4">
                    <button className="hover:text-indigo-600">❤️ Like</button>
                    <button className="hover:text-indigo-600">💬 Comment</button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full py-10">
              <p>No posts yet. Start sharing your thoughts!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
