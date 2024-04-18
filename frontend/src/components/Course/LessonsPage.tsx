import React from 'react';
import learnImage from '../../img/learn.png';

interface Lesson {
    id: string;
    image: string;
    lesson_name: string;
}
interface Props{
    lessons: Lesson[];
}

const LessonsPage:  React.FC<Props> = ({lessons}) => {
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
                {lessons.length > 0 ? (
                    lessons.map(item => (
                        <div key={item.id} className="in-process__item">
                            <div className="course">
                                <img src={learnImage} alt="Course Image" className="module__image" />
                                <div className="course-details">
                                    <div>
                                        <h2 className="course-title">{item.lesson_name}</h2>
                                        <p className="modules-progress">1h 12m</p>
                                    </div>
                                    <button className="btn btn-c">Начать</button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Уроков нет</p>
                )}
            </div>
        </main>
    );
}

export default LessonsPage;
