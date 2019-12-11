import axios from 'axios'

const host = process.env.REACT_APP_API_HOST

const getCsrf = async (): Promise<string> => {
  const response = await axios.get(`${host}/frontend/api/csrf`, {
    withCredentials: true
  })
  return response.data.data
}

export const get = <T>(path: string): Promise<T> =>
  axios.get(host + path, { withCredentials: true })

export const post = <T>(path: string, data: object): Promise<T> =>
  getCsrf().then(
    (csrfToken): Promise<T> =>
      axios.post(host + path, data, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
  )

export const put = <T>(path: string, data: object): Promise<T> =>
  getCsrf().then(
    (csrfToken): Promise<T> =>
      axios.put(host + path, data, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
  )

export const del = <T>(path: string): Promise<T> =>
  getCsrf().then(
    (csrfToken): Promise<T> =>
      axios.delete(host + path, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
  )
