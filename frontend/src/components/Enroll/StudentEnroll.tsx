import React, { useState } from 'react';

interface Enrollment {
    id: number;
    user: User[];
}
interface User {
    email: string;
}

interface Props {
    enrollments: Enrollment[];
}
const CourseRequests: React.FC<Props> = ({ enrollments }) => {
    const [localEnrollments, setLocalEnrollments] = useState(enrollments);

    const handleAccept = (id: number) => {
        console.log('Accepted request with ID:', id);
        setLocalEnrollments(localEnrollments.filter(request => request.id !== id));
    };

    const handleReject = (id: number) => {
        console.log('Rejected request with ID:', id);
        setLocalEnrollments(localEnrollments.filter(request => request.id !== id));
    };

    return (
        <><main>
                <div className="wrapper">
                    <div className="wrapper__title">
                        Запросы на  вступление
                    </div>
                
                {enrollments.length > 0 ? (
                    enrollments.map(item => (
                        <div key={item.id} className="in-process__item">
                            <div className="course">
                                <div className="course-details">
                                    <div>
                                        <p className="modules-progress">{item.user[0].email}</p>
                                    </div>
                                    <div>
                                        <button onClick={() => handleAccept(item.id)} className="btn btn-c btn-accept">Принять</button>
                                        <button onClick={() => handleReject(item.id)} className="btn btn-c btn-reject">Отклонить</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Запросов нет</p>
                )}
                </div>
            </main></>
    );
};

export default CourseRequests;
