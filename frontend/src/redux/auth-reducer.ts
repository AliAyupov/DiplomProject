const SET_USER_DATA = 'SET_USER_DATA';

interface AuthState {
  userId: string | null;
  email: string | null;
  login: string | null;
  picture: string | null;
  isAuthenticated: boolean;
}

interface Action {
  type: string;
  data: AuthState;
}

const initialState: AuthState = {
  userId: null,
  email: null,
  login: null,
  picture: null,
  isAuthenticated: false,
};

const authReducer = (state: AuthState = initialState, action: Action): AuthState => {
  switch (action.type) {
    case SET_USER_DATA:
      return { ...state, ...action.data };
    default:
      return state;
  }
};

export const setUserData = (email: string, id: string, login: string, picture: string, isAuthenticated: boolean) => ({
    type: SET_USER_DATA,
    data: { email, id, login, picture, isAuthenticated }, 
  });

export default authReducer;
