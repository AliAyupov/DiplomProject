const SET_USER_DATA = 'SET_USER_DATA';
const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
const SET_IMAGE_FILE = 'SET_IMAGE_FILE'; 

interface AuthState {
  userId: string | null;
  email: string | null;
  login: string | null;
  picture: string | null;
  isAuthenticated: boolean;
  userData: UserData | null;
  imageFile: File | null;
}

interface Action {
  type: string;
  data: AuthState;
  userData: UserData;
  imageFile: File;
}
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
}
const initialState: AuthState = {
  userId: null,
  email: null,
  login: null,
  picture: null,
  isAuthenticated: false,
  userData: null,
  imageFile: null
};

const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, ...action.data };
    case UPDATE_USER_DATA:
      return { ...state, userData: action.userData };
    case SET_IMAGE_FILE: 
      return { ...state, imageFile: action.imageFile };
    default:
      return state;
  }
};

export const setUserData = (email: string, id: string, login: string, picture: string, isAuthenticated: boolean, userData: any) => ({
    type: SET_USER_DATA,
    data: { email, id, login, picture, isAuthenticated, userData }, 
  });

export const updateUserData = (userData: UserData) => ({
    type: UPDATE_USER_DATA,
    userData,
  });

  export const setImageFile = (imageFile: File) => ({
    type: SET_IMAGE_FILE,
    imageFile,
  });

export default authReducer;
