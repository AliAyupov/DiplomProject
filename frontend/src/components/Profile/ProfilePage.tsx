import React, { useState } from 'react';
import myProfileIcon from '../../img/myprofile.svg';
import myDosIcon from '../../img/mydos.svg';
import myPersIcon from '../../img/mypers.svg';
import shopIcon from '../../img/shop.svg';
import courseImage from '../../img/course.png';
import axiosInstance from '../../http/axios';
import ava from '../../img/ava.png';
import { useDispatch } from 'react-redux'; 
import { setUserData } from '../../redux/auth-reducer';

interface UserData {
    id: string;
    username: string;
    picture: string;
    balance: string;
    experience: string;
    level: string;
    email: string;
    first_name: string;
    role:string;
    password: string;
}

interface Props {
    isAuthenticated: boolean;
    userData: UserData;
    updateUserData: (userData: UserData) => void;
    
}

const ProfilePage: React.FC<Props> = ({ isAuthenticated, userData, updateUserData}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const [editing, setEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState<UserData>({ ...userData });
    const [pictureFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({}); 

	const dispatch = useDispatch();

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    const handleEditButtonClick = () => {
        setEditing(true);
         setEditedUserData({ ...userData });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setErrors({ ...errors, [name]: '' });
        setEditedUserData({ ...editedUserData, [name]: value });
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
            if (!validateEmail(editedUserData.email)) {
                setErrors({ ...errors, email: 'Введите корректный email' });
                return;
            }
            if (editedUserData.username.length < 4) {
                setErrors({ ...errors, username: 'Логин должен содержать не менее 4 символов' });
                return;
            }
    
            const formData = new FormData();
            formData.append('username', editedUserData.username);
            formData.append('email', editedUserData.email);
            formData.append('first_name', editedUserData.first_name);
            formData.append('password', editedUserData.password);
            formData.append('is_active', '1');
            
            if (pictureFile) {
                formData.append('picture', pictureFile);
            }

            const response = await axiosInstance.put(`custom-users/${editedUserData.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.status === 200) {
                const updatedUserData = { ...editedUserData };
                if (pictureFile) {
                    updatedUserData.picture = imageUrl;
                }
                dispatch(setUserData(updatedUserData.email, updatedUserData.id, updatedUserData.username, updatedUserData.picture, true, null)); 
                updateUserData(updatedUserData);
                setEditing(false);
            }
            else {
                console.error('Ошибка при обновлении данных пользователя');
            }
        }  catch (error:any) {
            if (error.response && error.response.data) {
                if (
                  error.response.status === 400 &&
                  error.response.data &&
                  error.response.data.username 
                ) {
                setErrors({ ...errors, username: 'Пользователь с таким именем уже существует' });
                }
                if (
                  error.response.status === 400 &&
                  error.response.data &&
                  error.response.data.email 
                ) {
                setErrors({ ...errors, email: 'Пользователь с такой почтой уже существует' });
                }
              } else {
                console.error('Ошибка при регистрации:', error);
              }
        }
    };
    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };
    const baseUrl = 'http://localhost:8000';
    return (
        <main>
            <div className="screen">
                <div className="screen__sidebar">
                    <div className="screen__sidebar">
                        <ul className="menu">
                            <li className={`menu__item ${activeTab === 'profile' ? 'item__active' : ''}`}>
                                <img src={myProfileIcon} alt="Мой профиль" className="menu__icon" />
                                <a href="#" className="menu__link" onClick={() => handleTabClick('profile')}>Мой профиль</a>
                            </li>
                            <li className={`menu__item ${activeTab === 'achievements' ? 'item__active' : ''}`}>
                                <img src={myDosIcon} alt="Мои достижения" className="menu__icon" />
                                <a href="#" className="menu__link" onClick={() => handleTabClick('achievements')}>Мои достижения</a>
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
                {userData && (
                <div className="screen__content">
                    {activeTab === 'profile' && (
                    <>
                    <div className="in-process">
                        
                         {editing ? (
                            <form onSubmit={handleFormSubmit} encType="multipart/form-data" className='form'>
                                <div className="profile-items profile-items-p">
                                    {previewImageUrl ? (
                                        <img src={previewImageUrl} alt="Preview" className="items-img" />
                                    ) : (
                                        userData.picture ? (
                                            <img src={`${baseUrl}${userData.picture}`} alt="Course Image" className="items-img" />
                                        ) : (
                                            <img src={ava} alt="Default Profile" className="items-img" />
                                        )
                                    )}
                                    <div className="course-details course-details-wrap">
                                        <div>
                                            <p>
                                                <label htmlFor="first_name" className="form-label ">Имя</label>
                                            </p>  
                                            <input type="text" name="first_name" className="form-input form-input-p border-form" value={editedUserData.first_name} onChange={handleInputChange} />
                                            
                                            {/* Ошибка для имени */}
                                            {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                                            
                                            <p>  
                                                <label htmlFor="email" className="form-label">Email*</label>
                                            </p>  
                                            <input type="email" name="email" className={`form-input form-input-p border-form ${errors.email ? 'error-input' : ''}`} value={editedUserData.email} onChange={handleInputChange} />
                                            
                                            {errors.email && <p className="error-message">{errors.email}</p>}
                                            
                                            <p>  
                                                <label htmlFor="username" className="form-label">Логин*</label>
                                            </p>  
                                            <input type="text" name="username" className={`form-input form-input-p border-form ${errors.username ? 'error-input' : ''}`} value={editedUserData.username} onChange={handleInputChange} />
                                            
                                            {errors.username && <p className="error-message">{errors.username}</p>}
                                            
                                            <div className="file-container">
                                                <input type="file" name="picture" id="file-input" className="file-input form-input-p" onChange={handleFileChange} accept="image/*"/>
                                                <label htmlFor="file-input" className="file-button">Загрузить новое изображение</label>
                                            </div>
                                        </div>
                                        <button type="submit" className="item-button__reg btn__height btn__height_save">Сохранить</button>
                                    </div>
                                </div>
                            </form>
                        ) : (
                        <div className="in-process__item">
                            <div className="profile-items profile-items-p">
                                    {userData.picture ? (
                                    <img src={`${baseUrl}${userData.picture}`} alt="Course Image" className="items-img" />
                                    ) : (
                                    <img src={ava} alt="Default Profile" className="items-img" />
                                    )}
                                <div className="course-details course-details-wrap">
                                    <div>
                                        <h2 className="details-text">{userData.first_name}</h2>
                                        <p className="details-mail">{userData.email}</p>
                                        <p className="details-mail">{userData.role}</p>
                                    </div>
                                    <button className="item-button__reg btn__height btn__height_edit" onClick={handleEditButtonClick}>Редактировать</button>
                                </div>
                            </div>
                            <div className="margin"></div>
                            <div className="grid">
                            
                                <div className="grid__item">
                                                <div className="item-block__element item-background">Уровень <h1 className="text__big">{userData.level}</h1></div>
                                            </div><div className="grid__item">
                                                    <div className="item-block__element item-background">Опыт <h1 className="text__big">{userData.experience}/300</h1></div>
                                                </div><div className="grid__item">
                                                    <div className="item-block__element item-background">Баланс <h1 className="text__big">{userData.balance}</h1></div>
                                                </div>
                            
                            </div>
                            <div className="margin"></div>
                            <div className="progress-text">50%</div>
                            <div className="progress-bar">
                                <div className="progress"></div>
                            </div>
                            <div className="progress-module">1/2</div>
                        </div>
                        )}
                        
                    </div>
                    </>
                    )}
                    {activeTab === 'achievements' && (<>
                    <div className="wrapper-text">
                        Ваши достижения
                    </div>
                    <div className="grid">
                        <div className="grid__item">
                            <img src={courseImage} className="item-img" alt="" />
                        </div>
                        <div className="grid__item">
                            <img src={courseImage} className="item-img" alt="" />
                        </div>
                        <div className="grid__item">
                            <img src={courseImage} className="item-img" alt="" />
                        </div>
                    </div>    
                    </>
                    )} 
                    {activeTab === 'character' && (
                        <div>
                            {/* Контент для вкладки "Мой персонаж" */}
                        </div>
                    )}
                    {activeTab === 'shop' && (
                        <div>
                            {/* Контент для вкладки "Магазин" */}
                        </div>
                    )}  
                </div>
                )}
            </div>
    </main>
);
}

export default ProfilePage;
