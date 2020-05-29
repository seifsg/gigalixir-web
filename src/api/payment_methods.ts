import _ from 'lodash/fp'
import { HttpError } from 'ra-core'
import * as api from './api'

interface Response {
  brand: string
  exp_month: number
  exp_year: number
  last4: number
}

export interface PaymentMethod {
  id: 'ignored' // react-admin checks this
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
    .then((): { data: { id: string } } => {
      return { data: { id: token } }
    })
    .catch(error => {
      return Promise.reject(
        new HttpError(
          _.join('. ', error.body.stripe_token),
          error.response.status,
          error.body
        )
      )
    })
}

export const get = (): Promise<{ data: PaymentMethod }> => {
  return api
    .get<{ data: Response }>('/frontend/api/payment_methods')
    .then((response): { data: PaymentMethod } => {
      return {
        data: {
          id: 'ignored',
          brand: response.data.data.brand,
          expMonth: response.data.data.exp_month,
          expYear: response.data.data.exp_year,
          last4: response.data.data.last4
        }
      }
    })
}
