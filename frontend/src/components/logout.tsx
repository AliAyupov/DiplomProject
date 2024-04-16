import React, {useEffect } from 'react';
import axiosInstance from '../http/axios';
import { useDispatch } from 'react-redux'; 
import { useNavigate } from 'react-router-dom';
import { setUserData } from '../redux/auth-reducer';


export default function LogOut() {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	useEffect(() => {
		axiosInstance.post('logout/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
            
		});
		axiosInstance.defaults.headers['Authorization'] = null;
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
        dispatch(setUserData("", "", "", "", false, null));
		navigate('/login');
	});
	return <div>Logout</div>;
}
