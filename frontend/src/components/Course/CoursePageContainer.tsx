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
}
interface Module {
    id: number;
    module_name: string;
}

interface Props {
    setCourse: (course: Course[]) => void;
    setModules: (modules: Module[]) => void;
    course: Course[];
    modules: Module[];
}
const mapStateToProps = (state: any) => {
    return {
        course: state.homePage.course,
        modules: state.homePage.modules
    };
}
const CoursePageContainer: React.FC<Props> = ({  course, modules, setCourse, setModules }) => {
    const [isLoading, setIsLoading] = useState(true);
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${id}`);
                setCourse(response.data);
                const modulesResponse = await axiosInstance.get(`/modules/?course_id=${id}`);
                setModules(modulesResponse.data);
            } catch (error) {
                console.error('Ошибка при загрузке курса:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [setCourse, setModules]);

    if (isLoading) {
        return <Preloader/>;
    }
    return (
        <CoursePage course={course} modules={modules}/>
    );
}

export default connect(mapStateToProps, { setCourse, setModules })(CoursePageContainer);


