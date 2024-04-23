import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import { setCourseName, setCourseDescription, setImages } from '../../redux/home-reducer';
import {setCourse, setModules} from '../../redux/home-reducer';
import CoursePageEdit from "./CoursePageEdit";
import { useParams } from "react-router-dom";
import Preloader from "../common/preloader/Preloader";

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
}
interface Module {
    id: number;
    module_name: string;
    lessons_count:number;
}
interface UserData {
    role:string;
}
interface Props {
    courseName: string;
    description: string;
    picture: string;
    course: Course[];
    userData: UserData;
    modules: Module[];
    setCourse: (course: Course) => void;
    setModules: (modules: Module[]) => void;
    setImages: (picture: string) => void;
    setCourseName:(courseName: string) => void;
    setCourseDescription:(description: string) => void;
    modulesCount: number;
    lessonsCount:number;
}


const CoursePageEditContainer: React.FC<Props> = ({ setCourse,
    setModules, 
    courseName, 
    description, 
    setCourseName, 
    course, 
    setCourseDescription, 
    setImages, 
    picture, 
    modules, 
    userData }) => {
    
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [modulesCount, setModulesCount] = useState(0);
    const [lessonsCount, setLessonsCount] = useState(0);
    
    const [imageUrl, setImageUrl] = useState<string>('');
    const [pictureFile, setImageFile] = useState<File | null>(null);

    const { id } = useParams<{ id: string }>();
        useEffect(() => {
            const getCourse = async () => {
                try {
                    const response = await axiosInstance.get(`/courses/${id}`);
                    setCourse(response.data);
                    setCourseName(response.data.course_name);
                    setCourseDescription(response.data.description);
                    setImages(response.data.picture);
                    const modulesResponse = await axiosInstance.get(`/modules/?course_id=${id}`);
                    setModules(modulesResponse.data);
                    const totalLessonsCount = modulesResponse.data.reduce((total: number, module: Module) => total + module.lessons_count, 0);
                    setModulesCount(modulesResponse.data.length);
                    setLessonsCount(totalLessonsCount);
                } catch (error) {
                    console.error('Ошибка при загрузке курса:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            getCourse();
        }, [id, setCourse, setModules, setLessonsCount]);

    if (isLoading) {
        return <Preloader/>;
    }
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            const imageUrl = URL.createObjectURL(selectedFile);;
            setImageFile(selectedFile);
            setImageUrl(imageUrl);
            setPreviewImageUrl(imageUrl);
            setImages(imageUrl);
            updateCourseDetails(selectedFile, imageUrl);
            
        }
    };
    
    const updateCourseDetails = async (file: File | null , imageUrl: string) => {
        const formData = new FormData();
        formData.append('course_name', courseName);
        formData.append('description', description);
        if (file) {
            formData.append('picture', file);
        }
    
        try {
            const response = await axiosInstance.put(`/courses/${id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            if (response.status === 200) {
                console.log('Course updated successfully', response.data);
                setImages(response.data.picture || imageUrl);
            } else {
                console.error('Failed to update course', response.status);
            }
        } catch (error) {
            console.error('Error updating course', error);
        }
    };
    return (
        <CoursePageEdit
            updateCourseDetails={updateCourseDetails} 
            errors={errors}
            course={course} 
            courseName={courseName}
            previewImageUrl={previewImageUrl}
            setCourseDescription={setCourseDescription}
            setCourseName={setCourseName}
            setImages={setImages}
            modules={modules}
            description={description}
            handleFileChange={handleFileChange}
            userData={userData}
            />   
    )
}

const mapStateToProps = (state: any) => ({
    courseName:  state.homePage.courseName,
    description:  state.homePage.description,
    picture: state.homePage.picture,
    course: state.homePage.course,
    modules: state.homePage.modules,
    modulesCount: state.homePage.modulesCount,
    lessonsCount: state.homePage.lessonsCount,
    userData: state.auth.userData,
});


export default connect(mapStateToProps, {
    setCourse, 
    setModules,
    setImages,
    setCourseName, 
    setCourseDescription}) (CoursePageEditContainer);