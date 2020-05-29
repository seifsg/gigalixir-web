import _ from 'lodash/fp'
import * as api from './api'

interface Response {
  period_start: string
  period_end: string
  amount_cents: number
  pdf: string
}

type Url = string
type Money = number

export interface Invoice {
  id: string // not really used, but required by react-admin
  periodStart: Date
  periodEnd: Date
  amountCents: Money
  pdf: Url
}

export const pdfs = (): Promise<{ data: Invoice[], total: number }> => {
  return api
    .get<{ data: Response[] }>(`/frontend/api/invoices/pdfs`)
    .then(response => {
      return {
        total: response.data.data.length,
        data: _.map(r => {
          return {
            id: r.pdf,
            pdf: r.pdf,
            amountCents: r.amount_cents,
            periodStart: new Date(r.period_start),
            periodEnd: new Date(r.period_end)
          }
        }, response.data.data)
      }
    })
}
