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
  return api.get<{ data: Response }>(`/frontend/api/users`).then((response): {
    data: User
  } => {
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
}
