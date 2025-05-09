import axios from "axios";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function PlaceSuggestions() {
    const [placeData, setPlaceData] = useState([]);
    const [userId, setUserId] = useState(null);
    const [errorMap, setErrorMap] = useState({}); // errorMap for each place
    const token = localStorage.getItem("token");

    // جلب الأماكن
    useEffect(() => {
        const getPlaces = async () => {
            try {
                const res = await axios.post("http://localhost:5000/api/suggestions/getSuggestion");
                setPlaceData(res.data);
            } catch (error) {
                console.error("Error fetching place data:", error);
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
//UPVOTE
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
//downvote
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

    return (
        <div className="min-h-screen bg-[#f3f4f6]">
            {token ? (
                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-blue-600 mb-4">Explore Places</h1>
                        <p className="text-xl text-gray-600">Discover new destinations and adventures</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {placeData.map((place) => (
                            <div
                                key={place._id}
                                className="group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105"
                            >
                                <div className="relative h-[300px]">
                                    <img
                                        src={`http://localhost:5000/${place.image}`}
                                        alt={place.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black opacity-15 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{place.title}</h3>
                                        <p className="text-white mb-4 line-clamp-3">{place.description}</p>
                                        <p className="text-white mb-4 line-clamp-3">{place.cost} MAD</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => upVote(place._id)}
                                                    className="text-white bg-green-500 hover:bg-green-700 px-3 py-1 rounded-full transition-colors"
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => downVote(place._id)}
                                                    className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full transition-colors"
                                                >
                                                    ↓
                                                </button>
                                            </div>
                                            <div className="text-white flex flex-col justify-start font-semibold">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                                                    <p className="flex justify-center items-center gap-4">
                                                        Upvotes: {place.upvoters.length}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <div className="w-4 h-4 rounded-full bg-red-500"></div>
                                                    <p className="flex justify-center items-center gap-4">
                                                        Downvotes: {place.downvoters.length}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {errorMap[place._id] && (
                                            <p className="text-red-500 mt-2">{errorMap[place._id]}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <h1 className="text-4xl font-bold text-center text-red-600 pt-32">You are not logged in</h1>
            )}
        </div>
    );
}
