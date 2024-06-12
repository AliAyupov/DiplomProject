import React, { useState } from 'react';
import Preloader from '../common/preloader/Preloader';
import GradeDialog from '../Layout/Grade';
import sad from  '../../img/sad.png';
import { ToastContainer } from 'react-toastify';

interface UserData {
    id: string;
    role: string;
}

interface Course {
    id: number; 
    course_name: string;
}
interface Lesson {
    id: number; 
    lesson_name: string;
}
interface Student {
    id: number; 
    username: string;
}
interface HomeworkData {
    id: number;
    course: number;
    course_info: Course;
    lesson_info: Lesson;
    student_info: Student;
    grade: string | null;
    homework_content: string;
    lesson: number;
    student: number;
    submission_date: string;
    submission_status: string;
}

interface LessonFiles {
    id: number;
    file_field: string;
}

interface Props {
    contentBD: string;
    isFetching: boolean;
    homeworkExists: boolean;
    homework: HomeworkData[];
    lessonFiles: { [key: number]: LessonFiles[] };
    onSaveGrade: (homeworkId: number, grade: number) => void;
}

const HomeworkComponent: React.FC<Props> = ({ contentBD, isFetching, homeworkExists, homework, lessonFiles, onSaveGrade }) => {
    const [activeTab, setActiveTab] = useState('pending');
    const baseUrl = 'http://localhost:8000';
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [currentHomeworkId, setCurrentHomeworkId] = useState<number | null>(null);
    const handleView = (lessonFile: LessonFiles) => {
        const fileUrl = `${baseUrl}/${lessonFile.file_field}`;
        window.open(fileUrl, '_blank');
    };
    const handleGrade = (id: number) => {
        setCurrentHomeworkId(id);
        setIsDialogOpen(true);
    };
    const handleTabChange = (newFilter: 'all' | 'pending' | 'approved') => {
        setActiveTab(newFilter);
    };
    const handleSaveGrade = (grade: number) => {
        if (currentHomeworkId !== null) {
            onSaveGrade(currentHomeworkId, grade);
        }
        setIsDialogOpen(false);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setCurrentHomeworkId(null);
    };
    const filteredHomework = Array.isArray(homework) ? homework.filter(hw => {
        if (activeTab === 'all') return true;
        if (activeTab === 'pending') return hw.grade === null;
        if (activeTab === 'approved') return hw.grade !== null;
        return true;
    }) : [];
    const getFileNameFromField = (file_field: string): string => {
        const filePathArray = file_field.split('/');
        return filePathArray[filePathArray.length - 1]; 
    };
    return (
<div className='wrapper'>
    <div className="wrapper__title">Домашние задания студентов</div>
    <div className="margin"></div>
        <div className="wrapper-search">
            <form action="search.php" className="wrapper-search__form" method="get">
                <input 
                type="text" 
                name="search" 
                className="wrapper-input" 
                placeholder="Поиск..."  
                />
            </form>
        </div>
        <div className="grid grid-courses">
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'pending' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('pending')}>
                            Новые
                        </div> 
                        <hr className="hr__width" />
                    </div>
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'approved' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('approved')}>
                            Проверенные
                        </div>
                        <hr className="hr__width" />
                    </div>
                    <div className='grid__item'>
                        <div className={`item-block__element ${activeTab === 'all' ? 'item-block__active' : ''}`} onClick={() => handleTabChange('all')}>
                            Все
                        </div>
                        <hr className="hr__width" />
                    </div>
            </div>
    {isFetching ? (
        <Preloader/>
    ) : homeworkExists ? (
        <div>
            <ul className="homework-list">
            {filteredHomework.length > 0 ? (
                filteredHomework.map(hw => (
                    <li key={hw.id} className="homework-item">
                        <p className='homework_table'>Домашняя работа №{hw.id}</p>
                        <p className='homework_table_row'>Курс: {hw.course_info.course_name}</p>
                        <p className='homework_table'>Урок: {hw.lesson_info.lesson_name}</p>
                        <p className='homework_table_row'>Студент: {hw.student_info.username}</p>
                        <p className='homework_table'>
                    Файлы:
                    {lessonFiles[hw.id] && lessonFiles[hw.id].map((lessonFile, index) => (
                        <p className='file_view' onClick={() => handleView(lessonFile)} key={index}>Файл: {getFileNameFromField(lessonFile.file_field)}</p>
                    ))}</p>
                        <p className='homework_table_row'>Дата сдачи: {hw.submission_date}</p>
                        <p className='homework_table'>Оценка: {hw.grade ? hw.grade : 'Не оценено'}</p>
                        {!hw.grade && (
                            <p className='center'>
                                <button onClick={() => handleGrade(hw.id)} className="grade-button">Оценить</button>
                                <ToastContainer />
                            </p>
                        )}
                    </li>
                ))
                 ) : (
                <div className='center'> 
                    <div className='dd'>Домашних заданий нет.</div>
                    <img src={sad} className='sad'/>
                </div>
                )}
            </ul>
            
        </div>
    ) : (
       <div className='center'> 
            <div className='dd'>Домашних заданий нет.</div>
            <img src={sad} className='sad'/>
        </div>
    )}
    {isDialogOpen && (
                <GradeDialog
                    onClose={handleCloseDialog}
                    onSave={handleSaveGrade}
                />
            )}
</div>);
};

export default HomeworkComponent;
