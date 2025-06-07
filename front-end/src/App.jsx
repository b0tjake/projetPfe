import React, { useState, useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import Login from "./authentification/login";
import Register from "./authentification/register";
import Navbar from "./components/Navbar";
import Footer from "./components/footer";
import Suggestions from "./suggestions/suggestions";
import Loading from "./assets/loading";
import AddPost from "./pages/addPost";
import Home from "./pages/home";
import AddSuggestion from "./admin/addSuggestion";
import Profile from "./profile/profile";
import AdminDash from "./admin/adminDash";
import ManageUsers from "./admin/manageUsers";
import ManageSuggestions from "./admin/manageSuggestions";
import ManagePosts from "./admin/managePosts";
import { jwtDecode } from "jwt-decode";
import About from "./components/About";
import NotFoundPage from "./notFoundPage";
import { DarkModeProvider } from "./assets/darkmode";
import Messages from "./pages/messages";
import Notifications from "./pages/notifications";
import Friends from "./pages/friends";
import SavedPosts from "./pages/savedPosts";
import Settings from "./pages/settings";
import Features from "./pages/Features";
import Integrations from "./pages/Integrations";
import Pricing from "./pages/Pricing";
import Changelog from "./pages/Changelog";
import Documentation from "./pages/Documentation";
import Tutorials from "./pages/Tutorials";
import Blog from "./pages/Blog";
import Support from "./pages/Support";
import Careers from "./pages/Careers";
import Press from "./pages/Press";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Security from "./pages/Security";
import GDPR from "./pages/GDPR";


function AppContent({ setLoading, loading }) {
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [isUserLoaded, setIsUserLoaded] = useState(false);

const navigate = useNavigate();
  const token = localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);
      } catch (error) {
        console.error("Error decoding token:", error);
        setUser(null);
      }
    }
    setIsUserLoaded(true); 
  }, []);
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!token && !isAuthPage) {
      window.location.href = "/login";
    }
  }, [token, isAuthPage]);
  
  return (
    <>
      {loading && <Loading />}

      {!isAuthPage && <Navbar setLoading={setLoading} />}

      <div className={`${!isAuthPage ? "pt-16" : ""}`}>
      {!isUserLoaded ? <Loading /> : (

        <Routes>
          
          <Route path="/" element={<Home />} />
          <Route path="/addPost" element={<AddPost />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login setLoading={setLoading} />} />
          <Route path="/register" element={<Register setLoading={setLoading} />} />
          <Route path="/about" element={<About/>}/>
          <Route path="/messages" element={<Messages />} />
          <Route path="/messages/:userId" element={<Messages />} />
          <Route path="/notifications" element={<Notifications />} />
          <Route path="/friends" element={<Friends />} />
          <Route path="/saved" element={<SavedPosts />} />
          <Route path="/settings" element={<Settings />} />
          
          {/* Footer Pages */}
          <Route path="/features" element={<Features />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/changelog" element={<Changelog />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/support" element={<Support />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/press" element={<Press />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/security" element={<Security />} />
          <Route path="/gdpr" element={<GDPR />} />

          {/* Admin Routes */}
          {user?.role === "admin" ? 
          <>
          <Route path="/adminDash" element={<AdminDash/>} />
          <Route path="/addSuggestion" element={<AddSuggestion />} />
          <Route path="/manageUsers" element={<ManageUsers/>}/>
          <Route path="/manageSuggestions" element={<ManageSuggestions/>}/>
          <Route path="/managePosts" element={<ManagePosts/>}/>
          </>
          :
          
          <>
          {["/adminDash", "/addSuggestion", "/manageUsers", "/manageSuggestions", "/managePosts"].includes(location.pathname) && (
            <Route path={location.pathname} element={<Navigate to="/" replace />} />
          )}
        </>        }
          <Route path="*" element={<NotFoundPage/>} />
        </Routes>
      )}
      </div>

      {!isAuthPage && !["/", "/friends", "/messages", "/saved", "/suggestions"].includes(location.pathname) && !location.pathname.startsWith('/profile') && <Footer />}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
    <DarkModeProvider>
      <AppContent setLoading={setLoading} loading={loading} />
    </DarkModeProvider>

    </BrowserRouter>
  );
}

export default App;
