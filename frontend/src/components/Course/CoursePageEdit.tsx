import React, { useEffect, useState } from 'react';
import none from '../../img/none.png';
import module from '../../img/module.png';
import ModuleCreationDialog from '../Layout/Dialog';
import myProfileIcon from '../../img/myprofile.svg';
import myDosIcon from '../../img/mydos.svg';
import myPersIcon from '../../img/mypers.svg';
import shopIcon from '../../img/shop.svg';
import StudentEnrollContainer from '../Enroll/StudentEnrollContainer';
import ModuleEditDialog from '../Layout/DialogEdit';
import LessonEditDialog from '../Layout/LessonEditDialog';
import LeaderBoardPageContainer from './LeaderBoardPageContainer';
import LessonCreationDialog from '../Layout/CreateDialog';
import { NavLink } from 'react-router-dom';
import TutorPageContainer from '../Tutor/TutorPageContainer';

interface Tutor {
    id: number;
    username: string;
    picture: string;
    email:string;
}

interface Course {
    id: number;
    course_name: string;
    description: string;
    picture: string;
    totalLessonsCount: number;
    creator: number;
    teacher: Tutor[];
}

interface Lesson {
    id: number;
    image: string;
    lesson_name:string;
    module: number;
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
    fetchLessons: (module_id: number) => void;
    lessons: Lesson[];
    course: Course[];
    modules: Module[];
    courseName: string;
    description: string;
    moduleId: number;
    userData: UserData;
    previewImageUrl: string | null;
    setCourseName:(courseName: string) => void;
    setCourseDescription:(description: string) => void;
    setImages: (picture: string) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (moduleName: string) => void;
    handleUpdateModule: (id: number, newName: string) => void;
    onDelete: (id: number) => void;
    lessonsByModule: { [key: number]: Lesson[] };
    handleDeleteLesson: (lesson_id: number, module_id: number) => void;
    handleUpdateLesson: (lesson_id: number, updatedData: any)=>void;
    handleCreateLesson: (lesson_name: string, module_id: number) => void;
}

