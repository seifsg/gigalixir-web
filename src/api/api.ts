import axios from 'axios'

const host = process.env.REACT_APP_API_HOST

const getCsrf = async (): Promise<string> => {
    const response = await axios.get(host + '/frontend/api/csrf', { withCredentials: true });
    return response.data.data;
}

export const get = (path: string): Promise<any> =>
    axios.get(host + path, { withCredentials: true })

export const post = (path: string, data: object): Promise<any> =>
    getCsrf()
        .then(( csrfToken ): Promise<any> => axios.post(host + path, data, { headers: { "X-CSRF-Token": csrfToken }, withCredentials: true }))

export const del = (path: string): Promise<any> =>
    getCsrf()
        .then(( csrfToken ): Promise<any> => axios.delete(host + path, { headers: { "X-CSRF-Token": csrfToken }, withCredentials: true }))
