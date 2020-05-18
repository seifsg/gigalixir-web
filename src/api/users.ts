import { HttpError } from 'ra-core'
import _ from 'lodash/fp'
import * as api from './api'

type tier = 'STANDARD' | 'FREE'
interface Response {
  tier: tier
  api_key: string
  email: string
  credit_cents: number
}
export interface User {
  id: 'ignored'
  tier: tier
  apiKey: string
  email: string
  creditCents: number
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
          id: 'ignored',
          tier: response.data.data.tier,
          apiKey: response.data.data.api_key,
          email: response.data.data.email,
          creditCents: response.data.data.credit_cents
        }
      }
    })
}


export const create = (
  email: string,
  password: string
): Promise<{ data: { id: string } }> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users`, {
      email,
      password
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch((reason: { response: { data: api.ErrorResponse; status: number } }) => {
      // {"errors":{"password":["should be at least 4 character(s)"],"email":["has invalid format"]}}
      const { errors } = reason.response.data
      throw new HttpError('', reason.response.status, {
        errors
      })
    })
}

export const resendConfirmation = (
  email: string
): Promise<{ data: { id: string } } | api.ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/reconfirm_email`, {
      email
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch(
      (reason: {
        response: { data: api.ErrorResponse; status: number }
      }): api.ErrorResponse => {
        // {"errors":{"password":["should be at least 4 character(s)"],"email":["has invalid format"]}}
        const { errors } = reason.response.data
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const resetPassword = (
  email: string
): Promise<{ data: { id: string } } | api.ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/reset_password`, {
      email
    })
    .then((): { data: { id: string } } => {
      return { data: { id: email } }
    })
    .catch(
      (reason: {
        response: { data: api.ErrorResponse; status: number }
      }): api.ErrorResponse => {
        const { errors } = reason.response.data
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const setPassword = (
  token: string,
  newPassword: string
): Promise<{ data: { id: string } } | api.ErrorResponse> => {
  return api
    .post<{ data: {} }>(`/frontend/api/users/set_password`, {
      token,
      password: newPassword
    })
    .then((): { data: { id: string } } => {
      return { data: { id: token } }
    })
    .catch(
      (reason: {
        response: { data: api.ErrorResponse; status: number }
      }): api.ErrorResponse => {
        const { errors } = reason.response.data
        throw new HttpError('', reason.response.status, {
          errors
        })
      }
    )
}

export const upgrade = (token: string): Promise<{}> => {
  return api
    .post('/frontend/api/upgrade', {
      // eslint-disable-next-line @typescript-eslint/camelcase
      stripe_token: token
    })
    .then((): { data: { id: string } } => {
      return { data: { id: token } }
    })
    .catch(
      (reason: {
        response: { data: api.ErrorResponse; status: number }
      }): api.ErrorResponse => {
        const { errors } = reason.response.data
        // TODO: once we kill the elm frontend, change the errors key here from "" to something more meaningful like "stripe_token" maybe
        throw new HttpError(_.join('. ', errors['']), reason.response.status, {
          errors
        })
      }
    )
}
