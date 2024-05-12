import { connect } from "react-redux";
import { useState } from "react";
import axiosInstance from "../../http/axios";
import { setCourseName, setCourseDescription, setImages } from '../../redux/home-reducer';
import { useNavigate } from "react-router-dom";
import { withAuthorization } from "../hoc/AuthRedirect";
import CreateLesson from "./CreateLesson";

interface Props {
    
}

const CreateLessonContainer: React.FC<Props> = ( ) => {
   
    return (
        <CreateLesson/>   
    )
}

const mapStateToProps = (state: any) => ({
    courseName:  state.homePage.courseName,
    description:  state.homePage.description,
    picture: state.homePage.picture,
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
});

const mapDispatchToProps = {
    setCourseName,
    setCourseDescription,
    setImages,
};

const CreateLessonContainerWithAuthorization = withAuthorization(CreateLessonContainer);

export default connect(mapStateToProps, mapDispatchToProps) (CreateLessonContainerWithAuthorization);