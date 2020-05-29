import axios from 'axios'
import { get } from './api'

describe('gets', () => {
  it('just gets', done => {
    const content = 'fake-content'
    const mock = jest.spyOn(axios, 'get')
    mock.mockResolvedValueOnce({ data: { data: content } })

    const result = get<{ data: string }>('/foo')
    result
      .then((r: { data: { data: string } }) => {
        expect(r.data.data).toStrictEqual(content)
        expect(mock).toHaveBeenCalled()
      })
      .catch((reason: { message: string }) => {
        done.fail(reason)
      })
      .finally(() => {
        mock.mockRestore()
        done()
      })
  })
})
