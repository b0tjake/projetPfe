import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiHelpCircle, FiMail, FiMessageSquare, FiBook } from 'react-icons/fi';

export default function Support() {
  const { darkMode } = useContext(DarkModeContext);

  const supportOptions = [
    {
      icon: <FiHelpCircle className="w-8 h-8" />,
      title: "Help Center",
      description: "Browse our comprehensive help articles and guides.",
      link: "/documentation"
    },
    {
      icon: <FiMail className="w-8 h-8" />,
      title: "Email Support",
      description: "Get in touch with our support team via email.",
      link: "mailto:support@jouala.com"
    },
    {
      icon: <FiMessageSquare className="w-8 h-8" />,
      title: "Live Chat",
      description: "Chat with our support team in real-time.",
      link: "#"
    },
    {
      icon: <FiBook className="w-8 h-8" />,
      title: "Documentation",
      description: "Access our detailed technical documentation.",
      link: "/documentation"
    }
  ];

  const faqs = [
    {
      question: "How do I reset my password?",
      answer: "You can reset your password by clicking on the 'Forgot Password' link on the login page. Follow the instructions sent to your email to create a new password."
    },
    {
      question: "How can I delete my account?",
      answer: "To delete your account, go to Settings > Account > Delete Account. Please note that this action is irreversible and all your data will be permanently deleted."
    },
    {
      question: "How do I report inappropriate content?",
      answer: "You can report inappropriate content by clicking the three dots menu on any post and selecting 'Report'. Our team will review the report and take appropriate action."
    },
    {
      question: "How can I change my profile picture?",
      answer: "To change your profile picture, go to your profile page and click on your current profile picture. You can then upload a new image from your device."
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Support
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            We're here to help you
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {supportOptions.map((option, index) => (
            <a
              key={index}
              href={option.link}
              className={`p-6 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className={`inline-flex items-center justify-center p-3 rounded-lg mb-4 ${
                darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
              }`}>
                {option.icon}
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {option.title}
              </h3>
              <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {option.description}
              </p>
            </a>
          ))}
        </div>

        <div className={`p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-8 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`p-6 rounded-lg ${
                  darkMode ? 'bg-gray-700' : 'bg-gray-50'
                }`}
              >
                <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  {faq.question}
                </h3>
                <p className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Still Need Help?
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Contact our support team and we'll get back to you as soon as possible.
          </p>
          <form className="space-y-4">
            <div>
              <label className={`block mb-2 ${darkMode ? 'text-white' : 'text-gray-700'}`}>
                Name
              </label>
              <input
                type="text"
                className={`w-full px-4 py-2 rounded-lg ${
                  darkMode
                    ? 'bg-gray-700 text-white placeholder-gray-400'
                    : 'bg-gray-100 text-gray-900 placeholder-gray-500'
                }`}
                placeholder="Your name"
              />
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
                placeholder="Your email"
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
                placeholder="How can we help you?"
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