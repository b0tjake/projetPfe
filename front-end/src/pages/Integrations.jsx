import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiGithub, FiTwitter, FiInstagram, FiLinkedin } from 'react-icons/fi';

export default function Integrations() {
  const { darkMode } = useContext(DarkModeContext);

  const integrations = [
    {
      icon: <FiGithub className="w-8 h-8" />,
      title: "GitHub",
      description: "Connect your GitHub account to showcase your projects and contributions.",
      status: "Available"
    },
    {
      icon: <FiTwitter className="w-8 h-8" />,
      title: "Twitter",
      description: "Share your tweets and connect with your Twitter followers.",
      status: "Coming Soon"
    },
    {
      icon: <FiInstagram className="w-8 h-8" />,
      title: "Instagram",
      description: "Import your Instagram photos and connect with your Instagram followers.",
      status: "Coming Soon"
    },
    {
      icon: <FiLinkedin className="w-8 h-8" />,
      title: "LinkedIn",
      description: "Connect your professional network and import your work experience.",
      status: "Coming Soon"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Integrations
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Connect your favorite platforms and services
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {integrations.map((integration, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center">
                  <div className={`inline-flex items-center justify-center p-3 rounded-lg mr-4 ${
                    darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {integration.icon}
                  </div>
                  <div>
                    <h3 className={`text-xl font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                      {integration.title}
                    </h3>
                    <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {integration.description}
                    </p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  integration.status === 'Available'
                    ? darkMode
                      ? 'bg-green-500/10 text-green-400'
                      : 'bg-green-100 text-green-600'
                    : darkMode
                    ? 'bg-yellow-500/10 text-yellow-400'
                    : 'bg-yellow-100 text-yellow-600'
                }`}>
                  {integration.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 