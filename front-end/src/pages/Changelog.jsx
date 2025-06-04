import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';

export default function Changelog() {
  const { darkMode } = useContext(DarkModeContext);

  const changelog = [
    {
      version: "2.0.0",
      date: "March 15, 2024",
      changes: [
        {
          type: "New",
          items: [
            "Dark mode support",
            "Real-time messaging",
            "Profile customization",
            "Friend suggestions"
          ]
        },
        {
          type: "Improved",
          items: [
            "Enhanced search functionality",
            "Better mobile responsiveness",
            "Faster loading times"
          ]
        },
        {
          type: "Fixed",
          items: [
            "Profile picture upload issues",
            "Message notification bugs",
            "Friend request handling"
          ]
        }
      ]
    },
    {
      version: "1.5.0",
      date: "February 1, 2024",
      changes: [
        {
          type: "New",
          items: [
            "Photo sharing",
            "User profiles",
            "Basic messaging"
          ]
        },
        {
          type: "Improved",
          items: [
            "UI/UX design",
            "Performance optimization"
          ]
        },
        {
          type: "Fixed",
          items: [
            "Login issues",
            "Profile update bugs"
          ]
        }
      ]
    },
    {
      version: "1.0.0",
      date: "January 1, 2024",
      changes: [
        {
          type: "New",
          items: [
            "Initial release",
            "User authentication",
            "Basic social features"
          ]
        }
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Changelog
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Track our progress and see what's new
          </p>
        </div>

        <div className="space-y-12">
          {changelog.map((release, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  v{release.version}
                </h2>
                <span className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {release.date}
                </span>
              </div>

              <div className="space-y-6">
                {release.changes.map((change, changeIndex) => (
                  <div key={changeIndex}>
                    <h3 className={`text-lg font-semibold mb-3 ${
                      change.type === 'New'
                        ? darkMode ? 'text-green-400' : 'text-green-600'
                        : change.type === 'Improved'
                        ? darkMode ? 'text-blue-400' : 'text-blue-600'
                        : darkMode ? 'text-yellow-400' : 'text-yellow-600'
                    }`}>
                      {change.type}
                    </h3>
                    <ul className="space-y-2">
                      {change.items.map((item, itemIndex) => (
                        <li
                          key={itemIndex}
                          className={`flex items-start ${
                            darkMode ? 'text-gray-300' : 'text-gray-700'
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 