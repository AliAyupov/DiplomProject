import React, { useEffect, useState } from 'react';
import { connect} from 'react-redux';
import axiosInstance from '../../http/axios';
import { setUserData, updateUserData } from '../../redux/auth-reducer';
import ProfilePage from './ProfilePage';
import {withAuthorization} from '../hoc/AuthRedirect';

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
    setUserData: (email: string, id: string, login: string, picture: string, role: string, isAuthenticated: boolean, userData: any) => void;
    updateUserData: (userData: UserData) => void;
}

const ProfilePageContainer: React.FC<Props> = ({ isAuthenticated, userData, setUserData, updateUserData }) => {
    const [editing, setEditing] = useState(false);
    const [editedUserData, setEditedUserData] = useState<UserData>({ ...userData });
    const [pictureFile, setImageFile] = useState<File | null>(null);
    const [imageUrl, setImageUrl] = useState<string>('');
    const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
                    setUserData(email, id, username, userProfileData.picture, userProfileData.role, true, userProfileData);

                } else {
                    setUserData('', '', '', '', '', false, null);
                }
            } catch (error) {
                console.error('Ошибка при получении данных пользователя:', error);
                setUserData('', '', '', '', '', false, null);
            }
        };
        fetchUserData();
    }, [setUserData, isAuthenticated, updateUserData]);

    const handleEditButtonClick = () => {
        setEditing(true);
        setEditedUserData({ ...userData });
    };

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setErrors({ ...errors, [name]: '' });
        setEditedUserData({ ...editedUserData, [name]: value });
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            const selectedFile = event.target.files[0];
            setImageFile(selectedFile);
            const imageUrl = `/media/user_photo/${selectedFile.name}`;
            setImageUrl(imageUrl);
            const url = URL.createObjectURL(selectedFile);
            setPreviewImageUrl(url);
        }
    };
    const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        try {
            if (!validateEmail(editedUserData.email)) {
                setErrors({ ...errors, email: 'Введите корректный email' });
                return;
            }
            if (editedUserData.username.length < 4) {
                setErrors({ ...errors, username: 'Логин должен содержать не менее 4 символов' });
                return;
            }

            const formData = new FormData();
            formData.append('username', editedUserData.username);
            formData.append('email', editedUserData.email);
            formData.append('first_name', editedUserData.first_name);
            formData.append('password', editedUserData.password);
            formData.append('is_active', '1');

            if (pictureFile) {
                formData.append('picture', pictureFile);
            }

            const response = await axiosInstance.put(`custom-users/${editedUserData.id}/`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (response.status === 200) {
                const updatedUserData = { ...editedUserData };
                if (pictureFile) {
                    updatedUserData.picture = imageUrl;
                }
                setUserData(updatedUserData.email, updatedUserData.id, updatedUserData.username, updatedUserData.picture, updatedUserData.role, true, null);
                updateUserData(updatedUserData);
                setEditing(false);
            } else {
                console.error('Ошибка при обновлении данных пользователя');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                if (
                    error.response.status === 400 &&
                    error.response.data &&
                    error.response.data.username
                ) {
                    setErrors({ ...errors, username: 'Пользователь с таким именем уже существует' });
                }
                if (
                    error.response.status === 400 &&
                    error.response.data &&
                    error.response.data.email
                ) {
                    setErrors({ ...errors, email: 'Пользователь с такой почтой уже существует' });
                }
            } else {
                console.error('Ошибка при регистрации:', error);
            }
        }
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
      <ProfilePage
        isAuthenticated={isAuthenticated}
        userData={userData}
        editing={editing}
        editedUserData={editedUserData}
        previewImageUrl={previewImageUrl}
        errors={errors}
        handleEditButtonClick={handleEditButtonClick}
        handleInputChange={handleInputChange}
        handleFileChange={handleFileChange}
        handleFormSubmit={handleFormSubmit}
  />
    );
};

const mapStateToProps = (state: any) => ({
    isAuthenticated: state.auth.isAuthenticated,
    userData: state.auth.userData,
});

const ProfilePageContainerWithAuthorization = withAuthorization(ProfilePageContainer);

export default connect(mapStateToProps, 
{setUserData, updateUserData })
(ProfilePageContainerWithAuthorization);
