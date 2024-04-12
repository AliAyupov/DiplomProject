import {  combineReducers} from "redux";
import homeReducer from "./home-reducer";
import { configureStore } from '@reduxjs/toolkit';
import authReducer from "./auth-reducer";


let reducers = combineReducers({
    homePage: homeReducer,
    auth: authReducer
});

let store = configureStore({reducer:reducers});

export default store;