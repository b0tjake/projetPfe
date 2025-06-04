import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiDownload, FiTrash2, FiEdit, FiEye, FiShare2, FiLock } from 'react-icons/fi';

export default function GDPR() {
  const { darkMode } = useContext(DarkModeContext);

  const rights = [
    {
      icon: <FiEye className="w-6 h-6" />,
      title: "Right to Access",
      description: "You have the right to request a copy of your personal data and information about how it is processed."
    },
    {
      icon: <FiEdit className="w-6 h-6" />,
      title: "Right to Rectification",
      description: "You can request corrections to your personal data if it is inaccurate or incomplete."
    },
    {
      icon: <FiTrash2 className="w-6 h-6" />,
      title: "Right to Erasure",
      description: "You can request the deletion of your personal data in certain circumstances."
    },
    {
      icon: <FiLock className="w-6 h-6" />,
      title: "Right to Restrict Processing",
      description: "You can request that we limit the processing of your personal data in certain circumstances."
    },
    {
      icon: <FiDownload className="w-6 h-6" />,
      title: "Right to Data Portability",
      description: "You can request a copy of your data in a structured, commonly used format."
    },
    {
      icon: <FiShare2 className="w-6 h-6" />,
      title: "Right to Object",
      description: "You can object to the processing of your personal data in certain circumstances."
    }
  ];

  const dataProcessing = [
    {
      title: "Data Collection",
      content: [
        "Personal identification information",
        "Contact information",
        "Profile data",
        "Usage data",
        "Device information"
      ]
    },
    {
      title: "Legal Basis",
      content: [
        "Contractual necessity",
        "Legal obligation",
        "Legitimate interests",
        "Consent",
        "Vital interests"
      ]
    },
    {
      title: "Data Retention",
      content: [
        "Account data: Until account deletion",
        "Usage data: 2 years",
        "Cookies: 1 year",
        "Marketing data: Until consent withdrawal",
        "Backup data: 30 days"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            GDPR Compliance
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your data protection rights under the General Data Protection Regulation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {rights.map((right, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {right.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {right.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {right.description}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {dataProcessing.map((section, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.content.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className={`flex items-start ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <span className="mr-2">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Exercise Your Rights
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            To exercise any of your GDPR rights, please contact our Data Protection Officer:
          </p>
          <div className={`space-y-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Email: dpo@jouala.com</p>
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
              Request Data Access
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 