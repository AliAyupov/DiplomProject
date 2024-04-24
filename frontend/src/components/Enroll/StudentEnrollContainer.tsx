import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import {connect} from 'react-redux';
import {setEnroll} from '../../redux/home-reducer';
import EnrollPage from './StudentEnroll';
import { useParams } from 'react-router-dom';
import { withAuthorization } from '../hoc/AuthRedirect';


interface Enrollment {
    id: number;
    user: User[];
}
interface User {
    email: string;
}

interface Props {
    enrollments: Enrollment[];
    setEnroll: (enrollments: any[]) => void;
}

const StudentEnrollPageContainer: React.FC<Props> = ({setEnroll, enrollments}) => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const fetchEnrollments = async () => {
            try {
                const response = await  axiosInstance.get(`/enrollment/?course=${id}`);
                setEnroll(response.data);
            } catch (error) {
                console.error('Error');
            }
        };

        if (id) {
            fetchEnrollments();
        }
    }, [id]);

    return <EnrollPage 
    enrollments={enrollments}
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


