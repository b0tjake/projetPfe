import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';

export default function Terms() {
  const { darkMode } = useContext(DarkModeContext);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: [
        "By accessing and using Jouala, you accept and agree to be bound by the terms and provision of this agreement.",
        "If you do not agree to abide by the above, please do not use this service."
      ]
    },
    {
      title: "2. Description of Service",
      content: [
        "Jouala provides a social networking platform for users to connect and interact.",
        "We reserve the right to modify, suspend, or discontinue any aspect of the service at any time.",
        "We may also impose limits on certain features and services or restrict your access to parts or all of the service without notice or liability."
      ]
    },
    {
      title: "3. User Accounts",
      content: [
        "You must be at least 13 years old to use this service.",
        "You are responsible for maintaining the confidentiality of your account and password.",
        "You agree to accept responsibility for all activities that occur under your account.",
        "We reserve the right to terminate accounts, remove or edit content, or cancel orders at our sole discretion."
      ]
    },
    {
      title: "4. User Conduct",
      content: [
        "You agree not to use the service to:",
        "• Post or transmit any unlawful, threatening, abusive, libelous, defamatory, obscene, vulgar, pornographic, profane or indecent information",
        "• Post or transmit any information that infringes any patent, trademark, trade secret, copyright or other proprietary rights",
        "• Post or transmit any information that contains a virus or other harmful component",
        "• Post or transmit any information that is false or misleading",
        "• Engage in any activity that interferes with or disrupts the service"
      ]
    },
    {
      title: "5. Intellectual Property",
      content: [
        "All content included on this site is the property of Jouala or its content suppliers and protected by international copyright laws.",
        "The compilation of all content on this site is the exclusive property of Jouala.",
        "You may not reproduce, modify, distribute, or republish materials contained on this site without our prior written permission."
      ]
    },
    {
      title: "6. Limitation of Liability",
      content: [
        "Jouala shall not be liable for any direct, indirect, incidental, special, consequential or exemplary damages.",
        "This includes, but is not limited to, damages for loss of profits, goodwill, use, data or other intangible losses.",
        "Some jurisdictions do not allow the exclusion of certain warranties or the limitation or exclusion of liability for incidental or consequential damages."
      ]
    },
    {
      title: "7. Modifications to Terms",
      content: [
        "We reserve the right to modify these terms at any time.",
        "We will notify users of any material changes by posting the new terms on this page.",
        "Your continued use of the service after such modifications will constitute your acknowledgment of the modified terms."
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Terms of Service
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
              <div className="space-y-4">
                {section.content.map((item, itemIndex) => (
                  <p
                    key={itemIndex}
                    className={`${darkMode ? 'text-gray-400' : 'text-gray-600'}`}
                  >
                    {item}
                  </p>
                ))}
              </div>
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
            If you have any questions about these Terms, please contact us:
          </p>
          <div className={`space-y-2 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p>Email: legal@jouala.com</p>
            <p>Phone: +1 (555) 123-4567</p>
            <p>Address: 123 Tech Street, San Francisco, CA 94107</p>
          </div>
        </div>
      </div>
    </div>
  );
} 