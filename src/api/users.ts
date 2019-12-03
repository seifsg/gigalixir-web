import { HttpError } from 'ra-core'
import * as api from './api'

type tier = 'STANDARD' | 'FREE'
interface Response {
  tier: tier
  email: string
  credit_cents: number
}
interface User extends Response {
  id: 'profile'
}
export const get = (): Promise<{ data: User }> => {
  return api
    .get<{ data: { data: Response } }>(`/frontend/api/users`)
    .then((response): { data: User } => {
      // logger.debug(JSON.stringify(response))
      // debug = {
      //   data: { data: { tier: 'STANDARD', email: 'fake@email.com', credit_cents: 0 } },
      // }

      return {
        data: {
          id: 'profile',
          ...response.data.data
        }
      }
    })
}

interface ErrorResponse {
  errors: { [x: string]: string[] }
}

export const create = (
  email: string,
  password: string
): Promise<{ data: { id: string } } | ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users`, {
      email,
      password
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch(
      (reason: {
        response: { data: ErrorResponse; status: number }
      }): ErrorResponse => {
        // {"errors":{"password":["should be at least 4 character(s)"],"email":["has invalid format"]}}
        const { errors } = reason.response.data
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const resend_confirmation = (
    email: string
): Promise<{ data: { id: string } } | ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/reconfirm_email`, {
      email
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch(
      (reason: {
        response: { data: ErrorResponse; status: number }
      }): ErrorResponse => {
        // {"errors":{"password":["should be at least 4 character(s)"],"email":["has invalid format"]}}
        const { errors } = reason.response.data
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const reset_password = (
    email: string
): Promise<{ data: { id: string } } | ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/reset_password`, {
      email
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch(
      (reason: {
        response: { data: ErrorResponse; status: number }
      }): ErrorResponse => {
          console.log('set_password error')
        const { errors } = reason.response.data
          console.log(JSON.stringify(errors))
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const set_password = (
    token: string,
    newPassword: string
): Promise<{ data: { id: string } } | ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/set_password`, {
        token: token,
     password: newPassword
    })
    .then((): { data: { id: string } } => {
      return { data: { id: token } }
    })
    .catch(
      (reason: {
        response: { data: ErrorResponse; status: number }
      }): ErrorResponse => {
          console.log('reset_password error')
        const { errors } = reason.response.data
          console.log(JSON.stringify(errors))
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}