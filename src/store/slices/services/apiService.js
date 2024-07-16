import axios from "axios";
export const BASE_URL = 'http://localhost:3210/client-api/v1';    

const getToken = () => {
    const innertoken = localStorage.getItem('authToken')
    const token = "Bearer " + innertoken
    return token
}

export const AXIOS_POST = async (url, body, headers) => {
    try {
        const response = await axios({
            method: 'POST',
            url: BASE_URL + url,
            headers: {
                ...headers,
                authorization: getToken()
            },
            data: body
        });

        return response.data;
    } catch (error) {
        if (error) {
            return error.response;
        } else {
            return null
        }
    }
}

export const AXIOS_GET = async (url, body, headers) => {
    try {
        const response = await axios({
            method: 'GET',
            // url: BASE_URL + url,
            url: url,
            // headers: {
            //     authorization: getToken()
            // },
        });
        return response
    } catch (error) {
        console.log('error')
        if (error) {
            return error.response
        } else {
            return null
        }
    }
}


export const AXIOS_PATCH = async (url, body, headers) => {
    try {
        const response = await axios({
            method: 'PATCH',
            url: BASE_URL + url,
            headers: {
                authorization: getToken()
            },
            data: body
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // clearToken();
        }

        return error.response.data;
    }
}

export const AXIOS_DELETE = async (url, headers) => {
    try {
        const response = await axios({
            method: 'DELETE',
            url: BASE_URL + url,
            headers: {
                authorization: getToken()
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.status === 401) {
            // clearToken();
        }

        return error.response.data;
    }
}