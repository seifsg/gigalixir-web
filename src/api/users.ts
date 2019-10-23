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

interface CreateErrorResponse {
  errors: { [x: string]: string[] }
}

export const create = (
  email: string,
  password: string
): Promise<{ data: { id: string } } | CreateErrorResponse> => {
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
        response: { data: CreateErrorResponse; status: number }
      }): CreateErrorResponse => {
        // {"errors":{"password":["should be at least 4 character(s)"],"email":["has invalid format"]}}
        const { errors } = reason.response.data
        throw new HttpError('fake-message', reason.response.status, {
          errors
        })
      }
    )
}
