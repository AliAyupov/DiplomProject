import { connect } from "react-redux";
import { setCourses, setCurrentPage, setTotalCourses, togglePreloader } from "../../redux/home-reducer";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import MyCourses from "./MyCourses";
import { setCourseName, setCourseDescription, setImages } from '../../redux/home-reducer';
import { withAuthorization } from "../hoc/AuthRedirect";

interface Course {
    id: number;
    course_name: string;
    picture: string;
}

interface UserData {
    role:string;
}

interface Props {
    
    setCourseName: (courseName: string) => void;
    setCourseDescription: (description: string) => void;
    setImages: (picture: string) => void;
    pageSize: number;
    isFetching: boolean;
    userData: UserData;
    toogleIsFetching: (isFetching: boolean) => void;
}

const MyCoursesContainer: React.FC<Props> = ({ pageSize, isFetching, toogleIsFetching, userData }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCoursesCount, setTotalCoursesCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    useEffect(() => {
        let endpoint = '';
        if (userData.role === 'producer') {
            endpoint = 'user-courses/'; 
        } else if (userData.role === 'tutor') {
            endpoint = 'tutor/'; 
        } else {
            endpoint = 'courses/';
        }
        toogleIsFetching(true);
        if (searchQuery.trim() === '') {
            axiosInstance.get(endpoint)
        .then(response => {
            toogleIsFetching(false);
            setCourses(response.data.results);
            setTotalCoursesCount(response.data.length);
        })
        .catch(error => {
            console.error('Ошибка при загрузке курсов:', error);
        });
        } 
    }, [currentPage, pageSize, searchQuery, toogleIsFetching]);

    const onPageChanged = (pageNumber: number) => {
        setCurrentPage(pageNumber);
    }

    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setCurrentPage(1);
    }
    const newCr = () => {
    }
    
    return (
        <>
         <MyCourses
            courses={courses}
            pageSize={pageSize}
            totalCoursesCount={totalCoursesCount}
            currentPage={currentPage}
            onPageChanged={onPageChanged} 
            isFetching={isFetching}
            onSearch={handleSearch}
            userData={userData}
            newCr={newCr}
         />
        </>
    );
}
let mapStateToProps = (state: any) => {
    return {
        userData: state.auth.userData,
        courses: state.homePage.courses,
        pageSize : state.homePage.pageSize,
        totalCoursesCount : state.homePage.totalCoursesCount,
        currentPage: state.homePage.currentPage,
        isFetching: state.homePage.isFetching,
        isAuthenticated: state.auth.isAuthenticated
    }
}


const MyCoursesContainerWithAuthorization = withAuthorization(MyCoursesContainer);

export default connect(mapStateToProps, { 
    setCourses,
    setCurrentPage, 
    setTotalCourses, 
    toogleIsFetching:togglePreloader,
    setCourseName,
    setCourseDescription,
    setImages,
}) (MyCoursesContainerWithAuthorization);