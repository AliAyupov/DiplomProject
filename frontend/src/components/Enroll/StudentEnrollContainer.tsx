import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setEnroll} from '../../redux/home-reducer';
import EnrollPage from './StudentEnroll';
import { useParams } from 'react-router-dom';
import { withAuthorization } from '../hoc/AuthRedirect';



interface Enrollment {
    id: number;
    user: User;
    course_id: number;
    user_id: number;
}
interface User {
    id: number;
    email: string;
}

interface Props {
    enrollments: Enrollment[];
    setEnroll: (enrollments: any) => void;
}

const StudentEnrollPageContainer: React.FC<Props> = ({setEnroll, enrollments}) => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await  axiosInstance.get(`/enrollment/?course=${id}`);
                if (response.data.length === 0) {
                    setEnroll([]);
                } else {
                setEnroll(response.data);
                }
            } catch (error) {
                console.error('Error');
            }
        };

        if (id) {
            fetchEnrollments();
        }
    }, [id]);
    const rejectEnroll= async(id: number) => {
        await axiosInstance.delete(`/enrollment/${id}`);
        return;
    }
    const addStudentProgress = async (id: number, user_id: any, course_id: any) => {
        try {
            const existingProgressResponse = await axiosInstance.get('/progress/', {
                params: { course_id: course_id, student_id: user_id }
            });
            if (existingProgressResponse.data.length > 0) {
                alert('Прогресс для данного студента и курса уже существует!');
                await axiosInstance.delete(`/enrollment/${id}`);
                return;
            }
            const postData = {
                completed_lessons: 0, 
                course_id: course_id,
                student_id: user_id,
                completion_time: 0  
            };

            const response = await axiosInstance.post(`/progress/`, postData);
            if (response.status === 201) {
                setEnroll(enrollments.filter(enrollment => enrollment.id !== id));
                await axiosInstance.delete(`/enrollment/${id}/`);
            }
        } catch (error) {
            console.error('Failed to add student progress:', error);
        }
    };

    return <EnrollPage 
    enrollments={enrollments}
    setEnroll ={setEnroll}
    addStudentProgress={addStudentProgress}
    rejectEnroll={rejectEnroll}
    />
}

const mapStateToProps = (state: any) => {
    return {
        isAuthenticated: state.auth.isAuthenticated,
        userData: state.auth.userData,
        enrollments: state.homePage.enrollments,
    };
}

const StudentEnrollPageContainerWithAuthorization = withAuthorization(StudentEnrollPageContainer);

export default connect(mapStateToProps, { setEnroll })(StudentEnrollPageContainerWithAuthorization);


