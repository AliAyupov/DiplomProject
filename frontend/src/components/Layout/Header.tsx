import React, { useEffect, useState } from 'react';
import logo from '../../img/logo.svg'
import menu from '../../img/menu.svg'
import ava from '../../img/ava.png'

import { NavLink} from 'react-router-dom';

interface UserData {
    role:string;
}

interface Props {
    isAuthenticated: boolean;
    picture: string;
    userData:UserData;
}

  
const Header: React.FC<Props> = ({ isAuthenticated, picture, userData}) => {
    
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };
    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };
    const baseUrl = 'http://localhost:8000';
    return (
        <><header className="header">
            <div className="header__logo logo">
                <NavLink to="/">
                    <img src= {logo} alt="" className="image-logo" />
                </NavLink>
            </div>
            <div className="header_menu">
                <NavLink to="/" className="link-menu header-menu__font">Главная</NavLink>
                <NavLink to="/courses" className="link-menu header-menu__font">Курсы</NavLink>
                <NavLink to="/courses/my" className="link-menu header-menu__font">Мои курсы</NavLink>
                {isAuthenticated && userData.role !== 'student' &&(
                    <NavLink to="/homework" className="link-menu header-menu__font">Проверка работ</NavLink>
                )}
            </div>
            
            <div className="header_button">
                {isAuthenticated ? (
                    <><NavLink to="/profile">
                        {picture ? (
                        <img src={`${baseUrl}${picture}`} alt="Profile" className="profile-picture" />
                        ) : (
                        <img src={ava} alt="Default Profile" className="profile-picture" />
                        )}
                    </NavLink>
                    <NavLink to="/logout" className="item-button__exit btn__height item-button__comp">Выйти</NavLink></>
                ) : (
                <><NavLink to="/login" className="item-button__enter btn__height"
                 onClick={closeMobileMenu}>Вход</NavLink>
                 <NavLink to="/register" className="item-button__reg btn__height" 
                 onClick={closeMobileMenu}>Регистрация</NavLink></>
                )}
                <button id="mobile-menu-button" onClick={toggleMobileMenu}><img src={menu} alt="" className="img-menu" /></button>
            </div> 
        </header>
        <div id="mobile-menu" className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <NavLink to="/" className="link-menu header-menu__font link-menu__active" onClick={closeMobileMenu}>Главная</NavLink>
                <NavLink to="/courses" className="link-menu header-menu__font" onClick={closeMobileMenu}>Курсы</NavLink>
                <NavLink to="/courses/my" className="link-menu header-menu__font" onClick={closeMobileMenu}>Мои курсы</NavLink>
                {isAuthenticated && userData.role !== 'student' && (
                    <NavLink to="/homework" className="link-menu header-menu__font">Проверка работ</NavLink>
                )}
                {isAuthenticated ? (
                <><NavLink to="/logout" className="item-button__exit btn__height btn__height_exit"
                onClick={closeMobileMenu}>Выйти</NavLink></>
                ) : (
                <><NavLink to="/login" className="item-button__enter-m btn__height" onClick={closeMobileMenu}>Вход</NavLink>
                <NavLink to="/register" className="item-button__reg-m btn__height" onClick={closeMobileMenu}>Регистрация</NavLink></>
                )}
        </div><hr /></>
    );
}

export default Header;