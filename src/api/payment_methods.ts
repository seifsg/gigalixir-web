import * as api from './api'

interface Response {
  brand: string
  exp_month: number
  exp_year: number
  last4: number
}

export interface PaymentMethod {
  id: undefined // any way to not have this?
  brand: string
  expMonth: number
  expYear: number
  last4: number
}

export const update = (token: string): Promise<{ data: {} }> => {
  return api
    .put<{ data: {} }>(`/frontend/api/payment_methods`, {
      // eslint-disable-next-line @typescript-eslint/camelcase
      stripe_token: token
    })
    .then((): { data: {} } => {
      return {
        data: {}
      }
    })
}

export const get = (): Promise<{ data: PaymentMethod }> => {
  return api
    .get<{ data: { data: Response } }>('/frontend/api/payment_methods')
    .then((response): { data: PaymentMethod } => {
      return {
        data: {
          id: undefined,
          brand: response.data.data.brand,
          expMonth: response.data.data.exp_month,
          expYear: response.data.data.exp_year,
          last4: response.data.data.last4
        }
      }
    })
}
