import axios from 'axios'

const host = process.env.REACT_APP_API_HOST

const get_csrf = async (): Promise<string> => {
    const response = await axios.get(host + '/frontend/api/csrf', { withCredentials: true });
    return response.data.data;
}

export const get = (path: string) =>
    axios.get(host + path, { withCredentials: true })

export const post = (path: string, data: object) =>
    get_csrf()
        .then(csrf_token => axios.post(host + path, data, { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true }))

export const del = (path: string) =>
    get_csrf()
        .then(csrf_token => axios.delete(host + path, { headers: { "X-CSRF-Token": csrf_token }, withCredentials: true }))
