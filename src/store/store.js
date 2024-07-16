import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import { reducer as toastrReducer } from 'react-redux-toastr';

const ReduxStore = configureStore({
    reducer: {
        auth:authReducer,
        toastr:toastrReducer,
    }
});

export default ReduxStore;
