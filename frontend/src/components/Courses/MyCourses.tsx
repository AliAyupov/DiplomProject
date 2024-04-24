import React from 'react';
import Preloader from '../common/preloader/Preloader';
import { NavLink } from 'react-router-dom';
import none from '../../img/balvan-foto.jpg';

interface Course {
    id: number;
    course_name: string;
    picture: string;
}
interface UserData {
    role:string;
}
interface Props {
    courses: Course[];
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    onPageChanged: (pageNumber: number) => void;
    isFetching: boolean;
    userData:UserData;
    onSearch: (query: string) => void;
    newCr:() => void;
}

const MyCourses: React.FC<Props> = ({ courses, pageSize, totalCoursesCount, currentPage, onPageChanged, isFetching, onSearch, userData, newCr}) => {
    const baseUrl = 'http://localhost:8000';
    let pagesCount = Math.ceil(totalCoursesCount / pageSize);
    let pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    return (
    <main>
        <div className="wrapper">
            <div className="wrapper-text"></div>
            <div className="wrapper__title wrapper__title_my">
                {userData.role === 'producer'? <abbr title="Здесь представлены курсы, созданные вами">МОИ КУРСЫ</abbr> : 
                userData.role === 'tutor'? <abbr title='Здесь представлены курсы, в которых вы тьютор'>МОИ КУРСЫ</abbr> : 
                <abbr className="Здесь представленны курсы, в которых вы участник">МОИ КУРСЫ</abbr>}
                
                {userData.role === 'producer' ? 
                <NavLink to='/course/create'>
                    <button type="submit"  className="button__create">+</button>
                </NavLink> : null}
            </div>
            
            <div className="wrapper-text"></div>
            {isFetching ? <Preloader key="unique_preloader_key"/> : null}
            <div className="grid">
                {Array.isArray(courses) && courses.map(c => (
                    <NavLink key={c.id} to={userData.role === 'producer' || userData.role === 'tutor' ? `/course/edit/${c.id}` : `/course/${c.id}`}>
                        <div className="grid__item">
                            <div className="card">
                                <div className="card__image">
                                    {c.picture? <img src={c.picture} alt="" className="image-course"/> : <img src={none} alt="" className="image-course"/>}
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
