import React from "react";
import { Navigate } from "react-router-dom";
import axiosInstance from "../../http/axios";
import { setUserData } from "../../redux/auth-reducer";

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
  }
  
  export const withAuthorization = (Component:any) => {
    class RedirectComponent extends React.Component<Props> {
        
        render() {
            const accessToken = localStorage.getItem('access_token');
            if (!this.props.isAuthenticated && !accessToken) {
                return <Navigate to="/login" />
            } else if (!this.props.isAuthenticated && accessToken) {
                const fetchUserData = async () => {
                    try {
                            const responseUser = await axiosInstance.get('auth/users/me/');
                            const userData = responseUser.data;
                            const { email, id, username } = userData;
                            const userId = userData.id;
                            const responseUserProfile = await axiosInstance.get(`custom-users/${userId}/`);
                            const userProfileData: UserData = responseUserProfile.data;
                            setUserData(email, id, username, userProfileData.picture, userProfileData.role, true, userProfileData);
                            return <Component {...this.props} />
                    } catch (error) {
                        console.error('Ошибка при получении данных пользователя:', error);
                        setUserData('', '', '', '', '', false, null);
                        return <Navigate to="/login" />
                    }
                };
                fetchUserData();
            } else if (this.props.isAuthenticated && accessToken) {
                return <Component {...this.props} />
            } else {
                return <Navigate to="/login" />
            }
        }
    }
    return RedirectComponent;
}