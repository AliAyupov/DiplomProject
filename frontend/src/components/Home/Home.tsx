import React from "react";
import mount from '../../img/mount.png';
import mony from '../../img/mony.jpg';
import course from '../../img/course.png';
import Preloader from "../common/preloader/Preloader";
import { NavLink } from "react-router-dom";

interface Course {
    id: number;
    course_name: string;
}

interface Props {
    courses: Course[];
    pageSize: number;
    totalCoursesCount: number;
    currentPage: number;
    onPageChanged: (pageNumber: number) => void;
    isFetching: boolean;
}

const Home: React.FC<Props> = ({ courses, pageSize, totalCoursesCount, currentPage, onPageChanged, isFetching }) => {
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
                        <div className="image-subtitle">
                            Создавайте вовлекающие курсы, используйте гибкую методологию,
                            запускайте международные
                            <b>проекты и зарабатывайте на своей экспертизе</b>
                        </div>
                        <div className="wrapper-form">
                            <form className="form" action="search.php" method="get">
                                <input
                                    type="text"
                                    name="search"
                                    className="form-input"
                                    placeholder="Поиск..." />
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
                                        <img src={course} alt="" className="image-course" />
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
