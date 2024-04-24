import React, { useEffect, useState } from 'react';
import none from '../../img/none.png';
import { NavLink } from 'react-router-dom';
import module from '../../img/module.png';
import ModuleCreationDialog from '../Layout/Dialog';
import myProfileIcon from '../../img/myprofile.svg';
import myDosIcon from '../../img/mydos.svg';
import myPersIcon from '../../img/mypers.svg';
import shopIcon from '../../img/shop.svg';
import StudentEnrollContainer from '../Enroll/StudentEnrollContainer';
interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
    creator: number;
    teacher: number[];
}
interface UserData {
    id:number;
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
    handleFormSubmit: (moduleName: string) => void;
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
    handleFormSubmit,
    previewImageUrl,
    handleFileChange
}) => {
    const [localCourseName, setLocalCourseName] = useState(courseName);
    const [localDescription, setLocalDescription] = useState(description);
    const [showDialog, setShowDialog] = useState(false);

    const [activeTab, setActiveTab] = useState('edit');
    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalCourseName(event.target.value);
        setCourseName(event.target.value);
    };
    const isAuthorized = course.some(item => 
        userData.id === item.creator || item.teacher.includes(userData.id)
    );
    if (!isAuthorized) {
        return <div>Доступ запрещен. У вас нет прав на редактирование.</div>;
    }
    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalDescription(event.target.value);
        setCourseDescription(event.target.value);
    };

    const handleBlur = (fieldName: 'name' | 'description') => {
        
        updateCourseDetails(null, previewImageUrl || '');
    };


    const handleOpenDialog = () => {
        setShowDialog(true);
    };

    const handleCloseDialog = () => {
        setShowDialog(false);
    };

    const handleSaveModule = (moduleName: string) => {
        handleFormSubmit(moduleName);
        handleCloseDialog();
    };
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    const baseUrl = 'http://localhost:8000';
    return (
    <><div className="screen">
            <div className="screen__sidebar">
                <div className="screen__sidebar">
                    <ul className="menu">
                        <li className={`menu__item ${activeTab === 'edit' ? 'item__active' : ''}`}>
                            <img src={myProfileIcon} alt="Редактировать курс" className="menu__icon" />
                            <a href="#" className="menu__link" onClick={() => handleTabClick('edit')}>Редактировать курс</a>
                        </li>
                        <li className={`menu__item ${activeTab === 'enroll' ? 'item__active' : ''}`}>
                            <img src={myDosIcon} alt="Запросы на вступление" className="menu__icon" />
                            <a href="#" className="menu__link" onClick={() => handleTabClick('enroll')}>Запросы на вступление</a>
                        </li>
                        <li className={`menu__item ${activeTab === 'character' ? 'item__active' : ''}`}>
                            <img src={myPersIcon} alt="Мой персонаж" className="menu__icon" />
                            <a href="#" className="menu__link" onClick={() => handleTabClick('character')}>Мой персонаж</a>
                        </li>
                        <li className={`menu__item ${activeTab === 'shop' ? 'item__active' : ''}`}>
                            <img src={shopIcon} alt="Магазин" className="menu__icon" />
                            <a href="#" className="menu__link" onClick={() => handleTabClick('shop')}>Магазин</a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="screen__content">
            {activeTab === 'enroll' && (
            <StudentEnrollContainer/>
            )}
            {activeTab === 'edit' && (
            course.map(item => (
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
                                        maxLength={69} />
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
                                        maxLength={112} />
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
                            <button type="submit" onClick={handleOpenDialog} className="button__create">+</button>
                            : null}
                        {showDialog && (
                            <ModuleCreationDialog
                                onClose={handleCloseDialog}
                                onSave={handleSaveModule} />
                        )}
                    </div>
                    {modules && modules.length > 0 ? (
                        modules.map((moduleItem, index) => (
                            <div key={moduleItem.id} className="in-process__item">
                                <NavLink to={`/modules/${moduleItem.id}`}>
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
            ))
            )}
        </div>
        </div></>
    );
};

export default CoursePageEdit;
