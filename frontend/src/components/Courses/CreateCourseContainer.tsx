import { connect } from "react-redux";
import CreateCourse from "./CreateCourse";
import { useState } from "react";
import axiosInstance from "../../http/axios";
import { setCourseName, setCourseDescription, setImages } from '../../redux/home-reducer';
import { useNavigate } from "react-router-dom";
import { withAuthorization } from "../hoc/AuthRedirect";

interface Props {
    setCourseName: (courseName: string) => void;
    setCourseDescription: (description: string) => void;
    setImages: (picture: string) => void;
    courseName: string;
    description: string;
    picture: string;
}


const CreateCourseContainer: React.FC<Props> = ({ setCourseName, setCourseDescription, setImages,  courseName, description, picture }) => {
    const [pictureFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const navigate = useNavigate();
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('course_name', courseName);
        formData.append('description', description);
        if (pictureFile) {
            formData.append('picture', pictureFile);
        }
        try {
            const response = await axiosInstance.post('/courses/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 201) {
                setCourseName('');
                setCourseDescription('');
                setImages(''); 
                navigate(`/course/edit/${response.data.id}`);
                console.log('Course created successfully', response.data);
               
            } else {
                console.error('Failed to create course', response.status);
            }
        } catch (error) {
            console.error('Error creating course', error);
        }
    };
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setImageFile(selectedFile);
            const imageUrl = `/media/course_files/${selectedFile.name}`;
            setImageUrl(imageUrl);
            const url = URL.createObjectURL(selectedFile);
            setPreviewImageUrl(url);
        }
    };
    return (
        <CreateCourse
            handleFormSubmit={handleFormSubmit}
            previewImageUrl={previewImageUrl}
            errors={errors}
            courseNameCreate={courseName}
            descriptionCreate={description}
            setCourseName={setCourseName}
            setCourseDescription={setCourseDescription}
            setImages={setImages}
            handleFileChange={handleFileChange}
            picture={picture}
            />   
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



const CreateCourseContainerWithAuthorization = withAuthorization(CreateCourseContainer);

export default connect(mapStateToProps, mapDispatchToProps) (CreateCourseContainerWithAuthorization);