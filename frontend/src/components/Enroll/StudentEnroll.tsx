import React, { useState } from 'react';
import sad from '../../img/sad.png';

interface Enrollment {
    id: number;
    user: User;
    course_id: number;
    user_id: number;
}
interface User {
    id: number;
    email: string;
    username: string;
}

interface Props {
    enrollments: Enrollment[];
    addStudentProgress: (id:number, user_id: number, course_id:number) => void;
    setEnroll: (enrollments: any) => void;
    rejectEnroll: (id: number) => void;
}
const CourseRequests: React.FC<Props> = ({ enrollments, addStudentProgress, setEnroll, rejectEnroll }) => {

    const handleAccept = (id: number, user_id:number, course_id:number) => {
        addStudentProgress(id, user_id, course_id);
        setEnroll(enrollments.filter(request => request.id !== id));
    };

    const handleReject = (id: number) => {
        rejectEnroll(id);
        setEnroll(enrollments.filter(request => request.id !== id));
    };
    return (
    <><main>
            <div className="wrapper"> 
                <div className="wrapper__title">
                    Запросы на  вступление
                </div>
                <div className="margin"></div>
                {enrollments.length > 0 ? (
                    enrollments.map(item => (
                        <div key={item.id} className="in-process__item">
                            <div className="course">
                                <div className="course-details">
                                    <div>
                                    <p className="modules-progress">{item.user.username}</p>
                                        <p className="modules-progress">{item.user.email}</p>
                                    </div>
                                    <div>
                                        <button onClick={() =>  handleAccept(item.id, item.user.id, item.course_id)} className="btn btn-c btn-accept">Принять</button>
                                        <button onClick={() => handleReject(item.id)} className="btn btn-c btn-reject">Отклонить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className='center'> <div className='dd'>Запросов на вступление нет.</div> <img src={sad} className='sad'/> </div>
                )}
                </div>
            </main></>
    );
};

export default CourseRequests;
