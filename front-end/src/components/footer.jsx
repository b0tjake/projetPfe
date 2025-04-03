import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white relative overflow-hidden">
      <div className="relative max-w-8xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-6">
          <div className="lg:col-span-4">
            <div className="flex items-center mb-8">
              <div className="bg-[#F4A261] p-3 rounded-xl mr-4 shadow-lg">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-bold tracking-tight">
                Jou<span className="text-[#F4A261]">ala</span>
              </h2>
            </div>
            <p className="text-lg text-gray-100 mb-8 max-w-md">
              Revolutionizing social interactions with cutting-edge technology
              and human-centered design.
            </p>
            <div className="flex justify-center grid-cols-3 space-x-2 mb-8">
              {["apple", "google", "windows"].map((store) => (
                <button
                  key={store}
                  className="hover:bg-[#222831] bg-white/10 backdrop-blur-md px-4 py-3 rounded-lg flex items-center transition-all"
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
                  </svg>
                  <div className="text-left">
                    <div className="text-xs text-gray-300">Download on</div>
                    <div className="font-medium capitalize">{store}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-6 text-[#F4A261] border-b border-[#F4A261]/30 pb-2">
                Product
              </h3>
              <ul className="space-y-4">
                {["Features", "Integrations", "Pricing", "Changelog"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase()}`}
                        className="text-gray-200 hover:text-white text-lg transition-colors block"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-[#F4A261] border-b border-[#F4A261]/30 pb-2">
                Resources
              </h3>
              <ul className="space-y-4">
                {["Documentation", "Tutorials", "Blog", "Support"].map(
                  (item) => (
                    <li key={item}>
                      <Link
                        to={`/${item.toLowerCase()}`}
                        className="text-gray-200 hover:text-white text-lg transition-colors block"
                      >
                        {item}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-[#F4A261] border-b border-[#F4A261]/30 pb-2">
                Company
              </h3>
              <ul className="space-y-4">
                {["About", "Careers", "Press", "Contact"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-200 hover:text-white text-lg transition-colors block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-6 text-[#F4A261] border-b border-[#F4A261]/30 pb-2">
                Legal
              </h3>
              <ul className="space-y-4">
                {["Privacy", "Terms", "Security", "GDPR"].map((item) => (
                  <li key={item}>
                    <Link
                      to={`/${item.toLowerCase()}`}
                      className="text-gray-200 hover:text-white text-lg transition-colors block"
                    >
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="p-8 flex flex-col items-center text-center"
        >
          <h3 className="text-2xl font-bold mb-4">Stay Updated!</h3>
          <p className="text-gray-400 mb-6 max-w-lg">
            Subscribe to our newsletter to receive the latest updates and news.
          </p>
          <div className="flex w-full max-w-md">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-3 rounded-l-lg bg-white text-black focus:outline-none"
            />
            <button className="bg-[#F4A261] hover:bg-[#e68a45] px-6 py-3 rounded-r-lg font-semibold text-gray-900 transition-colors">
              Subscribe
            </button>
          </div>
        </motion.div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10">
          <div className="flex items-center mb-6 md:mb-0">
            <div className="flex space-x-4">
              <button className="text-gray-300 hover:text-white flex items-center text-sm">
                <svg
                  className="w-5 h-5 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 5a1 1 0 100 2h1a2 2 0 011.732 1H7a1 1 0 100 2h2.732A2 2 0 018 11H7a1 1 0 00-.707 1.707l3 3a1 1 0 001.414-1.414l-1.483-1.484A4.008 4.008 0 0011.874 10H13a1 1 0 100-2h-1.126a3.976 3.976 0 00-.41-1H13a1 1 0 100-2H7z"
                    clipRule="evenodd"
                  />
                </svg>
                English
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-8">
            <p className="text-gray-300 text-sm">
              © {new Date().getFullYear()} Jouala. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {["Privacy", "Terms", "Cookies"].map((item) => (
                <Link
                  key={item}
                  to={`/${item.toLowerCase()}`}
                  className="text-gray-300 hover:text-white text-sm transition-colors"
                >
                  {item} Policy
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
