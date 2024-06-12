import React from 'react';
import portretImage from '../../img/portret.png';
import ava from '../../img/ava.png';
import sad from '../../img/sad.png';

interface Student {
    id: number;
    username: string;
    picture: string;
}

interface UsersData {
    id: number;
    image: string;
    completed_lessons: number;
    course_id: number;
    student: Student;
    completion_time: number;
}

interface Props {
    usersData: UsersData[];
    setProgress: (usersData: UsersData[]) => void;
    handleDelete: (id: number) => void;
}

const LeaderboardPage: React.FC<Props> = ({ setProgress, usersData, handleDelete }) => {
    const baseUrl = 'http://localhost:8000';

    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title">
                    ЛУЧШИЕ УЧЕНИКИ
                </div>
                <div className="margin"></div>
                {usersData && usersData.length > 0 && (
                <div className="wrapper-search">
                    <form action="search.php" className="wrapper-search__form" method="get">
                        <input type="text" name="search" className="wrapper-input" placeholder="Поиск..." />
                    </form>
                </div>
                )}
                <div className="leaderboard">
                    {usersData && usersData.length > 0 && (
                    <div className="leaderboard__row">
                        <div className="leaderboard__cell leaderboard__cell--header"></div>
                        <div className="leaderboard__cell leaderboard__cell--header"></div>
                        <div className="leaderboard__cell leaderboard__cell--header"></div>
                        <div className="leaderboard__cell leaderboard__cell--header">Результат</div>
                    </div>
                    )}
                    {usersData && usersData.length > 0 ? usersData.map((user, index) => (
                        <div className="leaderboard__row" key={user.id}>
                            <div className='onesr'>{index + 1}</div>
                            <div className="leaderboard__cell">
                                {user.student.picture ? (
                                    <img src={`${baseUrl}${user.student.picture}`} alt="Student Image" className="image_cell" />
                                ) : (
                                    <img src={ava} alt="Default Profile" className="image_cell" />
                                )}
                            </div>
                            <div className="leaderboard__cell leaderboard__cell--name">{user.student.username}</div>
                            <div className="leaderboard__cell">{user.completed_lessons} xp</div>
                            <div className="leaderboard__cell">
                                <div className="progress-bar">
                                    <div className="progress"></div>
                                    <div className='position-absolut btn btn-del btn_small' onClick={()=>{handleDelete(user.id)}}>X</div>
                                </div>
                            </div>
                            
                        </div>
                    )) : <div className='center'> <div className='dd'>Учеников на курсе пока что нет.</div> <img src={sad} className='sad'/> </div>}
                </div>
                
            </div>
        </main>
    );
}

export default LeaderboardPage;
