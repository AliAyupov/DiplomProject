import React, { useState } from 'react';
import course from '../../img/course.png';
import Preloader from '../common/preloader/Preloader';
import { NavLink } from 'react-router-dom';
import none from '../../img/balvan-foto.jpg';

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

const CoursesPage: React.FC<Props> = ({ courses, pageSize, totalCoursesCount, currentPage, onPageChanged, isFetching, onSearch}) => {
    const [activeTab, setActiveTab] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };

    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };
    const onNextPageClicked = () => {
        if (currentPage < Math.ceil(totalCoursesCount / pageSize)) {
            const nextPage = currentPage + 1;
            onPageChanged(nextPage);
        }
    }
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
    };
    const onPreviousPageClicked = () => {
        if (currentPage > 1) {
            const previousPage = currentPage - 1;
            onPageChanged(previousPage);
        }
    }

    let pagesCount = Math.ceil(totalCoursesCount / pageSize);
    let pages = [];

    for (let i = 1; i <= pagesCount; i++) {
        pages.push(i);
    }
    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title wrapper__title_c">
                    СПИСОК КУРСОВ
                </div>
                <div className="wrapper-search">
                    <form onSubmit={handleFormSubmit} action="search.php" className="wrapper-search__form" method="get">
                        <input 
                        type="text" 
                        name="search" 
                        className="wrapper-input" 
                        placeholder="Поиск..." 
                        value={searchQuery} 
                        onChange={handleSearchChange} 
                        />
                    </form>
                </div>
                <div className="grid grid-courses">
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'all' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('all')}>
                            Все
                        </div> 
                        <hr className="hr__width" />
                    </div>
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'inProgress' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('inProgress')}>
                            В процессе
                        </div>
                        <hr className="hr__width" />
                    </div>
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'completed' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('completed')}>
                            Завершенные
                        </div>
                        <hr className="hr__width" />
                    </div>
                </div>
                {activeTab === 'all' && (
                    <>
                        <div className="wrapper-text">Все курсы</div>
                        {isFetching ? <Preloader key="unique_preloader_key"/> : null}
                        <div className="grid">
                            {courses && courses.map(c => (
                                <NavLink key={c.id} to={`/course/${c.id}`}>
                                    <div className="grid__item">
                                        <div className="card">
                                            <div className="card__image">
                                                {c.picture? 
                                                <img src={c.picture} alt="course" className="image-course"/> : <img src={none} alt="Изображение отсутствует" className="image-course" />}
                                                
                                            </div>
                                            <div className="card__title">{c.course_name}</div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                        <div className="pagination">
                            <span className="pagination__link" onClick={onPreviousPageClicked}>&laquo;</span>
                            {pages.map(p => (
                                    <span key={p} className={`pagination__link ${currentPage === p ? 'pagination__link__active' : ''}`}
                                        onClick={() => { onPageChanged(p) }}>{p}</span>
                            ))}
                            <span className="pagination__link" onClick={onNextPageClicked}>&raquo;</span>
                        </div>
                    </>
                )}
                {activeTab === 'inProgress' && (
                    <>
                        <div className="wrapper-text">
                            В процессе
                        </div>
                        <div className="in-process">
                            <div className="in-process__item">
                                <div className="course">
                                    <img src={course} alt="Course Image" className="course-image" />
                                    <div className="course-details">
                                        <div>
                                            <h2 className="course-title">Название курса</h2>
                                            <p className="modules-progress">Пройдено 3 модуля</p>
                                        </div>
                                        <button className="btn btn-c">Перейти</button>
                                    </div>
                                </div>
                                <div className="progress-text">50%</div>
                                <div className="progress-bar">
                                    <div className="progress"></div>
                                </div>
                                <div className="progress-module">1/2</div>
                            </div>
                        </div>
                    </>
                )}
                {activeTab === 'completed' && (
                    <></>
                )}
            </div>
        </main>
    );
}

export default CoursesPage;
