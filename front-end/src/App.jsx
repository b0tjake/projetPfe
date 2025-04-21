import React, { useState } from 'react';
import Login from './authentification/login';
import Register from './authentification/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Suggestions from './suggestions/suggestions';
import Loading from './assets/loading';
import AddPost from './pages/addPost';
import Home from './pages/home';
import AddSuggestion from './admin/addSuggestion';
import Profile from './profile/profile';






function App() {
  // const a = 2

  const [loading, setLoading] = useState(false);
  console.log(loading)
  return (
  
      <BrowserRouter>
      {loading? <Loading/> : null}
      <Navbar setLoading={setLoading}/>
      <div className="pt-16">
      <Routes>
      <Route path="/" element={<Home/>} />
      <Route path="/addPost" element={<AddPost/>} />
      <Route path="/suggestions"element={<Suggestions/>}/>
      <Route path="/profile/:id"element={<Profile/>}/>
      <Route path="/login" element={<Login setLoading={setLoading} />} />
      <Route path="/register" element={<Register setLoading={setLoading} />} />
      <Route path="/addSuggestion" element={<AddSuggestion/>} />
      
      </Routes>
      </div>
      <Footer/>
      </BrowserRouter>

    
  );
}

export default App;