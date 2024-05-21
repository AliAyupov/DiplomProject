import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import TutorCreateDialog from '../Layout/NewTeacherDialog';

interface Tutor {
    id: number;
    username: string;
    picture: string;
    email: string;
}

interface Props {
    tutor: Tutor[];
    handleDelete: (id: number) => void;
    setTutor: (tutor: Tutor[]) => void;
    handleAddTutor: (mail: string, setError: (message: string) => void) => void;
}

const TutorPage: React.FC<Props> = ({ tutor, handleDelete, setTutor, handleAddTutor }) => {
    const [showLessonCrete, setShowCreate] = useState(false);

    const handleOpenDialogCreate = () => {
        setShowCreate(true);
    };
    const handleCloseDialogCreate = () => {
        setShowCreate(false);
    };
    const flattenTutor = tutor.flat(); 

    const handleReject = (id: number) => {
        handleDelete(id);
    };
    return (
        <main>
            <div className="wrapper">
                <div className="wrapper__title">
                    ТЬЮТОРЫ
                    <button  onClick={handleOpenDialogCreate}  type="submit"  className="button__create">+ Добавить тьютора</button>
                </div>
                <div className="margin"></div>
                {showLessonCrete  && (
                    <TutorCreateDialog
                        key={`lessonCreationDialog`}
                        onClose={handleCloseDialogCreate}
                        onSave={handleAddTutor} />
                )}
                {flattenTutor.length > 0 ? (
                    <div className="leaderboard">
                        <div className="leaderboard__row">
                            <div className="leaderboard__cell leaderboard__cell--header">Логин</div>
                            <div className="leaderboard__cell leaderboard__cell--header">Почта</div>
                            <div className="leaderboard__cell leaderboard__cell--header"></div>
                            <div className="leaderboard__cell leaderboard__cell--header"></div>
                            <div className="leaderboard__cell leaderboard__cell--header"></div>
                        </div>
                        {flattenTutor.map(teacher => (
                            <div className="leaderboard__row" key={teacher.id}>
                                <div className="leaderboard__cell">{teacher.username}</div>
                                <div className="leaderboard__cell">{teacher.email}</div>
                                <div className="leaderboard__cell"></div>
                                <div className="leaderboard__cell"></div>
                                <div className="leaderboard__cell">
                                    <div className="btn btn-del" onClick={() => { handleReject(teacher.id) }}>Удалить</div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div>Учителей нет</div>
                )}
            </div>
        </main>
    );
}

export default TutorPage;
