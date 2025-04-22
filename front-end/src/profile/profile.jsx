import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { useParams } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);
  const [saveChanges, setSaveChanges] = useState("");

  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [phone, setPhone] = useState("");
  const [Profession, setProfession] = useState("");

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
      setProfession(userData.Profession || "");
    }
  }, [userData]);

  const handleSaveChanges = async () => {
    try {
      await axios.put(`http://localhost:5000/api/profile/saveChanges/${id}`, {
        bio,
        city,
        phone,
        Profession,
      });
      setSaveChanges("Changes saved successfully!");
    } catch (err) {
      console.log(err);
      setError("Couldn't save changes");
    }
  };

  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-xl overflow-hidden">
      <div className="relative bg-gradient-to-r from-orange-400 to-orange-600 h-48">
        <div className="absolute bottom-[-2rem] left-8 flex items-center gap-4">
          <img
            className="w-36 h-36 rounded-full border-4 border-white object-cover shadow-lg"
            src={`http://localhost:5000/${userData.image}`}
            alt="User Profile"
          />
          <div>
            <span className="text-gray-50 text-3xl font-semibold">@{userData.username}</span>
          </div>
        </div>
      </div>

      <div className="pt-20 px-8 pb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">{userData.fullname}</h2>

        <div className="bg-gray-50 rounded-xl shadow-inner p-6">
          <table className="w-full text-left text-sm text-gray-700">
            <tbody>
              <tr className="border-b">
                <td className="py-2 font-medium w-1/3">Full Name</td>
                <td className="py-2">{userData.fullname}</td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-medium">Email</td>
                <td className="py-2">{userData.email}</td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-medium">Profession</td>
                <td className="py-2">
                  {decoded && userData._id === decoded.id ? (
                    <input
                      type="text"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                      value={Profession}
                      onChange={(e) => setProfession(e.target.value)}
                      placeholder="Enter your profession"
                    />
                  ) : (
                    userData.Profession === "add your profession to your profile" ? "" : userData.Profession
                  )}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-medium">City</td>
                <td className="py-2">
                  {decoded && userData._id === decoded.id ? (
                    <input
                      type="text"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Enter your city"
                    />
                  ) : (
                    userData.city === "add a city where you live to your profile" ? "" : userData.city
                  )}
                </td>
              </tr>

              <tr className="border-b">
                <td className="py-2 font-medium">Phone</td>
                <td className="py-2">
                  {decoded && userData._id === decoded.id ? (
                    <input
                      type="text"
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="Enter your phone number"
                    />
                  ) : (
                    userData.phone === "add a phone number to your profile" ? "" : userData.phone
                  )}
                </td>
              </tr>

              <tr>
                <td className="py-2 font-medium">Bio</td>
                <td className="py-2">
                  {decoded && userData._id === decoded.id ? (
                    <textarea
                      className="w-full text-sm text-gray-700 border border-gray-300 rounded-lg px-2 py-1 focus:outline-none resize-none overflow-hidden"
                      value={bio}
                      onChange={(e) => {
                        setBio(e.target.value);
                        e.target.style.height = "auto";
                        e.target.style.height = `${e.target.scrollHeight}px`;
                      }}
                      placeholder="Enter your bio"
                      rows={1}
                    />
                  ) : (
                    userData.bio === "add a BIO to your profile" ? "" : userData.bio
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {decoded && userData._id === decoded.id && (
          <div className="mt-6 flex flex-col gap-4">
            <button
              onClick={handleSaveChanges}
              className="bg-green-500 text-white w-40 px-6 py-2 rounded-lg hover:bg-green-600"
            >
              Save Changes
            </button>
            {saveChanges && <span className="text-green-500">{saveChanges}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
