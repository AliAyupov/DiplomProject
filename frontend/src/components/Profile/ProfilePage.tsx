import React, { useState } from 'react';
import myProfileIcon from '../../img/myprofile.svg';
import myDosIcon from '../../img/mydos.svg';
import myPersIcon from '../../img/mypers.svg';
import shopIcon from '../../img/shop.svg';
import courseImage from '../../img/course.png';
import ava from '../../img/ava.png';
import ShopContainerPage from '../Shop/ShopContainerPage';
import MyPersonPageContainer from '../Inventory/MyPersonPageContainer';

interface UserData {
    id: string;
    username: string;
    picture: string;
    balance: string;
    experience: string;
    level: string;
    email: string;
    first_name: string;
    role: string;
    password: string;
}

interface Props {
    isAuthenticated: boolean;
    userData: UserData;
    handleEditButtonClick: () => void;
    editing: boolean;
    handleInputChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
    previewImageUrl: string | null;
    errors: { [key: string]: string };
    editedUserData: UserData;
}

const ProfilePage: React.FC<Props> = ({
    isAuthenticated,
    userData,
    handleEditButtonClick,
    editing,
    handleInputChange,
    handleFileChange,
    handleFormSubmit,
    previewImageUrl,
    errors,
    editedUserData
}) => {
    const [activeTab, setActiveTab] = useState('profile');
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };
    const baseUrl = 'http://localhost:8000';
    return (
        <main>
            <div className="screen">
                <div className="screen__sidebar">
                    <div className="screen__sidebar">
                        <ul className="menu">
                            <li className={`menu__item ${activeTab === 'profile' ? 'item__active' : ''}`} onClick={() => handleTabClick('profile')}>
                                <img src={myProfileIcon} alt="Мой профиль" className="menu__icon" />
                                <a href="#" className="menu__link">Мой профиль</a>
                            </li>
                            {userData.role === 'student' && (
                            <li className={`menu__item ${activeTab === 'achievements' ? 'item__active' : ''}`} onClick={() => handleTabClick('achievements')}>
                                <img src={myDosIcon} alt="Мои достижения" className="menu__icon" />
                                <a href="#" className="menu__link">Мои достижения</a>
                            </li>
                             )}
                             {userData.role === 'student' && (
                            <li className={`menu__item ${activeTab === 'character' ? 'item__active' : ''}`} onClick={() => handleTabClick('character')}>
                                <img src={myPersIcon} alt="Мой персонаж" className="menu__icon" />
                                <a href="#" className="menu__link">Мой персонаж</a>
                            </li>
                            )}
                            {userData.role === 'student' && (
                            <li className={`menu__item ${activeTab === 'shop' ? 'item__active' : ''}`} onClick={() => handleTabClick('shop')}>
                                <img src={shopIcon} alt="Магазин" className="menu__icon" />
                                <a href="#" className="menu__link">Магазин</a>
                            </li>
                            )}
                        </ul>
                    </div>
                </div>
                {userData && (
                <div className="screen__content">
                    {activeTab === 'shop' && (
                        <ShopContainerPage/>
                    )}
                    {activeTab === 'profile' && (
                    <>
                <div className='wrapper'>
                    <div className="in-process">
                        
                         {editing ? (
                            <form onSubmit={handleFormSubmit} encType="multipart/form-data" className='form'>
                                <div className="profile-items profile-items-p">
                                    {previewImageUrl ? (
                                        <img src={previewImageUrl} alt="Preview" className="items-img" />
                                    ) : (
                                        userData.picture ? (
                                            <img src={`${baseUrl}${userData.picture}`} alt="профиль Image" className="items-img" />
                                        ) : (
                                            <img src={ava} alt="Default Profile" className="items-img" />
                                        )
                                    )}
                                    <div className="course-details course-details-wrap">
                                        <div>
                                            <p>
                                                <label htmlFor="first_name" className="form-label ">Имя</label>
                                            </p>  
                                            <input type="text" name="first_name" className="form-input form-input-p border-form form-input--profile" value={editedUserData.first_name} onChange={handleInputChange} />
                                            
                                            {errors.first_name && <p className="error-message">{errors.first_name}</p>}
                                            
                                            <p>  
                                                <label htmlFor="email" className="form-label">Email*</label>
                                            </p>  
                                            <input type="email" name="email" className={`form-input form-input-p border-form form-input--profile ${errors.email ? 'error-input' : ''}`} value={editedUserData.email} onChange={handleInputChange} />
                                            
                                            {errors.email && <p className="error-message">{errors.email}</p>}
                                            
                                            <p>  
                                                <label htmlFor="username" className="form-label">Логин*</label>
                                            </p>  
                                            <input type="text" name="username" className={`form-input form-input-p border-form form-input--profile ${errors.username ? 'error-input' : ''}`} value={editedUserData.username} onChange={handleInputChange} />
                                            
                                            {errors.username && <p className="error-message">{errors.username}</p>}
                                            
                                            <div className="file-container">
                                                <input type="file" name="picture" id="file-input" className="file-input form-input-p " onChange={handleFileChange} accept="image/*"/>
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
                                    </div>
                                    <div className="grid__item">
                                        <div className="item-block__element item-background">Опыт <h1 className="text__big">{userData.experience}/300</h1></div>
                                    </div>
                                    <div className="grid__item">
                                        <div className="item-block__element item-background">Баланс <h1 className="text__big">{userData.balance}</h1></div>
                                    </div>
                                </div>
                            <div className="margin"></div>
                            <div className="progress-text">50%</div>
                            <div className="progress-bar">
                                <div className="progress"></div>
                            </div>
                            <div className="progress-module">50/300</div>
                        </div>
                        )}
                        
                    </div>
                </div>   
                </>
                    )}
                    {activeTab === 'achievements' && (<>
                <div className='wrapper'>
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
                    </div></>
                    )} 
                    {activeTab === 'character' && (
                        <div className='wrapper'>
                            <MyPersonPageContainer/>
                        </div>
                    )}
                    
                </div>
                )}
            </div>
    </main>
);
}

export default ProfilePage;
