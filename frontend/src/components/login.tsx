import React, { useState } from 'react';
import { connect} from 'react-redux'; 
import axiosInstance from '../http/axios';
import { NavLink, useNavigate } from 'react-router-dom';
//MaterialUI


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
import { setUserData } from '../redux/auth-reducer';
import { NoAuthorization } from './hoc/NoAuthRedirect';

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
		marginTop: theme.spacing(1),
	},
	submit: {
		margin: theme.spacing(3, 0, 2),
	},
}));

const SignIn: React.FC<Props>=({setUserData, userData}) => {
	const navigate = useNavigate();
	const initialFormData = Object.freeze({
	  username: '',
	  password: '',
	});
  
	const [formData, updateFormData] = useState(initialFormData);
	const [errors, setErrors] = useState({
	  username: '',
	  password: '',
	});
  
	
	const handleChange = (e: { target: { name: any; value: string; }; }) => {
	  updateFormData({
		...formData,
		[e.target.name]: e.target.value.trim(),
	  });
	};
  
	const handleSubmit = (e: { preventDefault: () => void; }) => {
	  e.preventDefault();
	  if (!formData.username) {
		setErrors(prevErrors => ({
		  ...prevErrors,
		  username: 'Пожалуйста, введите имя пользователя',
		}));
		return;
	  }
	  if (!formData.password) {
		setErrors(prevErrors => ({
		  ...prevErrors,
		  password: 'Пожалуйста, введите пароль',
		}));
		return;
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
		  navigate('/');
		})
		.catch((error:any) => {
			if (error.response && error.response.status === 401 && error.response.data.detail === "No active account found with the given credentials") {
			  setErrors(prevErrors => ({
				...prevErrors,
				username: 'Неправильное имя пользователя или пароль',
				password: '',
			  }));
			} else {
			  console.error('Ошибка при входе:', error);
			}
		});
	};

	const classes = useStyles();
  
	return (
	  <Container component="main" maxWidth="xs">
		<CssBaseline />
		<div className={classes.paper}>
		  <Avatar className={classes.avatar}></Avatar>
		  <Typography component="h1" variant="h5">
			Войти
		  </Typography>
		  <form className={classes.form} noValidate>
			<TextField
			  variant="outlined"
			  margin="normal"
			  required
			  fullWidth
			  id="username"
			  label="Имя пользователя"
			  name="username"
			  autoComplete="username"
			  autoFocus
			  onChange={handleChange}
			  error={!!errors.username}
			  helperText={errors.username}
			/>
			<TextField
			  variant="outlined"
			  margin="normal"
			  required
			  fullWidth
			  name="password"
			  label="Пароль"
			  type="password"
			  id="password"
			  autoComplete="current-password"
			  onChange={handleChange}
			  error={!!errors.password}
			  helperText={errors.password}
			/>
			<FormControlLabel
			  control={<Checkbox value="remember" color="primary" />}
			  label="Запомнить меня"
			/>
			<Button
			  type="submit"
			  fullWidth
			  variant="contained"
			  color="primary"
			  className={classes.submit}
			  onClick={handleSubmit}
			>
			  Войти
			</Button>
			<Grid container>
			  <Grid item xs>
				<Link href="#" variant="body2">
				  Забыли пароль?
				</Link>
			  </Grid>
			  <Grid item>
				<NavLink to="/register">
				  {"У вас нет аккаунта? Регистрация"}
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


const SingInNoAuthorization = NoAuthorization(SignIn);

export default connect(mapStateToProps,{setUserData})(SingInNoAuthorization)