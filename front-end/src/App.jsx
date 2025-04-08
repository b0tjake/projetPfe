import React, { useState } from 'react';
import Login from './authentification/login';
import Register from './authentification/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';
import Suggestions from './suggestions/suggestions';
import Loading from './assets/loading';



function App() {
  // const a = 2

  const [loading, setLoading] = useState(false);
  console.log(loading)
  return (
  
      <BrowserRouter>
      {loading? <Loading/> : null}
      <Navbar setLoading={setLoading}/>
      <Routes>
      <Route path="/login" element={<Login setLoading={setLoading} />} />
      <Route path="/register" element={<Register setLoading={setLoading} />} />
      <Route path="/suggestions"element={<Suggestions/>}/>
      </Routes>
      <Footer/>
      </BrowserRouter>

    
  );
}

export default App;