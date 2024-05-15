import React, { useState } from "react";
import mount from '../../img/mount.png';
import mony from '../../img/mony.jpg';
import Preloader from "../common/preloader/Preloader";
import { NavLink } from "react-router-dom";
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

const Home: React.FC<Props> = ({ courses, pageSize, totalCoursesCount, currentPage, onPageChanged, isFetching, onSearch }) => {
    const [searchQuery, setSearchQuery] = useState('');

    const handleSearchChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const query = e.target.value;
        setSearchQuery(query);
        onSearch(query);
    };
    const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault(); 
    };
    const onNextPageClicked = () => {
        if (currentPage < Math.ceil(totalCoursesCount / pageSize)) {
            const nextPage = currentPage + 1;
            onPageChanged(nextPage);
        }
    }

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
        <><main>
            <div className="wrapper">
                <section>
                    <img src={mount} alt="" className="wrapper-img" />
                    <img src={mony} alt="" className="wrapper-img__mob" />
                    <div className="grid-absolut">
                        <div className="image-title">
                            ЗАПУСКАЙТЕ СВОИ ОНЛАЙН-КУРСЫ
                            <br />
                            БЕЗ МИЛЛИОННЫХ ИНВЕСТИЦИЙ
                        </div>
                        <div className="image-subtitle image-subtitle-home">
                            Создавайте вовлекающие курсы, используйте гибкую методологию,
                            запускайте международные
                            <b>проекты и зарабатывайте на своей экспертизе</b>
                        </div>
                        <div className="wrapper-form">
                            <form onSubmit={handleFormSubmit} className="form" action="search.php" method="get">
                                <input
                                    type="text"
                                    name="search"
                                    className="form-input wrapper-form-home"
                                    placeholder="Поиск..."
                                    value={searchQuery} 
                                    onChange={handleSearchChange}  />
                                <button type="submit" className="form-button">
                                    Поиск
                                </button>
                            </form>
                        </div>
                    </div>
                </section>
                <div className="wrapper-text">Рекомендации для Вас</div>
                {isFetching ? <Preloader key="unique_preloader_key"/> : null}
                <div className="grid">
                    {courses && courses.map(c => (
                        <NavLink key={c.id} to={`/course/${c.id}`}>
                            <div className="grid__item">
                                <div className="card">
                                    <div className="card__image">
                                        {c.picture? <img src={c.picture} alt="" className="image-course"/> :
                                        <img src={none} alt="" className="image-course" />}
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
            </div>
        </main></>
    );
}

export default Home;
