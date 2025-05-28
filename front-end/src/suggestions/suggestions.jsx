import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { jwtDecode } from "jwt-decode";
import { motion } from "framer-motion";
import { FaThumbsUp, FaThumbsDown, FaSearch, FaFilter } from "react-icons/fa";
import { DarkModeContext } from "../assets/darkmode";

export default function PlaceSuggestions() {
    const [placeData, setPlaceData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [errorMap, setErrorMap] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("rating");
    const token = localStorage.getItem("token");
    const { darkMode } = useContext(DarkModeContext);

    useEffect(() => {
        const getPlaces = async () => {
            try {
                setLoading(true);
                const res = await axios.post("http://localhost:5000/api/suggestions/getSuggestion");
                setPlaceData(res.data);
                setFilteredData(res.data);
            } catch (error) {
                console.error("Error fetching place data:", error);
            } finally {
                setLoading(false);
            }
        };
        getPlaces();
    }, []);

    useEffect(() => {
        if (token) {
            const decoded = jwtDecode(token);
            setUserId(decoded.id);
        }
    }, [token]);

    useEffect(() => {
        let filtered = [...placeData];
        
        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(place => 
                place.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                place.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Sort filter
        switch (sortBy) {
            case "rating":
                filtered.sort((a, b) => b.rating - a.rating);
                break;
            case "upvotes":
                filtered.sort((a, b) => b.upvoters.length - a.upvoters.length);
                break;
            case "cost":
                filtered.sort((a, b) => a.cost - b.cost);
                break;
            default:
                break;
        }

        setFilteredData(filtered);
    }, [searchTerm, sortBy, placeData]);

    const upVote = async (placeId) => {
        try {
            const res = await axios.post("http://localhost:5000/api/suggestions/upVote", {
                placeId,
                userId,
            });
            const updatedPlace = res.data.updatedPlace;

            setPlaceData((prevData) =>
                prevData.map((place) =>
                    place._id === placeId
                        ? {
                              ...place,
                              rating: updatedPlace.rating,
                              upvoters: updatedPlace.upvoters,
                              downvoters: updatedPlace.downvoters,
                          }
                        : place
                )
            );
            setErrorMap((prev) => ({ ...prev, [placeId]: null }));
        } catch (error) {
            setErrorMap((prev) => ({ ...prev, [placeId]: "You already upvoted this place" }));
        }
    };

    const downVote = async (placeId) => {
        try {
            const res = await axios.post("http://localhost:5000/api/suggestions/downVote", { placeId, userId });
            const updatedPlace = res.data.updatedPlace;

            setPlaceData((prevData) =>
                prevData.map((place) =>
                    place._id === placeId
                        ? {
                              ...place,
                              rating: updatedPlace.rating,
                              upvoters: updatedPlace.upvoters,
                              downvoters: updatedPlace.downvoters,
                          }
                        : place
                )
            );
            setErrorMap((prev) => ({ ...prev, [placeId]: null }));
        } catch (error) {
            setErrorMap((prev) => ({ ...prev, [placeId]: "You already downvoted this place" }));
        }
    };

    if (!token) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`text-center p-8 rounded-xl shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                >
                    <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-red-400' : 'text-red-600'}`}>Access Denied</h1>
                    <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Please log in to view suggestions</p>
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
            <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-16"
                >
                    <h1 className={`text-5xl font-bold mb-4 ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>Discover Amazing Places</h1>
                    <p className={`text-xl ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Explore and vote for your favorite destinations</p>
                </motion.div>

                <div className="mb-8 flex flex-col md:flex-row gap-4 justify-between items-center">
                    <div className="relative w-full md:w-96">
                        <input
                            type="text"
                            placeholder="Search places..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className={`w-full pl-10 pr-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100 placeholder-gray-400' : 'bg-white border-gray-300 text-black'}`}
                        />
                        <FaSearch className={`absolute left-3 top-3 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`w-full md:w-48 px-4 py-2 rounded-lg border focus:ring-2 focus:ring-blue-500 focus:border-transparent ${darkMode ? 'bg-gray-800 border-gray-700 text-gray-100' : 'bg-white border-gray-300 text-black'}`}
                    >
                        <option value="rating">Sort by Rating</option>
                        <option value="upvotes">Sort by Upvotes</option>
                        <option value="cost">Sort by Cost</option>
                    </select>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className={`animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 ${darkMode ? 'border-blue-400' : 'border-blue-500'}`}></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredData.map((place, index) => (
                            <motion.div
                                key={place._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className={`group relative rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl ${darkMode ? 'bg-gray-800' : 'bg-white'}`}
                            >
                                <div className="relative h-[300px]">
                                    <img
                                        src={`http://localhost:5000/${place.image}`}
                                        alt={place.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <h3 className="text-2xl font-bold text-white mb-2">{place.title}</h3>
                                        <p className="text-white/90 mb-4 line-clamp-3">{place.description}</p>
                                        <p className="text-white font-semibold mb-4">{place.cost} MAD</p>
                                        
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => upVote(place._id)}
                                                    className="text-white bg-green-500 hover:bg-green-600 p-2 rounded-full transition-colors"
                                                >
                                                    <FaThumbsUp />
                                                </motion.button>
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => downVote(place._id)}
                                                    className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full transition-colors"
                                                >
                                                    <FaThumbsDown />
                                                </motion.button>
                                            </div>
                                            <div className="text-white flex flex-col gap-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                                    <span>{place.upvoters.length} Upvotes</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                                    <span>{place.downvoters.length} Downvotes</span>
                                                </div>
                                            </div>
                                        </div>

                                        {errorMap[place._id] && (
                                            <motion.p
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                className="text-red-400 mt-2 text-sm"
                                            >
                                                {errorMap[place._id]}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
