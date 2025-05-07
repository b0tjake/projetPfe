import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
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

function AppContent({ setLoading, loading }) {
  const location = useLocation();
  const token = localStorage.getItem("token");
  const isAuthPage = location.pathname === "/login" || location.pathname === "/register";

  useEffect(() => {
    if (!token && !isAuthPage) {
      // إعادة توجيه المستخدم إلى صفحة تسجيل الدخول إذا ما كانش عنده توكن
      window.location.href = "/login";
    }
  }, [token, isAuthPage]);

  return (
    <>
      {loading && <Loading />}

      {!isAuthPage && <Navbar setLoading={setLoading} />}

      <div className={`${!isAuthPage ? "pt-16" : ""}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/addPost" element={<AddPost />} />
          <Route path="/suggestions" element={<Suggestions />} />
          <Route path="/profile/:id" element={<Profile />} />
          <Route path="/login" element={<Login setLoading={setLoading} />} />
          <Route path="/register" element={<Register setLoading={setLoading} />} />
          <Route path="/addSuggestion" element={<AddSuggestion />} />
          <Route path="/adminDash" element={<AdminDash/>} />
          <Route path="/manageUsers" element={<ManageUsers/>}/>
          <Route path="/manageSuggestions" element={<ManageSuggestions/>}/>
          <Route path="/managePosts" element={<ManagePosts/>}/>
          <Route path="*" element={<h1 className="text-center text-2xl">Page Not Found</h1>} />
        </Routes>
      </div>

      { <Footer />}
    </>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  return (
    <BrowserRouter>
      <AppContent setLoading={setLoading} loading={loading} />
    </BrowserRouter>
  );
}

export default App;
