import React from 'react';
import Login from './authentification/login';
import Register from './authentification/register';
import { BrowserRouter, Route, Routes } from 'react-router-dom';


function App() {
  return (
    <div>
      <BrowserRouter>
      <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      </Routes>

      </BrowserRouter>

    </div>
  );
}

export default App;