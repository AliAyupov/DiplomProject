import React, { useState } from 'react';
import myProfileIcon from '../../img/myprofile.svg';
import myDosIcon from '../../img/mydos.svg';
import myPersIcon from '../../img/mypers.svg';
import shopIcon from '../../img/shop.svg';
import portretImage from '../../img/portret.png';
import courseImage from '../../img/course.png';

const ProfilePage: React.FC = () => {
    // Состояние для отслеживания активной вкладки
    const [activeTab, setActiveTab] = useState('profile');

    // Функция для обновления активной вкладки
    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

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
                <div className="screen__content">
                    {activeTab === 'profile' && (
                        <>
                    <div className="in-process">
                        <div className="in-process__item">
                            <div className="profile-items">
                                <img src={portretImage} alt="Course Image" className="items-img" />
                                <div className="course-details">
                                    <div>
                                        <h2 className="details-text">Али Аюпов</h2>
                                        <p className="details-mail">ali.ayupov.2017@mail.ru</p>
                                        <p className="details-mail">Студент</p>
                                    </div>
                                    <button className="item-button__reg btn__height">Редактировать</button>
                                </div>
                            </div>
                            <div className="margin"></div>
                            <div className="grid">
                                <div className="grid__item">
                                    <div className="item-block__element item-background">Уровень <h1 className="text__big">15</h1></div>
                                </div>
                                <div className="grid__item">
                                    <div className="item-block__element item-background">Опыт <h1 className="text__big">150/300</h1></div>
                                </div>
                                <div className="grid__item">
                                    <div className="item-block__element item-background">Баланс <h1 className="text__big">200</h1></div>
                                </div>
                            </div>
                            <div className="margin"></div>
                            <div className="progress-text">50%</div>
                            <div className="progress-bar">
                                <div className="progress"></div>
                            </div>
                            <div className="progress-module">1/2</div>
                        </div>
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

            </div>
    </main>
);
}

export default ProfilePage;