const CoursePageEdit: React.FC<Props> = ({
    updateCourseDetails,
    errors,
    lessonsByModule,
    lessons,
    course,
    modules,
    fetchLessons,
    moduleId,
    userData,
    courseName,
    description,
    setCourseName,
    setCourseDescription,
    setImages,
    handleFormSubmit,
    previewImageUrl,
    handleFileChange,
    handleUpdateModule,
    onDelete,
    handleDeleteLesson,
    handleUpdateLesson,
    handleCreateLesson
}) => {
    const [localCourseName, setLocalCourseName] = useState(courseName);
    const [localDescription, setLocalDescription] = useState(description);
    const [showDialog, setShowDialog] = useState(false);
    const [activeModuleId, setActiveModuleId] = useState<number | null>(null);
    const [activeLessonId, setActiveLessonId] = useState<number | null>(null);
    const [activeLessonModule, setActiveLessonModule] = useState<number | null>(null);
    const [showLessonDialog, setShowLessonDialog] = useState(false);
    const [showLessonCrete, setShowCreate] = useState(false);
    const [activeTab, setActiveTab] = useState('edit');
    const [initialLessonName, setInitialLessonName] = useState("");
    const [moduleIdCreate, setModuleIdCreate] =  useState<number | null>(null);
    const handleNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalCourseName(event.target.value);
        setCourseName(event.target.value);
    };
    const [isAuthorized, setAuth] = useState(false);

    useEffect(() => {
        setAuth(course.some(item =>
            userData.id === item.creator || (item.teacher && item.teacher.some(teacher => teacher.id === userData.id))
        ));
    }, [course, userData.id]);
    
    if (!isAuthorized) {
        return <div>Доступ запрещен. У вас нет прав на редактирование.</div>;
    }

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setLocalDescription(event.target.value);
        setCourseDescription(event.target.value);
    };

    const openLessonDialog = (lessonId: number, moduleId: number) => {
        const foundLesson = Object.values(lessonsByModule).flat().find(lesson => lesson.id === lessonId);
        if (foundLesson) {
            setInitialLessonName(foundLesson.lesson_name);
            setActiveLessonId(lessonId);
            setShowLessonDialog(true);
            setActiveLessonModule(moduleId);
        }
    };
    const closeLessonDialog = () => {
        setActiveLessonId(null);
        setShowLessonDialog(false);
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
    const handleOpenDialogEdit = (moduleId: number) => {
        setActiveModuleId(moduleId);
      
    };
    
    const handleCloseDialogEdit = () => {
        setActiveModuleId(null);
    };
    
    const isDialogActive = (moduleId: number): boolean => {
        return activeModuleId === moduleId;
    };
    const handleSaveModuleEdit = (id:number,moduleName: string) => {
        handleUpdateModule(id, moduleName);
        handleCloseDialog();
    };
    const handleSaveModule = (moduleName: string) => {
        handleFormSubmit(moduleName);
        handleCloseDialog();
    };
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    const handleOpenDialogCreate = (moduleId: number) => {
        setShowCreate(true);
        setModuleIdCreate(moduleId);
    };

    const handleCloseDialogCreate = () => {
        setShowCreate(false);
    };
    const baseUrl = 'http://localhost:8000';
    return (
    <>
    <div className="screen">
            <div className="screen__sidebar">
                <div className="screen__sidebar">
                    <ul className="menu">
                        <li onClick={() => handleTabClick('edit')} className={`menu__item ${activeTab === 'edit' ? 'item__active' : ''}`}>
                            <img src={myProfileIcon} alt="Редактировать" className="menu__icon" />
                            <a href="#" className="menu__link">Редактировать курс</a>
                        </li>
                        <li onClick={() => handleTabClick('enroll')} className={`menu__item ${activeTab === 'enroll' ? 'item__active' : ''}`}>
                            <img src={myDosIcon} alt="Запросы на вступление" className="menu__icon" />
                            <a href="#" className="menu__link" >Запросы на вступление</a>
                        </li>
                        <li onClick={() => handleTabClick('character')} className={`menu__item ${activeTab === 'character' ? 'item__active' : ''}`}>
                            <img src={myPersIcon} alt="Ученики курса" className="menu__icon" />
                            <a href="#" className="menu__link">Ученики курса</a>
                        </li>
                        <li  onClick={() => handleTabClick('shop')} className={`menu__item ${activeTab === 'shop' ? 'item__active' : ''}`}>
                            <img src={myPersIcon} alt="Тьюторы" className="menu__icon" />
                            <a href="#" className="menu__link">Тьюторы</a>
                        </li>
                    </ul>
                </div>
            </div>
            
            <div className="screen__content">
            {activeTab === 'enroll' && (
            <StudentEnrollContainer/>
            )}
            {activeTab === 'shop' && (
            <TutorPageContainer/>
            )}
            {activeTab === 'character' && (
            <LeaderBoardPageContainer/> 
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
                        {userData.role === 'producer' || userData.role === 'tutor' ?
                            <button type="submit" onClick={handleOpenDialog} className="button__create">+</button>
                            : null}
                        {showDialog && (
                            <ModuleCreationDialog
                                key="moduleCreationDialog"
                                onClose={handleCloseDialog}
                                onSave={handleSaveModule} />
                        )}
                    </div>
                    
                        <div className="in-process__item">
                        {modules && modules.length > 0 ? ( modules.map((moduleItem, index) => (
                        <div key={moduleItem.id} >
                            <div className="course">
                                <img src={module} alt="Course Image" className="module__image" />
                                <div className="course-details">
                                    <div>
                                        <h2 className="course-title">{moduleItem.module_name}</h2>
                                        <p className="modules-progress">{index + 1} модуль</p>
                                    </div>
                                    <div>
                                        {userData.role === 'producer' || userData.role === 'tutor' ?
                                            <><button onClick={() => handleOpenDialogEdit(moduleItem.id)} className="btn btn-c btn-izm">✐</button>
                                                <button onClick={() => onDelete(moduleItem.id)} className="btn btn-c btn-del">🗑</button></>
                                            : null}
                                    </div>
                                    {isDialogActive(moduleItem.id) && (
                                        <ModuleEditDialog
                                            id={moduleItem.id}
                                            initialModuleName={moduleItem.module_name}
                                            onClose={handleCloseDialogEdit}
                                            onSave={handleSaveModuleEdit} />
                                    )}
                                </div>
                            </div>
                            <div>{lessonsByModule[moduleItem.id] && lessonsByModule[moduleItem.id].map((lesson, ind_less) => (
                                        
                                        <div key={lesson.id} className='lessons-div'>
                                            <div className="course-details lessons-details">
                                                <NavLink to={`/course/lessons/${lesson.id}`}>
                                                    <div className='transp-back'>
                                                        <h2 className="course-title">{lesson.lesson_name}</h2>
                                                        <p className="modules-progress">{ind_less + 1} Урок</p>
                                                    </div>
                                                </NavLink>
                                                <div className='transp-back'>
                                                    {userData.role === 'producer' || userData.role === 'tutor' ?
                                                        <><button onClick={() => openLessonDialog(lesson.id, lesson.module)} className="btn btn-c btn-izm">✐</button>
                                                            <button onClick={() => handleDeleteLesson(lesson.id, moduleItem.id)} className="btn btn-c btn-del">🗑</button></> : null}
                                                </div>
                                                {showLessonDialog && activeLessonId && (
                                                    <LessonEditDialog
                                                        key={`lessonEditDialog-${activeLessonId}`}
                                                        lessonId={activeLessonId}
                                                        initialLessonName={initialLessonName}
                                                        onClose={closeLessonDialog}
                                                        activeModuleId={activeLessonModule}
                                                        onSave={handleUpdateLesson} />
                                                )}
                                            </div>
                                        </div>
                                ))}

                                <div onClick={() => handleOpenDialogCreate(moduleItem.id)} className='createLesson'>добавить урок +</div>
                                {showLessonCrete && moduleIdCreate && (
                                    <LessonCreationDialog
                                        key={`lessonCreationDialog-${moduleIdCreate}`}
                                        onClose={handleCloseDialogCreate}
                                        activeModuleId={moduleIdCreate}
                                        onSave={handleCreateLesson} />
                                )}
                            </div>
                        </div>
                            ))
                        ) : (
                            <p>Модулей еще нет</p>
                        )}
                    </div>
                    <hr />
                </div>
                ))
            )}
        </div>
    </div></>
    );
};

export default CoursePageEdit;
