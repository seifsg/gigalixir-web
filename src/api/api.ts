import axios from 'axios'

const host = process.env.REACT_APP_API_HOST

export const get = (path: string) => axios.get(host + path, { withCredentials: true })
