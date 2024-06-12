import React, { useEffect, useState } from 'react';
import axiosInstance from '../../http/axios';
import Homework from './HomeWork';
import { useParams } from 'react-router-dom';
import { withAuthorization } from '../hoc/AuthRedirect';
import { setContent, setCourses, setHomework, togglePreloader } from '../../redux/home-reducer';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';

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

interface LessonFiles{
    id: number;
    file_field: string;
}
interface Props {
    contentBD: string;
    setContent(contentBD: string) : void;
    userData: UserData;
    isFetching: boolean;
    toogleIsFetching: (isFetching: boolean) => void;
    homework: HomeworkData[];
    setHomework: (homework: HomeworkData[]) => void;
}
  
const HomeworkContainer: React.FC<Props> = ({ setContent, toogleIsFetching, isFetching, contentBD, userData, setHomework, homework }) => {

    const [homeworkExists, setHomeworkExists] = useState(false);
    const [lessonFiles, setLessonFiles] = useState<{ [key: number]: LessonFiles[] }>({});
   
    useEffect(() => {
            let endpoint = '';
            let courseIds = [];
            
            if (userData.role === 'producer') {
                endpoint = 'user-courses/';
            } else if (userData.role === 'tutor') {
                endpoint = 'tutor/';
            } 
            toogleIsFetching(true);
            
            axiosInstance.get(endpoint)
            .then(response => {
                
                const courses = response.data.results ? response.data.results : response.data;
                courseIds = courses.map((course: { id: any; }) => course.id);
                checkHomeworkExistence(courseIds);
                
            })
            .catch(error => {
                console.error('Ошибка при загрузке курсов:', error);
            });
        }, [userData]);

    const checkHomeworkExistence = async (courseIds:any) => {
        
            try {
                if(courseIds.length  >  0)  {
                    const response = await axiosInstance.get('/student-homeworks/', {
                        params: {
                            course_id: courseIds.join(',') 
                        }
                    });
                    if (response.status === 200 && response.data.count > 0) {
                        setHomeworkExists(true);
                        const homework = response.data.results;
                        fetchLessonFiles(homework);
                        setHomework(homework);
                        toogleIsFetching(false);
                    } else {
                        setHomeworkExists(false);
                        toogleIsFetching(false);
                    }
                }
                else{
                    setHomeworkExists(false);
                    toogleIsFetching(false);
                }
            } catch (error) {
                console.error('Ошибка при проверке домашнего задания:', error);
                setHomeworkExists(false);
            }
    
    };

    const onSaveGrade = async (homeworkId: number, grade: number) => {
        try {
            const response = await axiosInstance.patch(`/student-homeworks/${homeworkId}/`, {
                grade: grade,
                submission_status: 'approved' 
            });
            if (response.status === 200) {
                const updatedHomework = homework.map(hw => hw.id === homeworkId ? { ...hw, grade: response.data.grade } : hw);
                setHomework(updatedHomework);
                const studentId = response.data.student_info.id;
                const currentBalance = parseFloat(response.data.student_info.balance);
                const currentExp = parseFloat(response.data.student_info.experience);
                const newBalance = currentBalance + grade * 5; 
                const newExp  = currentExp  +  50;

                const userUpdateResponse = await axiosInstance.put(`/custom-users/${studentId}/`, {
                    balance: newBalance,
                    experience: newExp
                });
                
                if (userUpdateResponse.status === 200) {
                    toast.success('Оценка успешно выставлена!', {
                        position: "top-right",
                        autoClose: 5000,
                        hideProgressBar: false,
                        closeOnClick: true,
                        pauseOnHover: true,
                        draggable: true,
                        progress: undefined,
                    });
                } else {
                    console.error('Ошибка при обновлении баланса:', userUpdateResponse.statusText);
                }
            } else {
                console.error('Ошибка при обновлении оценки:', response.statusText);
            }
        } catch (error) {
            console.error('Ошибка при обновлении оценки:', error);
        }
    };

    const fetchLessonFiles = async (homework: HomeworkData[]) => {
        if (homework && homework.length > 0) {
            try {
                const filesByHomework: { [key: number]: LessonFiles[] } = {};
                for (const hw of homework) {
                    if (hw && hw.homework_content) {
                        const contentHomework = hw.homework_content;
                        const ids = contentHomework.split(',').map((id: string) => parseInt(id.trim(), 10));
                        const files = [];
                        for (const id of ids) {
                            const response = await axiosInstance.get('/upload-file/', {
                                params: {
                                    id: id
                                }
                            });
                            if (response.status === 200) {
                                const file = response.data;
                                const lessonFile: LessonFiles = {
                                    id: file[0].id,
                                    file_field: file[0].file_field,
                                };
                                files.push(lessonFile);
                            } else {
                                console.error('Ошибка при получении файлов:', response.statusText);
                            }
                        }
                        filesByHomework[hw.id] = files;
                    }
                }
                setLessonFiles(filesByHomework);
            } catch (error) {
                console.error('Ошибка при получении файлов:', error);
            }
        }
    };
    
    

    return (
        <Homework
            contentBD={contentBD}
            isFetching={isFetching}
            homeworkExists={homeworkExists}
            homework={homework}
            lessonFiles={lessonFiles}
            onSaveGrade={onSaveGrade}
        />
    );
};


const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
    contentBD: state.homePage.contentBD,
    isFetching: state.homePage.isFetching,
    homework: state.homePage.homework || [],
});



const HomeworkViewWithAuthorization = withAuthorization(HomeworkContainer);

export default connect(mapStateToProps, {setContent, toogleIsFetching:togglePreloader, setHomework}) (HomeworkViewWithAuthorization);