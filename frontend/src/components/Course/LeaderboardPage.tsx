import React from 'react';
import portretImage from '../../img/portret.png';

const LeaderboardPage: React.FC = () => {
    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title">
                    ЛУЧШИЕ УЧЕНИКИ
                </div>
                <div className="margin"></div>
                <div className="grid grid-courses">
                    <div className="grid__item">
                        <div className="item-block__element item-block__active">Неделя</div> 
                        <hr className="hr__width" />
                    </div>
                    <div className="grid__item">
                        <div className="item-block__element">Месяц</div>
                        <hr className="hr__width" />
                    </div>
                    <div className="grid__item">
                        <div className="item-block__element">Все время</div>
                        <hr className="hr__width" />
                    </div>
                </div>
                <div className="wrapper-search">
                    <form action="search.php" className="wrapper-search__form" method="get">
                        <input type="text" name="search" className="wrapper-input" placeholder="Поиск..." />
                    </form>
                </div>
                <div className="leaderboard">
                    <div className="leaderboard__row">
                        <div className="leaderboard__cell leaderboard__cell--header z-imd">Ранг</div>
                        <div className="leaderboard__cell leaderboard__cell--header leaderboard__cell--clear">   </div>
                        <div className="leaderboard__cell leaderboard__cell--header">Имя</div>
                        <div className="leaderboard__cell leaderboard__cell--header">Опыт</div>
                        <div className="leaderboard__cell leaderboard__cell--header">Время</div>
                        <div className="leaderboard__cell leaderboard__cell--header">Результат</div>
                        <div className="leaderboard__cell leaderboard__cell--header off">Подробнее</div>
                    </div>
                    {[1, 2, 3, 4, 5].map((index) => (
                        <div className="leaderboard__row" key={index}>
                            <div className="leaderboard__cell">{index}</div>
                            <div className="leaderboard__cell"><img src={portretImage} alt="" className="image_cell" /></div>
                            <div className="leaderboard__cell leaderboard__cell--name">Али Аюпов</div>
                            <div className="leaderboard__cell">1000</div>
                            <div className="leaderboard__cell">12:00</div>
                            <div className="leaderboard__cell">
                                <div className="progress-bar">
                                    <div className="progress"></div>
                                </div>
                            </div>
                            <div className="leaderboard__cell off">
                                <button className="button">Подробнее</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}

export default LeaderboardPage;
