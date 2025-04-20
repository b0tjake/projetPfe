import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("please Login to see your profile");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUserData(decoded);
    } catch (err) {
      console.error("Invalid token", err);
      setError("Invalid token.");
    }
  }, []);

  if (error) return <div className="text-red-500 text-center py-10">{error}</div>;
  if (!userData) return <div className="text-center mt-10">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Profile Header */}
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
        <p className="text-lg text-gray-600 mb-1">
          {userData.profession}
        </p>
        <p className="text-sm text-gray-500 mb-4">{  userData.city}</p>

        <div className="bg-gray-50 rounded-xl shadow-inner p-6">
          <table className="table-auto w-full text-left text-sm text-gray-700">
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
                <td className="py-2">{userData.profession}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">City</td>
                <td className="py-2">{userData.city || "add a city where you live to your profile"}</td>
              </tr>
              <tr className="border-b">
                <td className="py-2 font-medium">Phone</td>
                <td className="py-2">{userData.phone || "add a phone number to your profile"}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">Bio</td>
                <td className="py-2">
                  {userData.bio ||
                    "add a BIO to your profile"}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex gap-4">
          <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
