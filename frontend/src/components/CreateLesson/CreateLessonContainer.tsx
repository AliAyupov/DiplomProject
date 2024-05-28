import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import { setContent, togglePreloader} from '../../redux/home-reducer';
import { useNavigate, useParams } from "react-router-dom";
import { withAuthorization } from "../hoc/AuthRedirect";
import CreateLesson from "./CreateLesson";

interface Props {
    contentBD: string;
    setContent(contentBD: string) : void;
    isFetching: boolean;
    toogleIsFetching: (isFetching: boolean) => void;
}

const CreateLessonContainer: React.FC<Props> = ({setContent, toogleIsFetching, isFetching, contentBD}) => {
    
    const { id } = useParams<{ id: string }>();
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

    const postFile = async (file: File, elementId: number) => {
        const config = {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          };
        if (file) {
            const formData = new FormData();
            formData.append('lesson', id || '');
            formData.append('file_field', file);
            formData.append('id_element', String(elementId));
            try {
                const response = await axiosInstance.post('/upload-file/', formData, config);
    
                if (response.status === 201) {
                    return response.data.id;
                } else {
                    debugger
                    console.error('Ошибка при загрузке файла:', response.statusText);
                    // Обработка ошибки, если загрузка файла не удалась
                }
            } catch (error) {
                debugger
                console.error('Ошибка при загрузке файла:', error);
            }
        }
    }

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
    
    const fetchLessons = async (codeJSON: string) => {
        try {
            const response = await axiosInstance.put(`lessons/${id}/`, { content: codeJSON });
        } catch (error) {
            console.error('Ошибка при загрузке уроков:', error);
        }
    };
    return (
        <CreateLesson fetchLessons={fetchLessons} contentBD={contentBD} isFetching={isFetching} postFile={postFile} getFilesByLessonAndElementId={getFilesByLessonAndElementId}/>   
    )
}

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
    contentBD: state.homePage.contentBD,
    isFetching: state.homePage.isFetching,
});



const CreateLessonContainerWithAuthorization = withAuthorization(CreateLessonContainer);

export default connect(mapStateToProps, {setContent, toogleIsFetching:togglePreloader}) (CreateLessonContainerWithAuthorization);