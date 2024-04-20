import { connect } from "react-redux";
import CreateCourse from "./CreateCourse";
import { useState } from "react";
import axiosInstance from "../../http/axios";

interface Props{

}


const CreateCourseContainer: React.FC<Props> = () => {
    const [pictureFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [courseData, setCourseData] = useState({
        courseName: '',
        description: '',
        picture: null,
    });
    
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setCourseData({
            ...courseData,
            [name]: value,
        });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setImageFile(selectedFile);
            const imageUrl = `/media/user_photo/${selectedFile.name}`;
            setImageUrl(imageUrl);
            const url = URL.createObjectURL(selectedFile);
            setPreviewImageUrl(url);
        }
    };
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('course_name', courseData.courseName);
            formData.append('description', courseData.description);
    
            if (courseData.picture) {
                formData.append('picture', courseData.picture);
            }
    
            const response = await axiosInstance.post('/courses/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
    
            if (response.status === 201) {
                console.log('Курс успешно создан:', response.data);
            } else {
                console.error('Не удалось создать курс, статус:', response.status);
            }
        } catch (error: any) {
            if (error.response) {
                console.error('Ошибка при создании курса:', error.response.data);
            } else {
                console.error('Ошибка при создании курса:', error.message);
            }
        }
    };

    return <CreateCourse
        previewImageUrl={previewImageUrl}
        errors={errors}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleFormSubmit={handleFormSubmit}    />
}

let mapStateToProps = (state: any) => {
    return {

    }
}

export default connect(mapStateToProps, {}) (CreateCourseContainer);