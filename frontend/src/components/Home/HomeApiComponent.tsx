import React, { useEffect } from "react";
import axiosInstance from '../../http/axios';
import Home from "./Home";
interface Course {
    id: number;
    course_name: string;
}

interface Props {
    pageSize: number;
    isFetching: boolean;
    toogleIsFetching: (isFetching: boolean) => void;
}

const HomeApiComponent: React.FC<Props> = ({ pageSize, isFetching, toogleIsFetching }) => {
    const [courses, setCourses] = React.useState<Course[]>([]);
    const [totalCoursesCount, setTotalCoursesCount] = React.useState<number>(0);
    const [currentPage, setCurrentPage] = React.useState<number>(1);

    useEffect(() => {
        // Выполнить запрос к серверу при монтировании компонента
        toogleIsFetching(true);
        axiosInstance.get(`/courses/?page=${currentPage}&count=${pageSize}`)
            .then(response => {
                toogleIsFetching(false);
                // Получить данные из ответа и установить их в состояние курсов
                setCourses(response.data.results);
                setTotalCoursesCount(response.data.count);
            })
            .catch(error => {
                console.error('Ошибка при загрузке курсов:', error);
            });
    }, [currentPage, pageSize, toogleIsFetching]);

    const onPageChanged = (pageNumber: number) => {
        setCurrentPage(pageNumber);
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
            />
        </>
    );
}

export default HomeApiComponent;
