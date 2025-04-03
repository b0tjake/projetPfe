import React from 'react';
import Login from './authentification/login';
import Register from './authentification/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/footer';



function App() {
  return (
    <div>
      <BrowserRouter>
      <Navbar/>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      </Routes>
      <Footer/>
      </BrowserRouter>

    </div>
  );
}

export default App;