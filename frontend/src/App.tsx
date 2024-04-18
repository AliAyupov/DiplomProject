import React from 'react';
import './App.css'
import './Auth.css'
import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import Login from './components/login';
import Logout from './components/logout';
import HomeContainer from './components/Home/HomeContainer';
import Course from './components/Course/CoursePageContainer';
import LeaderboardPage from './components/Course/LeaderboardPage';
import ProfilePageContainer from './components/Profile/ProfilePageContainer';
import LessonsPageContainer from './components/Course/LessonsPageContainer';
import CoursesPageContainer from './components/Courses/CoursesPageContainer';
import MyCoursesContainer from './components/Courses/MyCoursesContainer';
const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses" element={<CoursesPageContainer />} />
        <Route path="/course/:id" element={<Course/>} />
        <Route path="/modules/:id" element={<LessonsPageContainer />} />
        <Route path="/profile" element={<ProfilePageContainer/>} />
        <Route path="/leaders" element={<LeaderboardPage/>}/>
        <Route path="/mycourses" element={<MyCoursesContainer/>}/>
      </Routes>
  );
}

export default App;
