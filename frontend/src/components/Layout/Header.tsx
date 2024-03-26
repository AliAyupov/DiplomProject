import React from 'react';
import logo from '../../img/logo.svg'
import { NavLink} from 'react-router-dom';


const Header = () => {
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
                <a href="#" className="link-menu header-menu__font">О платформе</a>
                <a href="#" className="link-menu header-menu__font">Возможности</a>
            </div>
            <div className="header_button">
                <NavLink to="/login" className="item-button__enter btn__height">Вход</NavLink>
                <NavLink to="/register" className="item-button__reg btn__height">Регистрация</NavLink>
                <button id="mobile-menu-button"><img src="img/menu.svg" alt="" className="img-menu" /></button>
            </div>
        </header><div id="mobile-menu" className="mobile-menu">
                <NavLink to="/" className="link-menu header-menu__font link-menu__active">Главная</NavLink>
                <NavLink to="/courses" className="link-menu header-menu__font">Курсы</NavLink>
    
                <a href="#" className="link-menu header-menu__font">О платформе</a>
                <a href="#" className="link-menu header-menu__font">Возможности</a>
                <a href="" className="item-button__enter-m btn__height">Вход</a>
                <a href="" className="item-button__reg-m btn__height">Регистрация</a>
            </div><hr /></>
    );
}

export default Header;