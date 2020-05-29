import axios, { AxiosResponse, AxiosError, AxiosPromise } from 'axios'
import _ from 'lodash/fp'
import { HttpError } from 'ra-core'
import logger from '../logger'

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

// I'm unsure why, but passing this function directly into
// catch doesn't type check. Calling it in sort of an identity sort
// of way does. Weird.
const handle500 = <T>(params: AxiosError<T>): AxiosPromise<T> => {
  if (params.response && params.response.status === 500) {
    // probably no extra information here
    // this is an AxiosError instead of an HttpError to preserve
    // the axios return type that way existing code does not need
    // to be changed.
    //
    // i tihnk we should change all of api.ts to hide axios and always
    // return HttpError and never axios stuff? but what about success?
    // does it continue to return AxiosResponse?
    // eslint-disable-next-line prefer-promise-reject-errors
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

const handleError = (reason: AxiosError<ErrorResponse>) => {
  logger.info(JSON.stringify(reason))
  if (reason.response) {
    logger.info(JSON.stringify(reason.response))
    const { data, status } = reason.response
    const { errors } = data
    if (status === 401) {
      return Promise.reject(new HttpError(`Please Sign In`, status, data))
    }
    if (errors !== undefined) {
      // I like rejecting here intead of throwing. It seems safer and works
      // fine with react-admin which uses redux-saga. Also,
      // it will be an error in future versions of nodejs according
      // to some warnings I saw
      return Promise.reject(
        new HttpError(_.join('. ', errors[''] || []), status, {
          errors
        })
      )
    }
    return Promise.reject(
      new HttpError(`Unknown Axios Error ${status}`, status, data)
    )
  }

  return Promise.reject(
    new HttpError('Unknown Axios Error', 500, reason.toJSON())
  )
}

export const get = <T>(path: string): AxiosPromise<T> =>
  axios
    .get(host + path, { withCredentials: true })
    .catch(
      (params: AxiosError<T>): AxiosPromise<T> => {
        return handle500(params)
      }
    )
    .catch(handleError)

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
        return handle500(params)
      }
    )
    .catch(handleError)

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
        return handle500(params)
      }
    )
    .catch(handleError)

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
        return handle500(params)
      }
    )
    .catch(handleError)
