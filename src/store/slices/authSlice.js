import { createSlice } from '@reduxjs/toolkit';
import { AXIOS_GET, AXIOS_PATCH, AXIOS_POST } from './services/apiService';
import { toastr } from 'react-redux-toastr';

const initialState = {
    currentUser: {},
}

const userAuthSlice = createSlice({
    name: 'userAuth',
    initialState,
    reducers: { },
})

export const loginMethod = (payload, navigate) => async (dispatch) => {  
    
    const response = await AXIOS_POST('/login', payload, {});
    if(response?.statusText == "Unauthorized"){
        toastr.error('Error', response?.data);
    }else{
        if(response?.status){
            let token = response?.data?.user?.userToken;
            localStorage.setItem('authToken', token);
            toastr.success('Success',  response?.data?.message);
            navigate('/generate-link', { replace: true });
        }else{
            console.log(response?.data?.message)
            toastr.error('Error', response?.data?.message);
            // navigate('/404');        
        }
    }   
};


export const makeNewLink = (payload, navigate) => async (dispatch) => {  
    
    const response = await AXIOS_POST('/make-link', payload, {});
    if(response?.statusText == "Unauthorized"){
        console.log('--- response?.data ', response?.data)
        toastr.error('Error', response?.data);
    }else{

        console.log(response?.data)
        if(response?.status){
            let token = response?.data?.user?.userToken;
            localStorage.setItem('authToken', token);
            toastr.success('Success',  response?.data?.message);
            navigate('/generate-link', { replace: true });
        }else{
            console.log(response?.data?.message)
            toastr.error('Error', response?.data?.message);
        }
    }    
};

export default userAuthSlice.reducer