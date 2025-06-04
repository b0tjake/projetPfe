import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiUsers, FiMessageSquare, FiImage, FiBell, FiSettings } from 'react-icons/fi';

export default function Features() {
  const { darkMode } = useContext(DarkModeContext);

  const features = [
    {
      icon: <FiUsers className="w-8 h-8" />,
      title: "Social Connections",
      description: "Connect with friends, family, and colleagues. Build your network and stay connected with the people who matter most."
    },
    {
      icon: <FiMessageSquare className="w-8 h-8" />,
      title: "Real-time Messaging",
      description: "Chat with your connections instantly. Share messages, photos, and more in real-time conversations."
    },
    {
      icon: <FiImage className="w-8 h-8" />,
      title: "Photo Sharing",
      description: "Share your moments with the world. Upload and share photos with your network."
    },
    {
      icon: <FiBell className="w-8 h-8" />,
      title: "Smart Notifications",
      description: "Stay updated with real-time notifications about friend requests, messages, and more."
    },
    {
      icon: <FiSettings className="w-8 h-8" />,
      title: "Customizable Profile",
      description: "Personalize your profile with photos, bio, and preferences to express yourself."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Features
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Discover what makes our social network unique
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 