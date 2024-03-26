import React, { useState } from 'react';
import axiosInstance from '../http/axios';
import { NavLink, useNavigate } from 'react-router-dom';
// Material UI
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';


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
}));

export default function SignUp() {
  const navigate = useNavigate();
  const classes = useStyles();

  // Состояние для формы и ошибок
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

  // Функция обновления состояния формы
  const handleChange = (e: { target: { name: any; value: string; }; }) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value.trim(),
    });
  };

  // Функция валидации формы и отправки данных
  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    // Проверка валидности формы
    const isValid = validateForm();

    // Если форма валидна, отправляем данные
    if (isValid) {
      axiosInstance
        .post('auth/users/', {
          email: formData.email,
          username: formData.username,
          password: formData.password,
        })
        .then((res) => {
          navigate('/');
        })
        .catch((error) => {
          if (error.response && error.response.data) {
            if (
              error.response.status === 400 &&
              error.response.data &&
              error.response.data.username 
            ) {
              setFormErrors(prevErrors => ({
                ...prevErrors,
                username: 'Пользователь с таким именем уже существует',
              }));
            }
            if (
              error.response.status === 400 &&
              error.response.data &&
              error.response.data.email 
            ) {
              setFormErrors(prevErrors => ({
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

  // Функция валидации формы
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
      errors.email = ''; // Очищаем ошибку, если email валиден
    }

    if (!formData.username) {
      errors.username = 'Имя пользователя отсутствует';
      isValid = false;
    } else if (formData.username.length < 5) {
      errors.username = 'Имя пользователя должно быть не менее 5-ех символов в длину';
      isValid = false;
    } else {
      errors.username = ''; // Очищаем ошибку, если username заполнен
    }

    if (!formData.password) {
      errors.password = 'Пароль отсутствует';
      isValid = false;
    } else if (formData.password.length < 8) {
      errors.password = 'Пароль должен быть не менее 8-ми символов в длину';
      isValid = false;
    } else if (!/\d/.test(formData.password)) {
      errors.password = 'Пароль должен содержать цифру';
      isValid = false;
    } else {
      errors.password = ''; // Очищаем ошибку, если password заполнен
    }

    setFormErrors(errors); // Обновляем состояние ошибок
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
                label="Имя пользователя"
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