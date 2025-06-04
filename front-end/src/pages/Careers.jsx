import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiBriefcase, FiMapPin, FiClock } from 'react-icons/fi';

export default function Careers() {
  const { darkMode } = useContext(DarkModeContext);

  const positions = [
    {
      title: "Senior Frontend Developer",
      location: "Remote",
      type: "Full-time",
      description: "We're looking for an experienced frontend developer to join our team and help build the next generation of social networking features.",
      requirements: [
        "5+ years of experience with React",
        "Strong knowledge of modern JavaScript",
        "Experience with state management (Redux, Context API)",
        "Understanding of responsive design principles"
      ]
    },
    {
      title: "Backend Developer",
      location: "Remote",
      type: "Full-time",
      description: "Join our backend team to build scalable and secure APIs that power our social networking platform.",
      requirements: [
        "3+ years of experience with Node.js",
        "Experience with MongoDB and SQL databases",
        "Understanding of RESTful API design",
        "Knowledge of authentication and authorization"
      ]
    },
    {
      title: "UX/UI Designer",
      location: "Remote",
      type: "Full-time",
      description: "Help us create beautiful and intuitive user experiences that delight our users.",
      requirements: [
        "4+ years of UI/UX design experience",
        "Proficiency in Figma or similar tools",
        "Strong portfolio showcasing web applications",
        "Experience with user research and testing"
      ]
    },
    {
      title: "DevOps Engineer",
      location: "Remote",
      type: "Full-time",
      description: "Join our DevOps team to help build and maintain our cloud infrastructure.",
      requirements: [
        "3+ years of DevOps experience",
        "Experience with AWS or similar cloud platforms",
        "Knowledge of containerization (Docker, Kubernetes)",
        "Understanding of CI/CD pipelines"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Careers
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Join our team and help shape the future of social networking
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {positions.map((position, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {position.title}
                </h2>
                <div className="flex items-center space-x-4 mt-4 md:mt-0">
                  <div className="flex items-center">
                    <FiMapPin className={`w-5 h-5 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {position.location}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className={`w-5 h-5 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {position.type}
                    </span>
                  </div>
                </div>
              </div>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {position.description}
              </p>
              <div className="mb-6">
                <h3 className={`text-lg font-semibold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {position.requirements.map((requirement, reqIndex) => (
                    <li
                      key={reqIndex}
                      className={`flex items-start ${
                        darkMode ? 'text-gray-300' : 'text-gray-700'
                      }`}
                    >
                      <span className="mr-2">•</span>
                      {requirement}
                    </li>
                  ))}
                </ul>
              </div>
              <button
                className={`w-full md:w-auto py-3 px-6 rounded-lg font-semibold transition-colors ${
                  darkMode
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                Apply Now
              </button>
            </div>
          ))}
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Why Join Us?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Remote First
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Work from anywhere in the world with our remote-first culture.
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Growth Opportunities
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Continuous learning and career development opportunities.
              </p>
            </div>
            <div>
              <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Great Benefits
              </h3>
              <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                Competitive salary, health insurance, and flexible time off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 