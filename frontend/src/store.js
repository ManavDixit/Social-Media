import {configureStore} from '@reduxjs/toolkit';
import postReducer from './Reducers/Posts';
import alertReducer from './Reducers/Alert';
import postInfoReducer from './Reducers/postInfo';
import profileReducer from './Reducers/Profile';
import messagesReducer from './Reducers/Messages';
export const store=configureStore({
    reducer:{
        posts:postReducer,
        alert:alertReducer,
        postInfo:postInfoReducer,
        profile:profileReducer,
        messages:messagesReducer,
    }
});
