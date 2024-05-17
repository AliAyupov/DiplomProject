import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import { setContent } from '../../redux/home-reducer';
import { useNavigate, useParams } from "react-router-dom";
import { withAuthorization } from "../hoc/AuthRedirect";
import CreateLesson from "./CreateLesson";

interface Props {
    contentBD: string;
    setContent(contentBD: string) : void;
}

const CreateLessonContainer: React.FC<Props> = ({setContent, contentBD}) => {
    const { id } = useParams<{ id: string }>();
    useEffect(() => {
        const setContentLesson = async () => {
            try {
                const response = await axiosInstance.get(`lessons/${id}/`);
                const {content} = response.data;
                setContent(content);

            } catch (error) {
                console.error('Ошибка при загрузке уроков:', error);
            }
        };
        setContentLesson();
    }, [id]);
    const fetchLessons = async (codeJSON: string) => {
        try {
            const response = await axiosInstance.put(`lessons/${id}/`, { content: codeJSON });
                
        } catch (error) {
            console.error('Ошибка при загрузке уроков:', error);
        }
    };
    return (
        <CreateLesson fetchLessons={fetchLessons} contentBD={contentBD} />   
    )
}

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
    contentBD: state.homePage.contentBD,
});



const CreateLessonContainerWithAuthorization = withAuthorization(CreateLessonContainer);

export default connect(mapStateToProps, {setContent}) (CreateLessonContainerWithAuthorization);