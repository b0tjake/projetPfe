import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiPlay, FiClock, FiUser } from 'react-icons/fi';

export default function Tutorials() {
  const { darkMode } = useContext(DarkModeContext);

  const tutorials = [
    {
      title: "Getting Started with Social Features",
      description: "Learn how to create your profile, connect with friends, and start sharing content.",
      duration: "15 min",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Advanced Profile Customization",
      description: "Master the art of personalizing your profile with advanced settings and features.",
      duration: "20 min",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Content Creation Best Practices",
      description: "Learn how to create engaging content that resonates with your audience.",
      duration: "25 min",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Privacy and Security Settings",
      description: "Understand how to protect your privacy and secure your account.",
      duration: "18 min",
      level: "Beginner",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Advanced Messaging Features",
      description: "Discover all the powerful messaging features available on our platform.",
      duration: "22 min",
      level: "Advanced",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Building Your Network",
      description: "Learn strategies for growing your network and engaging with your community.",
      duration: "30 min",
      level: "Intermediate",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Tutorials
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Learn how to make the most of our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tutorials.map((tutorial, index) => (
            <div
              key={index}
              className={`rounded-xl overflow-hidden ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="relative h-48">
                <img
                  src={tutorial.image}
                  alt={tutorial.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className={`text-xl font-semibold mb-2 text-white`}>
                    {tutorial.title}
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {tutorial.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FiClock className={`w-4 h-4 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {tutorial.duration}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiUser className={`w-4 h-4 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {tutorial.level}
                    </span>
                  </div>
                </div>
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiPlay className="inline-block mr-2" />
                  Watch Tutorial
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 