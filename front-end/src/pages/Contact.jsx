import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiMail, FiPhone, FiMapPin, FiClock } from 'react-icons/fi';

export default function Contact() {
  const { darkMode } = useContext(DarkModeContext);

  const contactInfo = [
    {
      icon: <FiMail className="w-6 h-6" />,
      title: "Email",
      details: ["support@jouala.com", "press@jouala.com"],
      link: "mailto:support@jouala.com"
    },
    {
      icon: <FiPhone className="w-6 h-6" />,
      title: "Phone",
      details: ["+1 (555) 123-4567", "+1 (555) 987-6543"],
      link: "tel:+15551234567"
    },
    {
      icon: <FiMapPin className="w-6 h-6" />,
      title: "Office",
      details: ["123 Tech Street", "San Francisco, CA 94107"],
      link: "https://maps.google.com"
    },
    {
      icon: <FiClock className="w-6 h-6" />,
      title: "Hours",
      details: ["Monday - Friday: 9am - 6pm", "Saturday - Sunday: Closed"],
      link: "#"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Contact Us
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Get in touch with our team
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {contactInfo.map((info, index) => (
            <a
              key={index}
              href={info.link}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {info.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {info.title}
              </h3>
              {info.details.map((detail, detailIndex) => (
                <p
                  key={detailIndex}
                  className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                >
                  {detail}
                </p>
              ))}
            </a>
          ))}
        </div>

        <div className={`p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-6 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Send us a Message
          </h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  First Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="John"
                />
              </div>
              <div>
                <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                  Last Name
                </label>
                <input
                  type="text"
                  className={`w-full px-4 py-2 rounded-lg ${
                    darkMode
                      ? 'bg-gray-700 text-white placeholder-gray-400'
                      : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                  }`}
                  placeholder="Doe"
                />
              </div>
            </div>
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Email
              </label>
              <input
                type="email"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Subject
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="How can we help you?"
              />
            </div>
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Message
              </label>
              <textarea
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                rows="4"
                placeholder="Your message..."
              />
            </div>
            <button
              className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
} 