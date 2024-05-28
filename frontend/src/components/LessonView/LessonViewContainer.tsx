import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import { setContent, togglePreloader} from '../../redux/home-reducer';
import { useNavigate, useParams } from "react-router-dom";
import { withAuthorization } from "../hoc/AuthRedirect";
import LessonView from "./LessonView";

interface UserData {
    id: string;
}

interface Props {
    contentBD: string;
    setContent(contentBD: string) : void;
    userData: UserData;
    isFetching: boolean;
    toogleIsFetching: (isFetching: boolean) => void;
}

const LessonViewContainer: React.FC<Props> = ({setContent, toogleIsFetching, isFetching, contentBD, userData}) => {
    
    const { id } = useParams<{ id: string }>();

    const [courseId, setCourseId] = useState(null);

    useEffect(() => {
        const fetchCourseId = async () => {
            try {
                // Получаем информацию о модуле
                const moduleResponse = await axiosInstance.get(`/lessons/${id}`);
                const moduleId = moduleResponse.data.module;

                // Получаем информацию о курсе
                const courseResponse = await axiosInstance.get(`/module-course/${moduleId}/`);

                const courseId = courseResponse.data.course_id;
                
                setCourseId(courseId);
            } catch (error) {
                console.error('Ошибка при загрузке данных:', error);
            }
        };

        fetchCourseId();
    }, [id]);

    useEffect(() => {
        const setContentLesson = async () => {
            try {
                toogleIsFetching(true);
                const response = await axiosInstance.get(`lessons/${id}/`);
                const {content} = response.data;
                toogleIsFetching(false);
                setContent(content);

            } catch (error) {
                console.error('Ошибка при загрузке уроков:', error);
            }
        };
        setContentLesson();
    }, [id]);

    const postFiles = async (files: { id: string; file: File }[]) => {
        const config = {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        };

        try {
            const fileIds = [];

            for (const fileObj of files) {
                if (fileObj.file) {
                    const formData = new FormData();
                    formData.append('lesson', id || '');
                    formData.append('file_field', fileObj.file);

                    const response = await axiosInstance.post('/upload-file/', formData, config);

                    if (response.status === 201) {
                        fileIds.push(response.data.id);
                    } else {
                        console.error('Ошибка при загрузке файла:', response.statusText);
                    }
                }
            }
            
            const homeworkContent = fileIds.join(',');

            const homeworkData = {
                submission_date: new Date().toISOString(),
                submission_status: 'pending',
                lesson: id,
                student: userData,
                course: courseId,
                homework_content: homeworkContent,
            };
    
            const homeworkResponse = await axiosInstance.post('/student-homeworks/', homeworkData);
    
            if (homeworkResponse.status === 201) {
                debugger;
                console.log('Запись о домашнем задании успешно создана:', homeworkResponse.data);
            } else {
                debugger;
                console.error('Ошибка при создании записи о домашнем задании:', homeworkResponse.statusText);
            }
            return fileIds;
        } catch (error) {
            console.error('Ошибка при загрузке файлов:', error);
            return [];
        }
    };
    

    const getFilesByLessonAndElementId = async (elementId: string): Promise<File[]> => {
        try {
            const response = await axiosInstance.get('/upload-file/', {
                params: {
                    id: elementId
                }
                
            });
            if (response.status === 200) {
                
                return response.data;
            } else {
                console.error('Ошибка при получении файлов:', response.statusText);
                return [];
            }
        } catch (error) {
            console.error('Ошибка при получении файлов:', error);
            return [];
        }
    };
    
    return (
        <LessonView contentBD={contentBD} isFetching={isFetching} getFilesByLessonAndElementId={getFilesByLessonAndElementId} postFiles={postFiles}/>   
    )
}

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
    contentBD: state.homePage.contentBD,
    isFetching: state.homePage.isFetching,
});



const CreateLessonViewWithAuthorization = withAuthorization(LessonViewContainer);

export default connect(mapStateToProps, {setContent, toogleIsFetching:togglePreloader}) (CreateLessonViewWithAuthorization);