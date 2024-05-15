import { connect } from "react-redux";
import { useEffect, useState } from "react";
import axiosInstance from "../../http/axios";
import { setCourseName, setCourseDescription, setImages, setLessons } from '../../redux/home-reducer';
import {setCourse, setModules, setModule} from '../../redux/home-reducer';
import CoursePageEdit from "./CoursePageEdit";
import { useParams } from "react-router-dom";
import Preloader from "../common/preloader/Preloader";
import { withAuthorization } from "../hoc/AuthRedirect";
import { useNavigate } from 'react-router-dom';

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
    creator: number;
    teacher: number[];
}
interface Module {
    id: number;
    module_name: string;
    lessons_count: number;
}
interface Lesson {
    id: number;
    image: string;
    lesson_name:string;
    module: number;
}
interface UserData {
    id: number;
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
    setModule: (moduleName: string) => void;
    setImages: (picture: string) => void;
    setCourseName:(courseName: string) => void;
    setCourseDescription:(description: string) => void;
    modulesCount: number;
    lessonsCount:number;
    moduleName: string;
    moduleId:number;
    lessons: Lesson[];
    setLessons: (lessons: Lesson[]) => void;
}   


const CoursePageEditContainer: React.FC<Props> = ({ setCourse,
    setModules, 
    courseName, 
    description, 
    setCourseName, 
    course, 
    setCourseDescription, 
    setImages, 
    setModule,
    picture, 
    moduleName,
    moduleId,
    modules, 
    userData,
    lessons,
    setLessons }) => {
    const navigate = useNavigate();
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const [isLoading, setIsLoading] = useState(true);
    const [modulesCount, setModulesCount] = useState(0);
    const [lessonsCount, setLessonsCount] = useState(0);
    const [lessonsByModule, setLessonsByModule] = useState<{[key: number]: Lesson[]}>({});

    const [imageUrl, setImageUrl] = useState<string>('');
    const [pictureFile, setImageFile] = useState<File | null>(null);

    const { id } = useParams<{ id: string }>();

    const fetchLessons = async (module_id: number) => {
        try {
            const response = await axiosInstance.get(`/modules/${module_id}/lessons`);
            setLessonsByModule(prev => ({ ...prev, [module_id]: response.data.results }));
        } catch (error) {
            console.error('Ошибка при загрузке уроков:', error);
        }
    };
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
                    modulesResponse.data.forEach((module: { id: number; }) => {
                        
                        fetchLessons(module.id);
                    });
                    
                    const totalLessonsCount = modulesResponse.data.reduce((total: number, module: Module) => total + module.lessons_count, 0);
                    setModulesCount(modulesResponse.data.length);
                    setLessonsCount(totalLessonsCount);
                } catch (error) {
                    debugger
                    console.error('Ошибка при загрузке курса:', error);
                } finally {
                    setIsLoading(false);
                }
            };

            getCourse();
        }, [id, setCourse, setModules, setLessonsCount, setModule]);

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
    
    const handleCreateLesson = async (lessonName:string, moduleIdcreate: number) => {
        const formData = new FormData();
        formData.append('module', moduleIdcreate.toString());
        formData.append('lesson_name', lessonName);
        try {
            const response = await axiosInstance.post('/lessons/', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.status === 201) {
                console.log('Модуль успешно создан', response.data);
                setLessons(response.data); 
                
                fetchLessons(moduleIdcreate);
                navigate(`/course/lessons/${response.data.id}`)
                
            } else {
                console.error('Произошла какая-то ошибка при создании модуля', response.status);
            }
        } catch (error) {
            console.error('Ошибка при создании', error);
        }
    
    };
    const handleFormSubmit = async (moduleName: string) => {
        const formData = new FormData();
        formData.append('module_name', moduleName);
        formData.append('course', `${id}`);
        try {
            const response = await axiosInstance.post('/modules/as', formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.status === 201) {
                console.log('Модуль успешно создан', response.data);
                setModule(response.data); 
            } else {
                console.error('Произошла какая-то ошибка при создании модуля', response.status);
            }
        } catch (error) {
            console.error('Ошибка при создании', error);
        }
    
    };
    const handleUpdateModule = async (module_id:number, newName: string) => {
        const formData = new FormData();
        formData.append('module_name', newName);
        
        formData.append('course', `${id}`);
        try {
            const response = await axiosInstance.put(`/modules/as/${module_id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            if (response.status === 200) {
                console.log('Модуль обновлен успешно');
                const modulesResponse = await axiosInstance.get(`/modules/?course_id=${id}`);
                    setModules(modulesResponse.data);
            }
        } catch (error) {
            console.error('Ошибка при обновлении модуля:', error);
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
    const handleUpdateLesson = async (lesson_id: number, updatedData: any) => {
        try {
            const formData = new FormData();
            for (const key in updatedData) {
                formData.append(key, updatedData[key]);
            }
            formData.append('lesson_name', updatedData[0]);
            formData.append('module', updatedData[1]);
            const response = await axiosInstance.put(`/lessons/${lesson_id}/`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            if (response.status === 200) {
                console.log('Урок успешно обновлен');
                fetchLessons(updatedData[1]);
            }
        } catch (error) {
            console.error('Ошибка при обновлении урока:', error);
        }
    };
    
    const handleDeleteLesson = async (lesson_id: number, module_id: number) => {
        try {
            const response = await axiosInstance.delete(`/lessons/${lesson_id}`);
            if (response.status === 204) {
                console.log('Урок успешно удален');
                fetchLessons(module_id); 
            }
        } catch (error) {
            console.error('Ошибка при удалении урока:', error);
        }
    };
    const onDelete = async (module_id: number) => {
        try {
            const response = await axiosInstance.delete(`/modules/as/${module_id}/`);
            if (response.status === 204) { 
                console.log('Модуль успешно удален');
                const updatedModules = modules.filter(module => module.id !== module_id);
                setModules(updatedModules);
            }
        } catch (error) {
            console.error('Ошибка при удалении модуля:', error);
        }
    };
    
    return (
        <CoursePageEdit
            moduleId={moduleId}
            lessons={lessons}
            fetchLessons={fetchLessons}
            updateCourseDetails={updateCourseDetails} 
            errors={errors}
            course={course} 
            lessonsByModule={lessonsByModule}
            courseName={courseName}
            previewImageUrl={previewImageUrl}
            setCourseDescription={setCourseDescription}
            setCourseName={setCourseName}
            setImages={setImages}
            modules={modules}
            description={description}
            handleFileChange={handleFileChange}
            userData={userData}
            handleFormSubmit={handleFormSubmit}
            handleUpdateModule={handleUpdateModule}
            onDelete={onDelete}
            handleDeleteLesson={handleDeleteLesson}
            handleUpdateLesson={handleUpdateLesson} 
            handleCreateLesson={handleCreateLesson}
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
    moduleName: state.homePage.module,
    isAuthenticated: state.auth.isAuthenticated,
    lessons: state.homePage.lessons,
});

const CoursePageEditContainerWithAuthorization = withAuthorization(CoursePageEditContainer);

export default connect(mapStateToProps, {
    setCourse, 
    setModule,
    setModules,
    setImages,
    setCourseName, 
    setCourseDescription,
setLessons}) (CoursePageEditContainerWithAuthorization);