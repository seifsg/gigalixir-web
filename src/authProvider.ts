import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import axios from 'axios';

let host = "http://localhost:4000"

function logError(reason: any) {
    console.log(reason)
    return Promise.reject(reason)
}

function get_csrf() {
    return axios.get(host + '/frontend/api/csrf', { withCredentials: true })
        .then(response => response.data.data)
        .catch(logError)
}

export default (auth_type: any, params: any) => {
    // called when the user attempts to log in
    if (auth_type === AUTH_LOGIN) {
        const { username, password } = params;
        return get_csrf()
            .then(function (csrf_token) {
                return axios.post(host + '/frontend/api/sessions', { session: { email: username, password: password } }, { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true })
                    .then(response => response.data)
                    .catch(logError)
            })
            .catch(logError)
        }
    // called when the user clicks on the logout button
    if (auth_type === AUTH_LOGOUT) {
        return get_csrf()
            .then(function (csrf_token) {
                return axios.delete(host + '/frontend/api/sessions', { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true })
                    .then(response => response.data)
                    .catch(logError)

            })
            .catch(logError)
        }
    // called when the API returns an error
    if (auth_type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            return get_csrf()
                .then(function (csrf_token) {
                    return axios.delete(host + '/frontend/api/sessions', { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true })
                        .then(response => response.data)
                        .catch(logError)
                })
                .catch(logError)
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (auth_type === AUTH_CHECK) {
        return axios.get(host + '/frontend/api/sessions', { withCredentials: true })
            .then(response => response.data)
            .catch(logError)
    }
    return Promise.reject('Unknown method');
};
