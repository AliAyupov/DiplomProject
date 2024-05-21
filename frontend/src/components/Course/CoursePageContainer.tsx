import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setCourse, setModules} from '../../redux/home-reducer';
import CoursePage from './CoursePage';
import Preloader from '../common/preloader/Preloader';
import { useParams } from 'react-router-dom';
import { withAuthorization } from '../hoc/AuthRedirect';

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
    lessonsCount: number;
}
interface UserData {
    id:number;
    role:string;
}

interface Module {
    id: number;
    module_name: string;
    lessons_count:number;
}

interface Props {
    setCourse: (course: Course[]) => void;
    setModules: (modules: Module[]) => void;
    course: Course[];
    modules: Module[];
    modulesCount: number;
    lessonsCount: number; 
    userData: UserData;
}
const mapStateToProps = (state: any) => {
    return {
        userData: state.auth.userData,
        course: state.homePage.course,
        modules: state.homePage.modules,
        modulesCount: state.homePage.modulesCount,
        lessonsCount: state.homePage.lessonsCount,
        isAuthenticated: state.auth.isAuthenticated
    };
}
const CoursePageContainer: React.FC<Props> = ({  course, modules, setCourse, setModules, userData }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [modulesCount, setModulesCount] = useState(0);
    const [lessonsCount, setLessonsCount] = useState(0);
    const { id } = useParams<{ id: string }>();
    const [isStudentEnrolled, setIsStudentEnrolled] = useState(false);
    const [isEnrollmentRequested, setIsEnrollmentRequested] = useState(false);

    useEffect(() => {
        const fetchCourse = async () => {
            if (!id) return;
            try {
                const response = await axiosInstance.get(`/courses/${id}`);
                setCourse(response.data);
                const modulesResponse = await axiosInstance.get(`/modules/?course_id=${id}`);
                setModules(modulesResponse.data);
                const totalLessonsCount = modulesResponse.data.reduce((total: number, module: Module) => total + module.lessons_count, 0);
                setModulesCount(modulesResponse.data.length);
                setLessonsCount(totalLessonsCount);

                if (userData.role === 'student') {
                    const studentCoursesResponse = await axiosInstance.get(`/student-progress-by-student/?student_id=${userData.id}`);
                    const studentCourses = studentCoursesResponse.data.results ? studentCoursesResponse.data.results : studentCoursesResponse.data;
                    const isEnrolled = studentCourses.some((course: Course) => course.id === parseInt(id, 10));
                    setIsStudentEnrolled(isEnrolled);
                    if (!isEnrolled) {
                        const id_course = parseInt(id,10)
                        const enrollmentResponse = await axiosInstance.get(`/enrollment/?course=${id_course}`);
                        const enrollments = enrollmentResponse.data;
                        const userEnrollments = enrollments.filter((enrollment: { user_id: number; }) => enrollment.user_id === userData.id);

                        if (userEnrollments.length !== 0) {
                        setIsEnrollmentRequested(true);
                        } else {
                        setIsEnrollmentRequested(false);
                        }
                    }
                }
            } catch (error) {
                console.error('Ошибка при загрузке курса:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id, setCourse, setModules, setLessonsCount]);

    const handleEnrollmentRequest = async () => {
        if (!id) return;
        try {
            const course = parseInt(id, 10);
            const response = await axiosInstance.post('/enrollment/', {
                user_id: userData.id,
                course_id: course,
            });
            if (response.status === 201) {
                setIsEnrollmentRequested(true);
            }
        } catch (error) {
            console.error('Ошибка при отправке заявки:', error);
        }
    };

    if (isLoading) {
        return <Preloader/>;
    }
    return (
        <CoursePage course={course} modules={modules} modulesCount={modulesCount} lessonsCount={lessonsCount} isStudentEnrolled={isStudentEnrolled} userData={userData}   onRequestEnrollment={handleEnrollmentRequest} isEnrollmentRequested={isEnrollmentRequested} />
    );
}


const CoursePageContainerWithAuthorization = withAuthorization(CoursePageContainer);

export default connect(mapStateToProps, { setCourse, setModules })(CoursePageContainerWithAuthorization);

