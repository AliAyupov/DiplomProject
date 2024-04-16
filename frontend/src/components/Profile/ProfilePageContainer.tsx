import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import axiosInstance from '../../http/axios';
import { setUserData, updateUserData } from '../../redux/auth-reducer';
import ProfilePage from './ProfilePage';

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
    setUserData: (email: string, id: string, login: string, picture: string, isAuthenticated: boolean, userData:any) => void;
    updateUserData: (userData: UserData) => void;
}

const ProfilePageContainer: React.FC<Props> = ({ isAuthenticated, setUserData, userData, updateUserData }) => {
        useEffect(() => {
          const fetchUserData = async () => {
            try {
              const accessToken = localStorage.getItem('access_token');
              if (accessToken) {
                const responseUser = await axiosInstance.get('auth/users/me/');
                const userData = responseUser.data;
                const { email, id, username } = userData;
    
                const userId = userData.id;
    
                const responseUserProfile = await axiosInstance.get(`custom-users/${userId}/`);
                const userProfileData: UserData = responseUserProfile.data;
                setUserData(email, id, username, userProfileData.picture, true, userProfileData);
                
              } else {
                setUserData('', '','', '', false, null);
              }
            } catch (error) {
    
              console.error('Ошибка при получении данных пользователя:', error);
              setUserData('', '','', '', false, null);
            }
          };
      
          fetchUserData();
    }, [setUserData, isAuthenticated, updateUserData]);
    
    return <ProfilePage isAuthenticated={isAuthenticated} userData={userData} updateUserData={updateUserData}/>
};

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
});

export default connect(mapStateToProps,{setUserData, updateUserData})(ProfilePageContainer)