import React, { useContext } from 'react';
import { DarkModeContext } from '../assets/darkmode';
import { FiCalendar, FiUser, FiTag } from 'react-icons/fi';

export default function Blog() {
  const { darkMode } = useContext(DarkModeContext);

  const posts = [
    {
      title: "The Future of Social Networking",
      excerpt: "Exploring the latest trends and innovations in social networking platforms.",
      author: "John Doe",
      date: "March 15, 2024",
      category: "Technology",
      image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Building Meaningful Connections Online",
      excerpt: "Tips and strategies for creating genuine relationships in the digital age.",
      author: "Jane Smith",
      date: "March 10, 2024",
      category: "Social",
      image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Privacy in the Digital Age",
      excerpt: "Understanding and protecting your digital privacy in today's connected world.",
      author: "Mike Johnson",
      date: "March 5, 2024",
      category: "Security",
      image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    },
    {
      title: "Content Creation Best Practices",
      excerpt: "Learn how to create engaging content that resonates with your audience.",
      author: "Sarah Wilson",
      date: "February 28, 2024",
      category: "Content",
      image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
    }
  ];

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Blog
          </h1>
          <p className={`text-lg ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Latest news, updates, and insights
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map((post, index) => (
            <article
              key={index}
              className={`rounded-xl overflow-hidden ${
                darkMode ? 'bg-gray-800' : 'bg-white'
              } shadow-lg hover:shadow-xl transition-all duration-300`}
            >
              <div className="relative h-64">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-2 ${
                    darkMode ? 'bg-blue-500/10 text-blue-400' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {post.category}
                  </span>
                  <h2 className={`text-2xl font-bold text-white`}>
                    {post.title}
                  </h2>
                </div>
              </div>
              <div className="p-6">
                <p className={`mb-4 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center">
                    <FiUser className={`w-4 h-4 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {post.author}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <FiCalendar className={`w-4 h-4 mr-2 ${
                      darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`} />
                    <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
                      {post.date}
                    </span>
                  </div>
                </div>
                <button
                  className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
                    darkMode
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  Read More
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className={`mt-16 p-8 rounded-xl ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } shadow-lg`}>
          <h2 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Subscribe to Our Newsletter
          </h2>
          <p className={`mb-6 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            Get the latest updates and news delivered to your inbox.
          </p>
          <div className="flex gap-4">
            <input
              type="email"
              placeholder="Enter your email"
              className={`flex-1 px-4 py-2 rounded-lg ${
                darkMode
                  ? 'bg-gray-700 text-white placeholder-gray-400'
                  : 'bg-gray-100 text-gray-900 placeholder-gray-500'
              }`}
            />
            <button
              className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
                darkMode
                  ? 'bg-blue-600 hover:bg-blue-700 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 