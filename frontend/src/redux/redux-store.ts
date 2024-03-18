import {  combineReducers} from "redux";
import homeReducer from "./home-reducer";
import { configureStore } from '@reduxjs/toolkit';


let reducers = combineReducers({
    homePage: homeReducer
});

let store = configureStore({reducer:reducers});

export default store;