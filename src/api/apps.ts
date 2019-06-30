import axios from 'axios'

const host = process.env.REACT_APP_API_HOST

export const get = () => axios.get(host + "/frontend/api/apps")
