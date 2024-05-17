import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setProgress} from '../../redux/home-reducer';
import { useParams } from 'react-router-dom';
import LeaderboardPage from './LeaderboardPage';
import { withAuthorization } from '../hoc/AuthRedirect';

interface Student {
    id: number;
    username: string;
    picture: string;
}

interface UsersData {
    id: number;
    image: string;
    completed_lessons:number;
    course_id: number;
    student: Student;
    completion_time: number;
}

interface Props{
    usersData:UsersData[];
    setProgress: (usersData: UsersData[]) => void;
}

const LeaderboardPageContainer: React.FC<Props> = ({setProgress, usersData}) => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchLessons = async () => {
            try {
                const response = await axiosInstance.get('/progress/', {
                    params: { course_id: id}
                });
                setProgress(response.data);
            } catch (error) {
                console.error('Ошибка при загрузке уроков:', error);
            }
        };
        fetchLessons();
    }, [id, setProgress]);

    return <LeaderboardPage usersData={usersData} setProgress={setProgress}/>
}

const mapStateToProps = (state: any) => {
    return {
        usersData: state.homePage.usersData,
        userData: state.auth.userData,
        isAuthenticated: state.auth.isAuthenticated,
    };
}


const LeaderboardPageContainerAuth = withAuthorization(LeaderboardPageContainer);


export default connect(mapStateToProps, { setProgress })(LeaderboardPageContainerAuth);


