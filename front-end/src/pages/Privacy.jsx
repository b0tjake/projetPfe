import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';

export default function Privacy() {
  const { darkMode } = useContext(DarkModeContext);

  const sections = [
    {
      title: "Information We Collect",
      content: [
        "Personal information (name, email, profile picture)",
        "Usage data and analytics",
        "Device information",
        "Location data (with your consent)",
        "Communication preferences"
      ]
    },
    {
      title: "How We Use Your Information",
      content: [
        "To provide and maintain our service",
        "To notify you about changes to our service",
        "To provide customer support",
        "To gather analysis or valuable information",
        "To monitor the usage of our service",
        "To detect, prevent and address technical issues"
      ]
    },
    {
      title: "Data Security",
      content: [
        "We implement appropriate security measures",
        "Regular security assessments",
        "Encryption of sensitive data",
        "Access controls and authentication",
        "Regular backups and disaster recovery"
      ]
    },
    {
      title: "Your Rights",
      content: [
        "Access your personal data",
        "Correct inaccurate data",
        "Request deletion of your data",
        "Object to data processing",
        "Data portability",
        "Withdraw consent"
      ]
    },
    {
      title: "Cookies and Tracking",
      content: [
        "Essential cookies for functionality",
        "Analytics cookies for improvement",
        "Marketing cookies (with consent)",
        "Third-party cookies",
        "Cookie preferences management"
      ]
    },
    {
      title: "Third-Party Services",
      content: [
        "Analytics providers",
        "Payment processors",
        "Cloud storage services",
        "Email service providers",
        "Social media platforms"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Privacy Policy
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Last updated: March 15, 2024
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {section.title}
              </h2>
              <ul className="space-y-4">
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

        <div className={`mt-12 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Contact Us
          </h2>
          <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            If you have any questions about this Privacy Policy, please contact us:
          </p>
          <div className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Email: privacy@jouala.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Tech Street, San Francisco, CA 94107</p>
          </div>
        </div>
      </div>
    </div>
  );
} 