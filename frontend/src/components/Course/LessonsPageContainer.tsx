import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setLessons} from '../../redux/home-reducer';
import LessonsPage from './LessonsPage';
import { useParams } from 'react-router-dom';

interface Lesson {
    id: string;
    image: string;
    lesson_name:string;
}

interface Props{
    lessons: Lesson[];
    setLessons: (lessons: Lesson[]) => void;
}
const mapStateToProps = (state: any) => {
    return {
        lessons: state.homePage.lessons,
    };
}
const LessonsPageContainer: React.FC<Props> = ({setLessons, lessons}) => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axiosInstance.get(`modules/${id}/lessons`);
                setLessons(response.data.results);
            } catch (error) {
                console.error('Ошибка при загрузке уроков:', error);
            }
        };
        fetchLessons();
    }, [id, setLessons]);

    return <LessonsPage lessons={lessons} />
}

export default connect(mapStateToProps, { setLessons })(LessonsPageContainer);


