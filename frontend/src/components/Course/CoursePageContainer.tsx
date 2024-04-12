import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setCourse, setModules} from '../../redux/home-reducer';
import CoursePage from './CoursePage';
import Preloader from '../common/preloader/Preloader';
import { useParams } from 'react-router-dom';

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
    lessonsCount: number;
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
}
const mapStateToProps = (state: any) => {
    return {
        course: state.homePage.course,
        modules: state.homePage.modules,
        modulesCount: state.homePage.modulesCount,
        lessonsCount: state.homePage.lessonsCount,
    };
}
const CoursePageContainer: React.FC<Props> = ({  course, modules, setCourse, setModules }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [modulesCount, setModulesCount] = useState(0);
    const [lessonsCount, setLessonsCount] = useState(0);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${id}`);
                setCourse(response.data);
                const modulesResponse = await axiosInstance.get(`/modules/?course_id=${id}`);
                setModules(modulesResponse.data);
                const totalLessonsCount = modulesResponse.data.reduce((total: number, module: Module) => total + module.lessons_count, 0);
                setModulesCount(modulesResponse.data.length);
                setLessonsCount(totalLessonsCount);
            } catch (error) {
                console.error('Ошибка при загрузке курса:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id, setCourse, setModules, setLessonsCount]);

    if (isLoading) {
        return <Preloader/>;
    }
    return (
        <CoursePage course={course} modules={modules} modulesCount={modulesCount} lessonsCount={lessonsCount}/>
    );
}

export default connect(mapStateToProps, { setCourse, setModules })(CoursePageContainer);


