import { connect } from "react-redux";
import { setCourses, setCurrentPage, setTotalCourses, togglePreloader } from "../../redux/home-reducer";
import React, { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import CoursesPage from "./CoursesPage"

interface Course {
    id: number;
    course_name: string;
    picture: string;
}

interface Props {
    pageSize: number;
    isFetching: boolean;
    toogleIsFetching: (isFetching: boolean) => void;
}

const CoursesPageContainer: React.FC<Props> = ({ pageSize, isFetching, toogleIsFetching }) => {
    const [courses, setCourses] = useState<Course[]>([]);
    const [totalCoursesCount, setTotalCoursesCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');

    useEffect(() => {
        toogleIsFetching(true);
        if (searchQuery.trim() === '') {
            axiosInstance.get(`/courses/?page=${currentPage}&count=${pageSize}`)
                .then(response => {
                    toogleIsFetching(false);
                    setCourses(response.data.results);
                    setTotalCoursesCount(response.data.count);
                })
                .catch(error => {
                    console.error('Ошибка при загрузке курсов:', error);
                });
        } else {
            axiosInstance.get(`courses/search/?query=${searchQuery}`)
                .then(response => {

                    toogleIsFetching(false);
                    setCourses(response.data);
                    setTotalCoursesCount(response.data.count);
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
    
    
    return (
        <>
            <CoursesPage
                courses={courses}
                pageSize={pageSize}
                totalCoursesCount={totalCoursesCount}
                currentPage={currentPage}
                onPageChanged={onPageChanged} 
                isFetching={isFetching}
                onSearch={handleSearch}
            />
        </>
    );
}
let mapStateToProps = (state: any) => {
    return {
        courses: state.homePage.courses,
        pageSize : state.homePage.pageSize,
        totalCoursesCount : state.homePage.totalCoursesCount,
        currentPage: state.homePage.currentPage,
        isFetching: state.homePage.isFetching
    }
}

export default connect(mapStateToProps, { setCourses, setCurrentPage, setTotalCourses, toogleIsFetching:togglePreloader
}) (CoursesPageContainer);