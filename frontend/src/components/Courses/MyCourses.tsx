import React, { useState } from 'react';
import course from '../../img/course.png';
import Preloader from '../common/preloader/Preloader';
import { NavLink } from 'react-router-dom';

interface Course {
    id: number;
    course_name: string;
    picture: string;
}

interface Props {
    courses: Course[];
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    onPageChanged: (pageNumber: number) => void;
    isFetching: boolean;
    onSearch: (query: string) => void;
}

const MyCourses: React.FC<Props> = ({ courses, pageSize, totalCoursesCount, currentPage, onPageChanged, isFetching, onSearch}) => {
   
    let pagesCount = Math.ceil(totalCoursesCount / pageSize);
    let pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    return (
    <main>
        <div className="wrapper">
            <div className="wrapper__title wrapper__title_c">
                МОИ КУРСЫ
            </div>
            <div className="wrapper-text">Все курсы</div>
            {isFetching ? <Preloader key="unique_preloader_key"/> : null}
            <div className="grid">
                {courses && courses.map(c => (
                    <NavLink key={c.id} to={`/course/${c.id}`}>
                        <div className="grid__item">
                            <div className="card">
                                <div className="card__image">
                                    <img src={c.picture} alt="" className="image-course" />
                                </div>
                                <div className="card__title">{c.course_name}</div>
                            </div>
                        </div>
                    </NavLink>
                ))}
            </div>   
        </div>
    </main>
    );
}
export default MyCourses;
