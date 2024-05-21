import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setCourse, setTutor} from '../../redux/home-reducer';
import { useParams } from 'react-router-dom';
import TutorPage from './TutorPage';
import { withAuthorization } from '../hoc/AuthRedirect';
import Preloader from '../common/preloader/Preloader';

interface Tutor {
    id: number;
    username: string;
    picture: string;
    email:string;
}
interface Course {
    id: number;
    teacher: Tutor[];
}

interface Props{
    course: Course[];
    tutor: Tutor[];
    setCourse: (course: Course[]) => void;
    setTutor: (tutor: Tutor[]) => void;
}

const TutorPageContainer: React.FC<Props> = ({setCourse, course, setTutor, tutor}) => {
    const { id } = useParams<{ id: string }>();
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const response = await axiosInstance.get(`/courses/${id}`);
                
                setCourse(response.data);
                const teacher = response.data.teacher;
                
                setTutor(teacher);
            } catch (error) {
                console.error('Ошибка при загрузке курса:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourse();
    }, [id, setCourse, setTutor]);

    const handleAddTutor = async (mail: string, setError: (message: string) => void) => {
        try {
            const response = await axiosInstance.get(`/users/?email=${mail}`);
            const users = response.data;
    
            if (users.length > 0) {
                const userId = users[0].id;
                await axiosInstance.post(`/courses/${id}/add-tutor/`, { userId });
                try {
                    const response = await axiosInstance.get(`/courses/${id}`);
                    
                    setCourse(response.data);
                    const teacher = response.data.teacher;
                    
                    setTutor(teacher);
                    setIsLoading(false);
                    setError('');
                } catch (error) {
                    console.error('Ошибка при загрузке курса:', error);
                    setError('Ошибка при загрузке курса');
                } 
            } else {
                setError('Пользователь не найден');
            }
        } catch (error) {
            console.error('Ошибка при добавлении тьютора:', error);
            setError('Ошибка при добавлении тьютора');
        }
    };
    
    const handleDelete = async (teacherId: number) => {
        await axiosInstance.delete(`/courses/${id}/remove-teacher/${teacherId}/`);
        
        try {
            const response = await axiosInstance.get(`/courses/${id}`);
            
            setCourse(response.data);
            const teacher = response.data.teacher;
            
            setTutor(teacher);
        } catch (error) {
            console.error('Ошибка при загрузке курса:', error);
        } finally {
            setIsLoading(false);
        }  
    };
    
    if (isLoading) {
        return <Preloader/>;
    }

    return <TutorPage handleDelete={handleDelete} tutor={tutor} setTutor={setTutor} handleAddTutor={handleAddTutor}/>
}

const mapStateToProps = (state: any) => {
    return {
        usersData: state.homePage.usersData,
        userData: state.auth.userData,
        isAuthenticated: state.auth.isAuthenticated,
        course: state.homePage.course,
        tutor: state.homePage.tutor,
    };
}


const TutorPageContainerAuth = withAuthorization(TutorPageContainer);
export default connect(mapStateToProps, { setCourse, setTutor })(TutorPageContainerAuth);


