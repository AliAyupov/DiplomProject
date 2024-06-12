import React, { useState } from 'react';
import axiosInstance from '../http/axios';
import { NavLink} from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { FormControl, InputLabel, MenuItem, Select } from '@material-ui/core';
import { NoAuthorization } from './hoc/NoAuthRedirect';
import { connect } from 'react-redux';
import { setUserData } from '../redux/auth-reducer';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  select: { 
    minWidth: '200px',
  },
}));

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
  userData: UserData;
  setUserData: (email: string, id: string, login: string, picture: string, role:string, isAuthenticated: boolean, userData:any) => void;
}

const SignUp: React.FC<Props> = ({ userData, setUserData }) => {
  const classes = useStyles();
  const [userId, setUserId] = useState(0);
  const [selectedRole, setSelectedRole] = useState('student');
  
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: '',
  });
  const [formErrors, setFormErrors] = useState({
    email: '',
    username: '',
    password: '',
  });
  const handleChangeSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedRole(event.target.value as string);
  
  };
  
  const handleChange = (e: { target: { name: any; value: string; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };
  const handleChooseRole = async () => {
    const foData = new FormData();
    foData.append('role', selectedRole);
    foData.append('username', formData.username);
    foData.append('email', formData.email);
    foData.append('password', formData.password);
    foData.append('is_active', '1');
    
    try {
      const response = await axiosInstance.put(`custom-users/${userId}/`, foData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      console.log('Пользователь успешно обновлен:', response.data);
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error);
    }
  };
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const isValid = validateForm();

    if (isValid) {
        axiosInstance
            .post('auth/users/', {
                email: formData.email,
                username: formData.username,
                password: formData.password
            })
            .then((res) => {
                setUserId(res.data.id);
                
                axiosInstance
                    .post('persons/', {
                        user: res.data.id,
                        head: 0,
                        shoes: 0,
                        bruke: 0,
                        tshort: 0,
                        arm: 0
                    })
                    .then((response) => {
                        
                    })
                    .catch((error) => {
                        
                    });

                if (selectedRole !== 'student') {
                  axiosInstance
                        .put(`custom-users/${res.data.id}/`, { 
                          role: selectedRole})
                        .then((response) => {
                            console.log('Роль успешно обновлена:', response.data);
                        })
                        .catch((error) => {
                            console.error('Ошибка при обновлении роли:', error);
                        });
                }
                axiosInstance
                    .post('token/', {
                        username: formData.username,
                        password: formData.password,
                    })
                    .then(async (res) => {
                      localStorage.setItem('access_token', res.data.access);
                      localStorage.setItem('refresh_token', res.data.refresh);
                      axiosInstance.defaults.headers['Authorization'] =
                      'Bearer ' + localStorage.getItem('access_token');
                      if (localStorage.getItem('access_token')) {
                                const responseUser = await axiosInstance.get('auth/users/me/');
                                const userData = responseUser.data;
                                const { email, id, username} = userData;
                                const userId = userData.id;
                                const responseUserProfile = await axiosInstance.get(`custom-users/${userId}/`);
                                const userProfileData: UserData = responseUserProfile.data;
                                setUserData(email, id, username, userProfileData.picture, userProfileData.role, true, userProfileData);
                              } else {
                                setUserData('', '','', '','', false, null);
                              }
                    })
                    .catch((error) => {
                        console.error('Ошибка при входе:', error);
                    });
            })
            .catch((error) => {
                if (error.response && error.response.data) {
                    if (error.response.status === 400 && error.response.data && error.response.data.username) {
                        setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            username: 'Пользователь с таким именем уже существует',
                        }));
                    }
                    if (error.response.status === 400 && error.response.data && error.response.data.email) {
                        setFormErrors((prevErrors) => ({
                            ...prevErrors,
                            email: 'Пользователь с такой почтой уже существует',
                        }));
                    }
                } else {
                    console.error('Ошибка при регистрации:', error);
                }
            });
    }
};
  const validateForm = () => {
    let errors:any = {};
    let isValid = true;

    if (!formData.email) {
      errors.email = 'Почта отсутствует';
      isValid = false;
    } else if (!/\S+@\S+\.\S{2,}/.test(formData.email)) {
      errors.email = 'Такой почты не существует';
      isValid = false;
    } else {
      errors.email = ''; 
    }

    if (!formData.username) {
      errors.username = 'Имя пользователя отсутствует';
      isValid = false;
    } else if (formData.username.length < 5 || formData.username.length > 30) {
      errors.username = 'Имя пользователя должно быть не менее 5-ех и не более 30-ти символов в длину';
      isValid = false;
    } else {
      errors.username = ''; 
    }

    if (!formData.password) {
      errors.password = 'Пароль отсутствует';
      isValid = false;
    } else if (formData.password.length < 8 || formData.password.length > 50) {
      errors.password = 'Пароль должен быть не менее 8-ми и не  более 50-ти символов в длину';
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      errors.password = 'Пароль должен содержать цифру';
      isValid = false;
    } else {
      errors.password = '';
    }

    setFormErrors(errors);
    return isValid;
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        
        <Avatar className={classes.avatar}></Avatar>
        <Typography component="h1" variant="h5">
          Регистрация
        </Typography>
        
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Ваша почта"
                name="email"
                autoComplete="email"
                onChange={handleChange}
                error={!!formErrors.email}
                helperText={formErrors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="username"
                label="Логин"
                name="username"
                autoComplete="username"
                onChange={handleChange}
                error={!!formErrors.username}
                helperText={formErrors.username}
              />
              </Grid>
              
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Пароль"
                type="password"
                id="password"
                autoComplete="current-password"
                onChange={handleChange}
                error={!!formErrors.password}
                helperText={formErrors.password}
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel htmlFor="role-select">Роль</InputLabel>
              <Select
                className={classes.select}
                value={selectedRole}
                onChange={handleChangeSelect}
                inputProps={{ name: "role", id: "role-select" }}
              >
                <MenuItem value="" disabled>
                  Выберите роль
                </MenuItem>
                <MenuItem value="student">Студент</MenuItem>
                <MenuItem value="tutor">Тьютор</MenuItem>
                <MenuItem value="producer">Продюсер</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="Я хочу получать уведомления на свою почту"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSubmit}
          >
            Зарегистрироваться
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NavLink to="/login">
                У вас уже есть аккаунт? Войти
              </NavLink>
            </Grid>
          </Grid>
        </form> 
      </div>
    </Container>
  );
}
const mapStateToProps = (state: any) => ({
  userData: state.auth.userData,
  setUserData: state.auth.setUserData,
  isAuthenticated: state.auth.isAuthenticated
});

const SingInNoAuthorization = NoAuthorization(SignUp);

export default connect(mapStateToProps,{setUserData})(SingInNoAuthorization);