import React, { useEffect } from "react";
import mount from '../../img/mount.png';
import mony from '../../img/mony.jpg';
import course from '../../img/course.png';
import CoursePage from "../Course/CoursePage";
import axiosInstance from '../../http/axios';

interface Course {
    id: number;
    course_name: string;
}

interface Props {
    courses: Course[];
    setCourses: (courses: Course[]) => void;
}

const Home: React.FC<Props> = ({ courses, setCourses }) => {
    useEffect(() => {
        // Выполнить запрос к серверу при монтировании компонента
        axiosInstance.get('/courses/')
            .then(response => {
                console.log(response);
                // Получить данные из ответа и установить их в состояние курсов
                setCourses(response.data.results);
            })
            .catch(error => {
                console.error('Ошибка при загрузке курсов:', error);
            });
    }, []);
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
                <div className="grid">
                    {courses && courses.map(c => (
                    <div className="grid__item" key={c.id}>
                        <div className="card">
                            <div className="card__image">
                                <img src={course} alt="" className="image-course" />
                            </div>
                            <div className="card__title">{c.course_name}</div>
                        </div>
                    </div>
                     ))}
                </div>
            </div>
        </main></>
    );
}

export default Home;