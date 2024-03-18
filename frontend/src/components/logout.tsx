import React, { useState, useEffect } from 'react';
import axiosInstance from '../http/axios';
import { useNavigate } from 'react-router-dom';

export default function LogOut() {
	const navigate = useNavigate();

	useEffect(() => {
		axiosInstance.post('logout/blacklist/', {
			refresh_token: localStorage.getItem('refresh_token'),
            
		});
		axiosInstance.defaults.headers['Authorization'] = null;
		localStorage.removeItem('access_token');
		localStorage.removeItem('refresh_token');
        
		navigate('/login');
	});
	return <div>Logout</div>;
}
