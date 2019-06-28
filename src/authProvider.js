import { AUTH_LOGIN, AUTH_LOGOUT, AUTH_ERROR, AUTH_CHECK } from 'react-admin';
import axios from 'axios';

let host = "http://localhost:4000"

function get_csrf() {
    return axios.get(host + '/frontend/api/csrf', { withCredentials: true })
        .then(function(response) {
            // handle success
            console.log(response);
            let csrf_token = response.data.data;
            console.log(csrf_token);
            return csrf_token;
        })
}

export default (type, params) => {
    // called when the user attempts to log in
    if (type === AUTH_LOGIN) {
        const { username, password } = params;
        return get_csrf()
            .then(function(csrf_token) {
                return axios.post(host + '/frontend/api/sessions', { session: { email: username, password: password } }, { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true });
            })
    }
    // called when the user clicks on the logout button
    if (type === AUTH_LOGOUT) {
        return get_csrf()
            .then(function(csrf_token) {
                return axios.delete(host + '/frontend/api/sessions', { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true });
            })
    }
    // called when the API returns an error
    if (type === AUTH_ERROR) {
        const { status } = params;
        if (status === 401 || status === 403) {
            return get_csrf()
                .then(function(csrf_token) {
                    return axios.delete(host + '/frontend/api/sessions', { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true });
                })
        }
        return Promise.resolve();
    }
    // called when the user navigates to a new location
    if (type === AUTH_CHECK) {
        return axios.get(host + '/frontend/api/sessions', { withCredentials: true });
    }
    return Promise.reject('Unknown method');
};