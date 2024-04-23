import React, { useEffect, useState } from 'react';
import none from '../../img/none.png';
import { NavLink } from 'react-router-dom';
import module from '../../img/module.png';

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
}
interface UserData {
    role:string;
}
interface Module {
    id: number;
    module_name: string; 
}
interface Props {
    updateCourseDetails: (file: File | null, imageUrl: string) => void;
    errors: { [key: string]: string };
    course: Course[];
    modules: Module[];
    courseName: string;
    description: string;
    userData: UserData;
    previewImageUrl: string | null;
    setCourseName:(courseName: string) => void;
    setCourseDescription:(description: string) => void;
    setImages: (picture: string) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const CoursePageEdit: React.FC<Props> = ({
    updateCourseDetails,
    errors,
    course,
    modules,
    userData,
    courseName,
    description,
    setCourseName,
    setCourseDescription,
    setImages,
    previewImageUrl,
    handleFileChange
}) => {
    const [localCourseName, setLocalCourseName] = useState(courseName);
    const [localDescription, setLocalDescription] = useState(description);

    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalCourseName(event.target.value);
        setCourseName(event.target.value);
    };
    

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalDescription(event.target.value);
        setCourseDescription(event.target.value);
    };

    const handleBlur = (fieldName: 'name' | 'description') => {
        
        updateCourseDetails(null, previewImageUrl || '');
    };

    

    return (
        <>
        {course.map(item => (
        <div key={item.id} className="wrapper">
            <section>
                
                    <form encType="multipart/form-data" className='form form-create'>
                        {previewImageUrl ? (
                            <img src={previewImageUrl} alt="Preview" className="wrapper-img-c" />
                        ) : (
                        item.picture ? (
                            <img src={item.picture} alt="Preview" className="wrapper-img-c" />
                        ) : (
                            <img src={none} alt="Изображение отсутствует" className="wrapper-img-c" />
                        ))}
                        <div className="grid-absolut-c grid-absolut-create">
                            <div className="image-title image-title-up">
                                <textarea
                                    name="courseName"
                                    className={`form-input form-input-p form-input-up`}
                                    value={localCourseName}
                                    onChange={handleNameChange}
                                    onBlur={() => handleBlur('name')}
                                    placeholder="Введите название курса"
                                    rows={3}
                                    maxLength={69}
                                />
                            </div>
                            <div className="image-subtitle image-subtitle-up image-subtitle-block image-subtitle-create">
                                <textarea
                                    name="description"
                                    className={`form-input form-input-p form-input-desc ${errors.description ? 'error-input' : ''}`}
                                    value={localDescription}
                                    onChange={handleDescriptionChange}
                                    onBlur={() => handleBlur('description')}
                                    placeholder="Введите описание курса"
                                    rows={4}
                                    maxLength={112}
                                />
                            </div>
                            <div className="btn_start btn_start-up btn_start-create">
                                <input type="file" name="picture" id="file-input" className="file-input form-input-p" onChange={handleFileChange} accept="image/*" />
                                <label htmlFor="file-input" className="file-button">Загрузить новое изображение</label>
                            </div>
                        </div>
                    </form>
                    </section>
                    <div className="wrapper-text">
                            Модули
                    </div>
                    <div className="wrapper-text"></div>
                    <div className="wrapper__title wrapper__title_my">
                        Модули
                        {userData.role === 'producer' ? 
                        <NavLink to='/course/create'>
                            <button type="submit" className="button__create">+</button>
                        </NavLink> : null}
                    </div>
                        {modules && modules.length > 0 ? (
                            modules.map((moduleItem, index) => (
                                <div key={moduleItem.id} className="in-process__item">
                                    <NavLink  to={`/modules/${moduleItem.id}`}>
                                    <div className="course">
                                        <img src={module} alt="Course Image" className="module__image" />
                                        <div className="course-details">
                                            <div>
                                                <h2 className="course-title">{moduleItem.module_name}</h2>
                                                <p className="modules-progress">{index + 1} модуль</p>
                                            </div>
                                            <button className="btn btn-c">Перейти</button>
                                        </div>
                                    </div>
                                    </NavLink>
                                </div>
                            ))
                        ) : (
                            <p>Модулей еще нет</p>
                        )}
                        <hr />
            
        </div>
    ))}
    </>
    );
};

export default CoursePageEdit;
