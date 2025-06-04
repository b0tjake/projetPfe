import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiDownload, FiImage, FiFileText, FiUsers } from 'react-icons/fi';

export default function Press() {
  const { darkMode } = useContext(DarkModeContext);

  const pressReleases = [
    {
      title: "Jouala Launches New Social Platform",
      date: "March 15, 2024",
      description: "Jouala announces the launch of its innovative social networking platform, bringing people together in new ways.",
      link: "#"
    },
    {
      title: "Jouala Raises $10M in Series A Funding",
      date: "February 1, 2024",
      description: "Leading investors back Jouala's vision for the future of social networking with a $10M Series A investment.",
      link: "#"
    },
    {
      title: "Jouala Partners with Major Tech Companies",
      date: "January 15, 2024",
      description: "Strategic partnerships announced to enhance platform capabilities and user experience.",
      link: "#"
    }
  ];

  const mediaKit = {
    logo: {
      title: "Logo",
      description: "Download our logo in various formats and sizes",
      icon: <FiImage className="w-6 h-6" />
    },
    screenshots: {
      title: "Screenshots",
      description: "High-resolution screenshots of our platform",
      icon: <FiImage className="w-6 h-6" />
    },
    brandGuidelines: {
      title: "Brand Guidelines",
      description: "Our brand guidelines and style guide",
      icon: <FiFileText className="w-6 h-6" />
    },
    teamPhotos: {
      title: "Team Photos",
      description: "Photos of our leadership team",
      icon: <FiUsers className="w-6 h-6" />
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Press
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Latest news and media resources
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 mb-16">
          {pressReleases.map((release, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {release.title}
                </h2>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {release.date}
                </span>
              </div>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {release.description}
              </p>
              <a
                href={release.link}
                className={`inline-flex items-center text-blue-500 hover:text-blue-600`}
              >
                Read More
                <FiDownload className="ml-2 w-4 h-4" />
              </a>
            </div>
          ))}
        </div>

        <div className={`p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Media Kit
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(mediaKit).map(([key, item]) => (
              <div
                key={key}
                className={`p-6 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                  darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  {item.icon}
                </div>
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {item.title}
                </h3>
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {item.description}
                </p>
                <button
                  className={`inline-flex items-center px-4 py-2 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <FiDownload className="mr-2 w-4 h-4" />
                  Download
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Press Contact
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            For press inquiries, please contact our press team:
          </p>
          <div className={`space-y-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Email: press@jouala.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Tech Street, San Francisco, CA 94107</p>
          </div>
          <div className="mt-6">
            <button
              className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Download Press Kit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 