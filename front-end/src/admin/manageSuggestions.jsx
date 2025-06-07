import axios from "axios";
import { useEffect, useState } from "react";
import AdminSide from "./adminSide";
import { useNavigate } from "react-router-dom";
import { FiSearch, FiPlus, FiTrash2, FiMessageSquare, FiList, FiThumbsUp, FiPercent, FiSettings } from "react-icons/fi";

export default function ManageSuggestions() {
  const [suggestions, setSuggestions] = useState([]);
  const [findSuggestion, setFindSuggestion] = useState("");
  const [totSuggestions, setTotSuggestions] = useState([]);
const navigate = useNavigate()
  // Fetching all suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/suggestions/getSuggestion");
        setSuggestions(res.data);
        
      } catch (err) {
        console.log(err);
      }
    };
    fetchSuggestions();
  }, []);

  // Filtering suggestions
  useEffect(() => {
    if (findSuggestion === "") {
      setTotSuggestions(suggestions);
    } else {
      const filteredSuggestions = suggestions.filter((suggestion) =>
        suggestion.title.toLowerCase().includes(findSuggestion.toLowerCase()) ||
        suggestion.description.toLowerCase().includes(findSuggestion.toLowerCase())
      );
      setTotSuggestions(filteredSuggestions);
    }
  }, [findSuggestion, suggestions]);


  // Delete suggestion
  const deleteSuggestion = async (suggestionId) => {
    const confirmed = window.confirm("Are you sure you want to delete this suggestion?");
    if (confirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/suggestions/${suggestionId}`);
        setSuggestions((prevSuggestions) => prevSuggestions.filter((suggestion) => suggestion._id !== suggestionId));
      } catch (err) {
        console.log(err);
      }
    }
  };
const totalVote = (upVote,downVote) => {
  const totalVotes = upVote + downVote;
    const upVotePercentage = totalVotes === 0 ? 0 : (upVote / totalVotes) * 100;
    return `${upVotePercentage.toFixed(2)}%`;
}
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-lg p-4">
        <AdminSide />
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl p-6 sm:p-10 border border-gray-100">
          {/* Header with Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg">
                <FiMessageSquare className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Manage Suggestions
                </h1>
                <p className="text-sm text-gray-500 mt-1">Review and manage user suggestions</p>
              </div>
            </div>
            <div className="relative w-full sm:w-auto">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                onChange={(e) => setFindSuggestion(e.target.value)}
                type="text"
                placeholder="Search Suggestions..."
                className="pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all w-full sm:w-64 bg-white/50 backdrop-blur-sm"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Suggestions</p>
                  <h3 className="text-2xl font-bold mt-1">{totSuggestions.length}</h3>
                </div>
                <FiList className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Total Votes</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {totSuggestions.reduce((acc, curr) => acc + curr.upvoters.length + curr.downvoters.length, 0)}
                  </h3>
                </div>
                <FiThumbsUp className="w-8 h-8 opacity-80" />
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm opacity-80">Average Upvote %</p>
                  <h3 className="text-2xl font-bold mt-1">
                    {totSuggestions.length > 0 
                      ? (totSuggestions.reduce((acc, curr) => {
                          const total = curr.upvoters.length + curr.downvoters.length;
                          return acc + (total > 0 ? (curr.upvoters.length / total) * 100 : 0);
                        }, 0) / totSuggestions.length).toFixed(1)
                      : 0}%
                  </h3>
                </div>
                <FiPercent className="w-8 h-8 opacity-80" />
              </div>
            </div>
          </div>

          {/* Add Suggestion Button */}
          <button 
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 p-3 text-white font-medium rounded-xl mb-6 hover:from-indigo-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
            onClick={() => navigate("/addSuggestion")}
          >
            <FiPlus className="w-5 h-5" />
            Add Suggestion
          </button>

          {/* Table Section */}
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-lg bg-white/50 backdrop-blur-sm">
            <table className="min-w-full text-sm text-left">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 text-gray-700 uppercase rounded-t-2xl">
                <tr>
                  <th className="px-6 py-4 font-semibold rounded-tl-2xl">ID</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Description</th>
                  <th className="px-6 py-4 font-semibold">Total Votes</th>
                  <th className="px-6 py-4 font-semibold">Upvote %</th>
                  <th className="px-6 py-4 font-semibold rounded-tr-2xl">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {totSuggestions.map((suggestion, index) => (
                  <tr key={suggestion._id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono text-gray-600">{index + 1}</td>
                    <td className="px-6 py-4 font-medium text-gray-800">{suggestion.title}</td>
                    <td className="px-6 py-4 text-gray-600">{suggestion.description}</td>
                    <td className="px-6 py-4 text-gray-600">{suggestion.upvoters.length + suggestion.downvoters.length}</td>
                    <td className="px-6 py-4 text-gray-600">{totalVote(suggestion.upvoters.length, suggestion.downvoters.length)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => deleteSuggestion(suggestion._id)}
                        className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-xl hover:from-red-600 hover:to-pink-700 transition-all shadow-sm hover:shadow"
                      >
                        <FiTrash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
