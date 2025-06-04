import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiBook, FiCode, FiDatabase, FiServer } from 'react-icons/fi';

export default function Documentation() {
  const { darkMode } = useContext(DarkModeContext);

  const sections = [
    {
      icon: <FiBook className="w-8 h-8" />,
      title: "Getting Started",
      description: "Learn the basics of our platform and how to get started.",
      topics: [
        "Introduction",
        "Installation",
        "Configuration",
        "First Steps"
      ]
    },
    {
      icon: <FiCode className="w-8 h-8" />,
      title: "API Reference",
      description: "Detailed documentation of our API endpoints and methods.",
      topics: [
        "Authentication",
        "User Management",
        "Content Management",
        "Search API"
      ]
    },
    {
      icon: <FiDatabase className="w-8 h-8" />,
      title: "Data Models",
      description: "Understand our data structure and relationships.",
      topics: [
        "User Model",
        "Post Model",
        "Comment Model",
        "Relationship Model"
      ]
    },
    {
      icon: <FiServer className="w-8 h-8" />,
      title: "Deployment",
      description: "Learn how to deploy and scale your application.",
      topics: [
        "Server Setup",
        "Environment Variables",
        "Scaling",
        "Monitoring"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Documentation
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Everything you need to know about our platform
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {section.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {section.description}
              </p>
              <ul className="space-y-2">
                {section.topics.map((topic, topicIndex) => (
                  <li
                    key={topicIndex}
                    className={`flex items-center ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}
                  >
                    <span className="mr-2">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Need Help?
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <button
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              darkMode
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            Contact Support
          </button>
        </div>
      </div>
    </div>
  );
} 