import React from 'react';
import portretImage from '../../img/portret.png';


interface UsersData {
    id: number;
    image: string;
    completed_lessons:number;
    course_id: number;
    student_id: number;
    completion_time: number;
}

interface Props{
    usersData: UsersData[];
    setProgress: (usersData: UsersData[]) => void;
}


const LeaderboardPage: React.FC<Props> = ({setProgress, usersData}) => {
    
    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title">
                    ЛУЧШИЕ УЧЕНИКИ
                </div>
                <div className="margin"></div>
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
                    {usersData ? usersData.map((user, index) => (
                        <div className="leaderboard__row" key={user.id}>
                            <div className="leaderboard__cell">{index+1}</div>
                            <div className="leaderboard__cell"><img src={portretImage} alt="" className="image_cell" /></div>
                            <div className="leaderboard__cell leaderboard__cell--name">nbvz</div>
                            <div className="leaderboard__cell">{user.completed_lessons} xp</div>
                            <div className="leaderboard__cell">{user.completion_time} min</div>
                            <div className="leaderboard__cell">
                                <div className="progress-bar">
                                    <div className="progress"></div>
                                </div>
                            </div>
                            <div className="leaderboard__cell off">
                                <button className="button">Подробнее</button>
                            </div>
                        </div>
                    )): <div>учеников нет</div>}
                </div>
            </div>
        </main>
    );
}

export default LeaderboardPage;
