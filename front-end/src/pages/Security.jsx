import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiShield, FiLock, FiAlertCircle, FiKey, FiUserCheck, FiRefreshCw } from 'react-icons/fi';

export default function Security() {
  const { darkMode } = useContext(DarkModeContext);

  const securityFeatures = [
    {
      icon: <FiShield className="w-6 h-6" />,
      title: "Data Protection",
      description: "We use industry-standard encryption to protect your data both in transit and at rest.",
      details: [
        "End-to-end encryption for messages",
        "Secure data storage",
        "Regular security audits",
        "Data backup and recovery"
      ]
    },
    {
      icon: <FiLock className="w-6 h-6" />,
      title: "Account Security",
      description: "Multiple layers of security to protect your account from unauthorized access.",
      details: [
        "Two-factor authentication",
        "Login notifications",
        "Session management",
        "Password strength requirements"
      ]
    },
    {
      icon: <FiAlertCircle className="w-6 h-6" />,
      title: "Threat Detection",
      description: "Advanced systems to detect and prevent security threats.",
      details: [
        "Real-time monitoring",
        "Automated threat detection",
        "Suspicious activity alerts",
        "DDoS protection"
      ]
    },
    {
      icon: <FiKey className="w-6 h-6" />,
      title: "Access Control",
      description: "Granular control over who can access your data and how.",
      details: [
        "Role-based access control",
        "Permission management",
        "API security",
        "IP restrictions"
      ]
    },
    {
      icon: <FiUserCheck className="w-6 h-6" />,
      title: "Privacy Controls",
      description: "Tools to help you manage your privacy and data sharing preferences.",
      details: [
        "Privacy settings",
        "Data sharing controls",
        "Cookie preferences",
        "Opt-out options"
      ]
    },
    {
      icon: <FiRefreshCw className="w-6 h-6" />,
      title: "Regular Updates",
      description: "Continuous improvements to our security infrastructure.",
      details: [
        "Security patches",
        "Feature updates",
        "Vulnerability assessments",
        "Compliance monitoring"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Security
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Your security is our top priority
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {feature.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {feature.title}
              </h3>
              <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {feature.description}
              </p>
              <ul className="space-y-2">
                {feature.details.map((detail, detailIndex) => (
                  <li
                    key={detailIndex}
                    className={`flex items-start ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}
                  >
                    <span className="mr-2">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Report a Security Issue
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            If you've discovered a security vulnerability, please report it to our security team.
            We take all security issues seriously and will respond as quickly as possible.
          </p>
          <div className={`space-y-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Email: security@jouala.com</p>
            <p>PGP Key: <a href="#" className="text-blue-500 hover:text-blue-600">Download</a></p>
            <p>Bug Bounty Program: <a href="#" className="text-blue-500 hover:text-blue-600">Learn More</a></p>
          </div>
        </div>
      </div>
    </div>
  );
} 