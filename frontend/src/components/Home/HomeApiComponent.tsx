import React, { useEffect, useState } from "react";
import axiosInstance from '../../http/axios';
import Home from "./Home";
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

const HomeApiComponent: React.FC<Props> = ({ pageSize, isFetching, toogleIsFetching }) => {
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
    
    return (
        <>
            <Home
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

export default HomeApiComponent;
