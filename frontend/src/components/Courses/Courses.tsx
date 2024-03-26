import React, { useState } from 'react';
import course from '../../img/course.png';

const Courses: React.FC = () => {
    // Состояние для активной вкладки
    const [activeTab, setActiveTab] = useState('all');

    // Функция для изменения активной вкладки
    const handleTabChange = (tab: string) => {
        setActiveTab(tab);
    };

    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title wrapper__title_c">
                    СПИСОК КУРСОВ
                </div>
                <div className="wrapper-search">
                    <form action="search.php" className="wrapper-search__form" method="get">
                        <input type="text" name="search" className="wrapper-input" placeholder="Поиск..." />
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
                        <div className="wrapper-text">
                            Рекомендации для Вас
                        </div>
                        <div className="grid">
                            <div className="grid__item">
                                <div className="card">
                                    <div className="card__image">
                                        <img src={course} alt="" className="image-course" />
                                    </div>
                                    <div className="card__title">
                                        Название продукта вдруг
                                    </div>
                                </div>
                            </div>
                            {/* Другие карточки */}
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

export default Courses;  
