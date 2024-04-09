import React from 'react';
import profile from '../../img/myprofile.svg';
import mydos from '../../img/mydos.svg';
import mypers from '../../img/mypers.svg';
import shop from '../../img/shop.svg';
import module from '../../img/module.png';

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
}
interface Module {
    id: number;
    module_name: string;
}
interface Props {
    course: Course[];
    modules: Module[];
}

const CoursePage: React.FC<Props> = ({ course, modules}) => {
    console.log(modules)
    
    return (
        <main>
            <div className="screen">
                <div className="screen__sidebar">
                    <ul className="menu">
                        <li className="menu__item item__active">
                            <img src={profile} alt="Мой профиль" className="menu__icon" />
                            <a href="#" className="menu__link">Мой профиль</a>
                        </li>
                        <li className="menu__item">
                            <img src={mydos} alt="Мои достижения" className="menu__icon" />
                            <a href="#" className="menu__link">Мои достижения</a>
                        </li>
                        <li className="menu__item">
                            <img src={mypers} alt="Мой персонаж" className="menu__icon" />
                            <a href="#" className="menu__link">Мой персонаж</a>
                        </li>
                        <li className="menu__item">
                            <img src={shop} alt="Магазин" className="menu__icon" />
                            <a href="#" className="menu__link">Магазин</a>
                        </li>
                    </ul>
                </div>
                {course.map(item => (
                <div key={item.id} className="screen__content">
                    <div className="wrapper">
                        <div className="wrapper__title">
                            {item.course_name}
                        </div>
                        <div className="margin"></div>
                        <section>
                            <img src={item.picture} alt={item.course_name} className="wrapper-img-c" />
                            <div className="mob-text">
                                <p>Уроков: 49</p>
                                <p>Модулей: 10</p>
                            </div>
                            <div className="grid-absolut-c">
                                <div className="image-title image-title-up">{item.course_name}</div>
                                <div className="image-subtitle image-subtitle-up">
                                   {item.description}
                                </div>
                                <div className="btn_start btn_start-up">
                                    <button type="submit" className="btn btn-start">Начать обучение</button>
                                </div>
                            </div>
                        </section>

                        <div className="wrapper-text">
                            Модули
                        </div>
                        {modules && modules.length > 0 ? (
                            modules.map((moduleItem, index) => (
                                <div key={moduleItem.id} className="in-process__item">
                                    <div className="course">
                                        <img src={module} alt="Course Image" className="module__image" />
                                        <div className="course-details">
                                            <div>
                                                <h2 className="course-title">{moduleItem.module_name}</h2>
                                                <p className="modules-progress">{index + 1} модуль</p>
                                            </div>
                                            <button className="btn btn-c">Перейти</button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p>Модулей еще нет</p>
                        )}
                        <hr />
                    </div>
                </div>
                ))}
            </div>
        </main>
    );
}

export default CoursePage;
