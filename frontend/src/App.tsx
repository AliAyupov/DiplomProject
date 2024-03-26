import React from 'react';
import './App.css'
import './Auth.css'
import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import HomeContainer from './components/Home/HomeContainer';
import Courses from './components/Courses/Courses';
import Course from './components/Course/CoursePage';
import LessonsPage from './components/Course/LessonsPage';
import ProfilePage from './components/Profile/ProfilePage';
import LeaderboardPage from './components/Course/LeaderboardPage';
const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course" element={<Course />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/leaders" element={<LeaderboardPage/>}/>
      </Routes>
  );
}

export default App;
