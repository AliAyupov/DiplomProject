import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import HomeContainer from './components/Home/HomeContainer';


const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
  );
}

export default App;
