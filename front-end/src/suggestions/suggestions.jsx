import axios from "axios";
import { useEffect, useState } from "react";

export default function PlaceSuggestions() {
    const [placeData, setPlaceData] = useState([]);

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

    const token = localStorage.getItem("token");

    return (
        <div className="min-h-screen bg-gradient-to-br from-bg1 to-bg2">
            {token ? (
                <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h1 className="text-5xl font-bold text-blue-600 mb-4">Explore Places</h1>
                        <p className="text-xl text-gray-600">Discover new destinations and adventures</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {placeData.map((place, index) => (
                            <div
                                key={place._id}
                                className={`group relative bg-white rounded-lg shadow-md overflow-hidden transform transition-all duration-500 hover:scale-105`}
                            >
                                <div className="relative h-[300px]">  {/* Ensuring a fixed height for all images */}
                                    <img
                                        src={`http://localhost:5000/${place.image}`}
                                        alt={place.title}
                                        className="w-full h-full object-cover transform transition-all duration-300"
                                        onError={(e) => {
                                            e.currentTarget.src = 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=800';
                                        }}
                                    />
                                    <div className="absolute inset-0 bg-black opacity-15 group-hover:opacity-40 transition-opacity duration-300"></div>
                                    <div className="absolute inset-0 flex flex-col justify-end p-6 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                        <h3 className="text-2xl font-semibold text-white mb-2">{place.title}</h3>
                                        <p className="text-white mb-4 line-clamp-3">{place.description}</p>
                                        <p className="text-white mb-4 line-clamp-3">{place.cost} MAD</p>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center space-x-2">
                                                <button className="text-white bg-green-500 hover:bg-green-700 px-3 py-1 rounded-full transition-colors">
                                                    ↑
                                                </button>
                                                <button className="text-white bg-red-500 hover:bg-red-700 px-3 py-1 rounded-full transition-colors">
                                                    ↓
                                                </button>
                                            </div>
                                        </div>
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
