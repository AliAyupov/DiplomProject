import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import Header from './Header';
import axiosInstance from '../../http/axios';
import { setUserData } from '../../redux/auth-reducer';

interface Props {
  isAuthenticated: boolean;
  setUserData: (email: string, id: string, login: string, picture: string, isAuthenticated: boolean) => void;
}


const HeaderContainer: React.FC<Props> = ({ isAuthenticated, setUserData }) => {
    useEffect(() => {
      const fetchUserData = async () => {
        try {
          const accessToken = localStorage.getItem('access_token');
          if (accessToken) {
            const response = await axiosInstance.get('auth/users/me/');
            const userData = response.data;
            console.log(response);
            const { email, id, picture, username } = userData;
            setUserData(email, id, username, picture, true);
          } else {
            setUserData('', '','', '', false);
          }
        } catch (error) {
          console.error('Ошибка при получении данных пользователя:', error);
          setUserData('', '','', '', false);
        }
      };
  
      fetchUserData();
    }, [setUserData]);

  return <Header isAuthenticated={isAuthenticated}/>;
};

const mapStateToProps = (state: any) => ({
  isAuthenticated: state.auth.isAuthenticated,
});

export default connect(mapStateToProps, { setUserData })(HeaderContainer);
