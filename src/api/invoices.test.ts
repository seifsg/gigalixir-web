import axios from 'axios'
import { pdfs } from './invoices'

describe('pdfs', (): void => {
  it('fetches ', (done): void => {
    const response = [
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        period_end: '2020-05-27T21:40:43Z',
        // eslint-disable-next-line @typescript-eslint/camelcase
        period_start: '2020-04-27T21:40:43Z',
        // eslint-disable-next-line @typescript-eslint/camelcase
        amount_cents: 1234,
        // eslint-disable-next-line @typescript-eslint/camelcase
        pdf: 'https://pay.stripe.com/invoice/foo/foo/pdf'
      }
    ]
    const mock = jest.spyOn(axios, 'get')
    mock.mockResolvedValueOnce({ data: { data: response } })

    const result = pdfs()
    result
      .then((r): void => {
        expect(r.data).toStrictEqual([
          {
            id: 'https://pay.stripe.com/invoice/foo/foo/pdf',
            pdf: 'https://pay.stripe.com/invoice/foo/foo/pdf',
            amountCents: 1234,
            periodEnd: new Date('2020-05-27T21:40:43Z'),
            periodStart: new Date('2020-04-27T21:40:43Z')
          }
        ])
        expect(r.total).toBe(1)
        expect(mock).toHaveBeenCalled()
      })
      .catch((reason): void => {
        done.fail(reason)
      })
      .finally((): void => {
        mock.mockRestore()
        done()
      })
  })
})
