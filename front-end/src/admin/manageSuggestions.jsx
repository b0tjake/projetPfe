import axios from "axios";
import { useEffect, useState } from "react";
import AdminSide from "./adminSide";
import { useNavigate } from "react-router-dom";

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
    <div className="flex min-h-screen bg-gray-50">
      <aside className="hidden md:block w-64 bg-white border-r shadow-md p-4">
        <AdminSide />
      </aside>

      <main className="flex-1 p-4 sm:p-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-10">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800 flex items-center gap-2">
              📝 Manage Suggestions
            </h1>
            <input
              onChange={(e) => setFindSuggestion(e.target.value)}
              type="text"
              placeholder="Search Suggestions..."
              className="border rounded-lg px-8 py-2"
            />
          </div>
          <button className="bg-blue-600 p-2.5 text-white font-medium rounded-md mb-2 hover:bg-blue-700" onClick={() => navigate("/addSuggestion")}>add Suggestion</button>
          <div className="overflow-x-auto mt-2 rounded-lg border">
            <table className="min-w-full bg-white text-sm text-left">
              <thead className="bg-gray-100 text-gray-700 uppercase">
                <tr>
                  <th className="px-4 py-3">🆔 ID</th>
                  <th className="px-4 py-3">📝 Title</th>
                  <th className="px-4 py-3">💬 Description</th>
                  <th className="px-4 py-3">📊 totalVote</th>
                  <th className="px-4 py-3">📈 Upvote Percentage</th>
                  <th className="px-4 py-3">⚙️ Actions</th>
                </tr>
              </thead>
              <tbody>
                {totSuggestions.map((suggestion, index) => (
                  <tr key={suggestion._id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono">{index + 1}</td>
                    <td className="px-4 py-3">{suggestion.title}</td>
                    <td className="px-4 py-3">{suggestion.description}</td>
                    <td className="px-4 py-3">{suggestion.upvoters.length + suggestion.downvoters.length}</td>
                    <td className="px-4 py-3">{totalVote(suggestion.upvoters.length , suggestion.downvoters.length)}</td>
                    <td className="px-4 py-3 space-y-2 sm:space-y-0 sm:space-x-2 flex flex-col sm:flex-row">
                     
                      <button
                        onClick={() => deleteSuggestion(suggestion._id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-center"
                      >
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
