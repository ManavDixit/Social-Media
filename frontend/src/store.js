import {configureStore} from '@reduxjs/toolkit';
import postReducer from './Reducers/Posts';
import alertReducer from './Reducers/Alert';
import postInfoReducer from './Reducers/postInfo';
import ProfileReducer from './Reducers/Profile';
export const store=configureStore({
    reducer:{
        posts:postReducer,
        alert:alertReducer,
        postInfo:postInfoReducer,
        profile:ProfileReducer
    }
});
