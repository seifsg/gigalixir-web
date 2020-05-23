import axios, { AxiosError } from 'axios'

const host = process.env.REACT_APP_API_HOST

export interface ErrorResponse {
  errors: { [x: string]: string[] }
}

const getCsrf = async (): Promise<string> => {
  const response = await axios.get(`${host}/frontend/api/csrf`, {
    withCredentials: true
  })
  return response.data.data
}

export const get = <T>(path: string): Promise<T> =>
  axios.get(host + path, { withCredentials: true })

export const post = <T>(path: string, data: object): Promise<T> =>
  getCsrf()
    .then(
      (csrfToken): Promise<T> =>
        axios.post(host + path, data, {
          headers: { 'X-CSRF-Token': csrfToken },
          withCredentials: true
        })
    )
    .catch(
      (params: AxiosError<T>): Promise<T> => {
        if (params.response && params.response.status === 500) {
          // probably no extra information here
          return Promise.reject<T>({
            response: {
              data: {
                errors: {
                  '': [
                    'Oops, something went wrong. Please contact help@gigalixir.com'
                  ]
                }
              }
            }
          })
        }
        // this here feels like a big hack in order to get the
        // types to line up.
        // see https://github.com/microsoft/TypeScript/issues/7588
        return Promise.reject<T>(params)
      }
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
