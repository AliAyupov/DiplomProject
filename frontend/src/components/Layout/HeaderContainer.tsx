import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import axiosInstance from '../../http/axios';
import { setUserData } from '../../redux/auth-reducer';

interface Props {
  isAuthenticated: boolean;
  picture:string;
  setUserData: (email: string, id: string, login: string, picture: string, role:string, isAuthenticated: boolean, userData:any) => void;
}


const HeaderContainer: React.FC<Props> = ({ isAuthenticated, setUserData, picture }) => {
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            const responseUser = await axiosInstance.get('auth/users/me/');
            const userData = responseUser.data;
            const { email, id, username} = userData;

            const userId = userData.id;

            const responseUserProfile = await axiosInstance.get(`custom-users/${userId}/`);
            const userProfileData = responseUserProfile.data;
            const { picture, role } = userProfileData;
            setUserData(email, id, username, picture, role, true, userProfileData);
        
          } else {
            setUserData('', '','', '', '', false, null);
          }
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          setUserData('', '','', '','', false, null);
        }
      };
  
      fetchUserData();
    }, [setUserData, isAuthenticated]);

  return <Header isAuthenticated={isAuthenticated} picture={picture}/>;
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
  picture: state.auth.picture,
});

export default connect(mapStateToProps, { setUserData })(HeaderContainer);
