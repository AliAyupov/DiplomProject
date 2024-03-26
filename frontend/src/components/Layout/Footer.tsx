import React from 'react';
import logo from '../../img/logo.svg'
import { NavLink } from 'react-router-dom';
const Footer = () => {
    return (
        <footer>
            <hr></hr>
            <div className="footer-menu">
                <NavLink to="/" className="link-menu footer-menu__font">Главная</NavLink>
                <NavLink to="/courses" className="link-menu footer-menu__font">Курсы</NavLink>
                <a href="" className="link-menu footer-menu__font">О платформе</a>
                <a href="" className="link-menu footer-menu__font">Возможности</a>
            </div>
        </footer>
    );
}

export default Footer;