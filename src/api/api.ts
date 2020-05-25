import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios'

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

export const get = <T>(path: string): AxiosPromise<T> =>
  axios.get(host + path, { withCredentials: true }).catch(
    (params: AxiosError<T>): AxiosPromise<T> => {
      if (params.response && params.response.status === 500) {
        // probably no extra information here
        return Promise.reject<AxiosResponse<T>>({
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
      return Promise.reject<AxiosResponse<T>>(params)
    }
  )

export const post = <T>(
  path: string,
  data: object
): Promise<AxiosResponse<T>> =>
  getCsrf()
    .then(csrfToken =>
      axios.post(host + path, data, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
    )
    .catch(
      (params: AxiosError<T>): AxiosPromise<T> => {
        if (params.response && params.response.status === 500) {
          // probably no extra information here
          return Promise.reject<AxiosResponse<T>>({
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
        return Promise.reject<AxiosResponse<T>>(params)
      }
    )

export const put = <T>(path: string, data: object): AxiosPromise<T> =>
  getCsrf()
    .then(csrfToken =>
      axios.put(host + path, data, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
    )
    .catch(
      (params: AxiosError<T>): AxiosPromise<T> => {
        if (params.response && params.response.status === 500) {
          // probably no extra information here
          return Promise.reject<AxiosResponse<T>>({
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
        return Promise.reject<AxiosResponse<T>>(params)
      }
    )

export const del = <T>(path: string): AxiosPromise<T> =>
  getCsrf()
    .then(csrfToken =>
      axios.delete(host + path, {
        headers: { 'X-CSRF-Token': csrfToken },
        withCredentials: true
      })
    )
    .catch(
      (params: AxiosError<T>): AxiosPromise<T> => {
        if (params.response && params.response.status === 500) {
          // probably no extra information here
          return Promise.reject<AxiosResponse<T>>({
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
        return Promise.reject<AxiosResponse<T>>(params)
      }
    )
