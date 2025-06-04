import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiCheck } from 'react-icons/fi';

export default function Pricing() {
  const { darkMode } = useContext(DarkModeContext);

  const plans = [
    {
      name: "Free",
      price: "0",
      description: "Perfect for getting started",
      features: [
        "Basic profile customization",
        "Connect with up to 100 friends",
        "Basic messaging features",
        "Standard support",
        "Limited storage"
      ]
    },
    {
      name: "Pro",
      price: "9.99",
      description: "Best for power users",
      features: [
        "Advanced profile customization",
        "Unlimited friends",
        "Advanced messaging features",
        "Priority support",
        "Increased storage",
        "Ad-free experience",
        "Custom themes"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "29.99",
      description: "For businesses and organizations",
      features: [
        "Everything in Pro",
        "Team management",
        "Analytics dashboard",
        "API access",
        "Custom integrations",
        "Dedicated support",
        "Unlimited storage"
      ]
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Pricing Plans
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Choose the perfect plan for your needs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`p-8 rounded-xl ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300 ${
                plan.popular ? 'ring-2 ring-blue-500' : ''
              }`}
            >
              {plan.popular && (
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                }`}>
                  Most Popular
                </span>
              )}
              <h3 className={`text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                {plan.name}
              </h3>
              <div className="mb-4">
                <span className={`text-4xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                  ${plan.price}
                </span>
                <span className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  /month
                </span>
              </div>
              <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                {plan.description}
              </p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <FiCheck className={`w-5 h-5 mr-3 ${
                      darkMode ? 'text-blue-400' : 'text-blue-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                  plan.popular
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : darkMode
                    ? 'bg-gray-700 hover:bg-gray-600 text-white'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-900'
                }`}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 