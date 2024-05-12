import React from 'react';
import './App.css'
import './Auth.css'
import { Routes, Route } from 'react-router-dom';
import Register from './components/register';
import SignIn from './components/login';
import Logout from './components/logout';
import HomeContainer from './components/Home/HomeContainer';
import Course from './components/Course/CoursePageContainer';
import ProfilePageContainer from './components/Profile/ProfilePageContainer';
import LessonsPageContainer from './components/Course/LessonsPageContainer';
import CoursesPageContainer from './components/Courses/CoursesPageContainer';
import MyCoursesContainer from './components/Courses/MyCoursesContainer';
import CreateCourseContainer from './components/Courses/CreateCourseContainer';
import CoursePageEditContainer from './components/Course/CoursePageEditContainer';
import CreateLessonContainer from './components/CreateLesson/CreateLessonContainer';
const App: React.FC = () => {
  return (
      <Routes>
        <Route path="/" element={<HomeContainer />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/courses" element={<CoursesPageContainer />} />
        <Route path="/course/:id" element={<Course/>} />
        <Route path="/modules/:id" element={<LessonsPageContainer />} />
        <Route path="/profile" element={<ProfilePageContainer/>} />
        <Route path="/courses/my" element={<MyCoursesContainer/>}/>
        <Route path="/course/create" element={<CreateCourseContainer/>} />
        <Route path="/course/edit/:id" element={<CoursePageEditContainer/>} />
        <Route path="/course/lessons" element={<CreateLessonContainer/>} />
      </Routes>
  );
}

export default App;
