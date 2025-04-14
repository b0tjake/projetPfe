import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/posts");
        setPosts(response.data);
      } catch (err) {
        setError("Failed to fetch posts.");
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Latest Posts</h1>
      {error && <p className="text-red-500">{error}</p>}

      {posts.length === 0 ? (
        <p>No posts yet.</p>
      ) : (
        posts.map((post) => (
          <div key={post._id} className="bg-white p-4 shadow rounded-lg mb-4">
            <div className="flex items-center mb-2">
              <img
                src={`http://localhost:5000/${post.user?.image}`}
                alt="User"
                className="w-10 h-10 rounded-full mr-3"
              />
              <span className="font-semibold">{post.user?.fullname}</span>
            </div>
            <p className="mb-2">{post.content}</p>
            {post.image && (
              <img
                src={`http://localhost:5000/${post.image}`}
                alt="Post"
                className="max-w-full rounded-lg mb-2"
              />
            )}
            {/* لاحقاً نضيف زر لايك وتعليقات هنا */}
          </div>
        ))
      )}
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import Sidebar from "../components/sideBar";
// import { HeartIcon, ChatBubbleLeftIcon, ShareIcon, BookmarkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
// import { HeartIcon as HeartIconSolid } from "@heroicons/react/24/solid";
// import moment from "moment";

// export default function Home() {
//   const [posts, setPosts] = useState([]);
//   const [error, setError] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [commentInputs, setCommentInputs] = useState({});
//   const [expandedComments, setExpandedComments] = useState({});

//   useEffect(() => {
//     const fetchPosts = async () => {
//       try {
//         const response = await axios.get("http://localhost:5000/api/posts");
//         setPosts(response.data);
//       } catch (err) {
//         setError("Failed to fetch posts.");
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPosts();
//   }, []);

//   const handleLike = async (postId) => {
//     try {
//       const response = await axios.post(`http://localhost:5000/api/posts/${postId}/like`);
//       setPosts(posts.map(post => 
//         post._id === postId ? { 
//           ...post, 
//           likes: response.data.likes,
//           isLiked: response.data.isLiked 
//         } : post
//       ));
//     } catch (err) {
//       console.error("Error liking post:", err);
//     }
//   };

//   const handleCommentSubmit = async (postId) => {
//     if (!commentInputs[postId]?.trim()) return;
    
//     try {
//       const response = await axios.post(`http://localhost:5000/api/posts/${postId}/comment`, {
//         content: commentInputs[postId]
//       });
      
//       setPosts(posts.map(post => 
//         post._id === postId ? { 
//           ...post, 
//           comments: [...post.comments, response.data.comment] 
//         } : post
//       ));
      
//       setCommentInputs(prev => ({ ...prev, [postId]: "" }));
//     } catch (err) {
//       console.error("Error adding comment:", err);
//     }
//   };

//   const toggleComments = (postId) => {
//     setExpandedComments(prev => ({
//       ...prev,
//       [postId]: !prev[postId]
//     }));
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="flex min-h-screen bg-gray-100">
//       <Sidebar />
      
//       <div className="flex-1 p-2 sm:p-4 md:p-6 lg:p-8 max-w-2xl mx-auto w-full">
//         {/* <h1 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8 text-gray-800">Latest Posts</h1> */}
//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         {posts.length === 0 ? (
//           <div className="text-center py-8 sm:py-10">
//             <p className="text-gray-500 text-sm sm:text-base md:text-lg">No posts yet. Be the first to share something!</p>
//           </div>
//         ) : (
//           posts.map((post) => (
//             <div key={post._id} className="bg-white rounded-lg sm:rounded-xl shadow-sm sm:shadow-md overflow-hidden mb-4 sm:mb-6 transition-all hover:shadow-md sm:hover:shadow-lg">
//               {/* Post Header */}
//               <div className="flex items-center p-3 sm:p-4 border-b">
//                 <img
//                   src={`http://localhost:5000/${post.user?.image}`}
//                   alt="User"
//                   className="w-8 h-8 sm:w-10 sm:h-10 rounded-full object-cover mr-2 sm:mr-3"
//                   onError={(e) => {
//                     e.target.onerror = null;
//                     e.target.src = "https://via.placeholder.com/40";
//                   }}
//                 />
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-sm sm:text-base text-gray-800">{post.user?.fullname}</h3>
//                   <p className="text-xs text-gray-500">{moment(post.createdAt).fromNow()}</p>
//                 </div>
//                 <button className="text-gray-400 hover:text-gray-600">
//                   <EllipsisHorizontalIcon className="h-5 w-5" />
//                 </button>
//               </div>
              
//               {/* Post Content */}
//               <div className="p-3 sm:p-4">
//                 <p className="text-sm sm:text-base text-gray-800 mb-2 sm:mb-3">{post.content}</p>
//                 {post.image && (
//                   <img
//                     src={`http://localhost:5000/${post.image}`}
//                     alt="Post"
//                     className="w-full rounded-md sm:rounded-lg object-cover max-h-64 sm:max-h-80 md:max-h-96"
//                   />
//                 )}
//               </div>
              
//               {/* Post Stats */}
//               <div className="px-3 sm:px-4 py-2 border-t border-b text-xs sm:text-sm text-gray-500 flex justify-between">
//                 <span>{post.likes?.length || 0} likes</span>
//                 <span>{post.comments?.length || 0} comments</span>
//               </div>
              
//               {/* Post Actions */}
//               <div className="flex justify-around p-1 sm:p-2">
//                 <button 
//                   onClick={() => handleLike(post._id)}
//                   className={`flex items-center space-x-1 p-1 sm:p-2 rounded-lg hover:bg-gray-100 ${post.isLiked ? 'text-red-500' : 'text-gray-500'}`}
//                 >
//                   {post.isLiked ? (
//                     <HeartIconSolid className="h-5 w-5 sm:h-6 sm:w-6" />
//                   ) : (
//                     <HeartIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                   )}
//                   <span className="text-xs sm:text-sm">Like</span>
//                 </button>
                
//                 <button 
//                   onClick={() => toggleComments(post._id)}
//                   className="flex items-center space-x-1 p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-500"
//                 >
//                   <ChatBubbleLeftIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                   <span className="text-xs sm:text-sm">Comment</span>
//                 </button>
                
//                 <button className="flex items-center space-x-1 p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-500">
//                   <ShareIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                   <span className="text-xs sm:text-sm">Share</span>
//                 </button>
                
//                 <button className="flex items-center space-x-1 p-1 sm:p-2 rounded-lg hover:bg-gray-100 text-gray-500">
//                   <BookmarkIcon className="h-5 w-5 sm:h-6 sm:w-6" />
//                   <span className="text-xs sm:text-sm">Save</span>
//                 </button>
//               </div>
              
//               {/* Comments Section */}
//               {expandedComments[post._id] && (
//                 <div className="p-3 sm:p-4 border-t">
//                   {/* Comment Input */}
//                   <div className="flex mb-3 sm:mb-4">
//                     <img
//                       src={`http://localhost:5000/${post.user?.image}`}
//                       alt="User"
//                       className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mr-2"
//                       onError={(e) => {
//                         e.target.onerror = null;
//                         e.target.src = "https://via.placeholder.com/32";
//                       }}
//                     />
//                     <div className="flex-1 flex">
//                       <input
//                         type="text"
//                         placeholder="Write a comment..."
//                         className="flex-1 border rounded-full px-3 py-1 sm:px-4 sm:py-2 text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
//                         value={commentInputs[post._id] || ""}
//                         onChange={(e) => setCommentInputs(prev => ({
//                           ...prev,
//                           [post._id]: e.target.value
//                         }))}
//                         onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit(post._id)}
//                       />
//                       <button 
//                         onClick={() => handleCommentSubmit(post._id)}
//                         className="ml-2 px-2 py-1 sm:px-3 sm:py-1 bg-blue-500 text-white rounded-full text-xs sm:text-sm hover:bg-blue-600"
//                       >
//                         Post
//                       </button>
//                     </div>
//                   </div>
                  
//                   {/* Comments List */}
//                   {post.comments?.length > 0 && (
//                     <div className="space-y-2 sm:space-y-3">
//                       {post.comments.map((comment) => (
//                         <div key={comment._id} className="flex">
//                           <img
//                             src={`http://localhost:5000/${comment.user?.image}`}
//                             alt="User"
//                             className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover mr-2"
//                             onError={(e) => {
//                               e.target.onerror = null;
//                               e.target.src = "https://via.placeholder.com/32";
//                             }}
//                           />
//                           <div className="flex-1 bg-gray-50 rounded-lg p-2">
//                             <div className="flex justify-between items-start">
//                               <h4 className="font-semibold text-xs sm:text-sm">{comment.user?.fullname}</h4>
//                               <span className="text-xs text-gray-400">{moment(comment.createdAt).fromNow()}</span>
//                             </div>
//                             <p className="text-xs sm:text-sm text-gray-700">{comment.content}</p>
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               )}
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// }