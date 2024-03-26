import React from 'react';
import learnImage from '../../img/learn.png';

const LessonsPage: React.FC = () => {
    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title">
                    НАЗВАНИЕ КУРСА
                </div>
                <div className="progress-text">50%</div>
                <div className="progress-bar">
                    <div className="progress"></div>
                </div>
                <div className="progress-module">1/2</div>
                <div className="wrapper-text">
                    Уроки
                </div>
                <div className="in-process__item">
                    <div className="course">
                        <img src={learnImage} alt="Course Image" className="module__image" />
                        <div className="course-details">
                            <div>
                                <h2 className="course-title">1 УРОК: КАК ПРАВИЛЬНО СМОТРЕТЬ В СТЕНУ</h2>
                                <p className="modules-progress">1h 30min</p>
                            </div>
                            <button className="btn btn-c">Начать</button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="in-process__item">
                    <div className="course">
                        <img src={learnImage} alt="Course Image" className="module__image" />
                        <div className="course-details">
                            <div>
                                <h2 className="course-title">1 УРОК: КАК ПРАВИЛЬНО СМОТРЕТЬ В СТЕНУ</h2>
                                <p className="modules-progress">1h 30min</p>
                            </div>
                            <button className="btn btn-c">Начать</button>
                        </div>
                    </div>
                </div>
                <hr />
                <div className="in-process__item">
                    <div className="course">
                        <img src={learnImage} alt="Course Image" className="module__image" />
                        <div className="course-details">
                            <div>
                                <h2 className="course-title">1 УРОК: КАК ПРАВИЛЬНО СМОТРЕТЬ В СТЕНУ</h2>
                                <p className="modules-progress">1h 30min</p>
                            </div>
                            <button className="btn btn-c">Начать</button>
                        </div>
                    </div>
                </div>
                <hr />
            </div>
        </main>
    );
}

export default LessonsPage;
