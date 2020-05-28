import axios from 'axios'
import { HttpError } from 'ra-core'
import { list, create } from './apps'

describe('list', (): void => {
  it('fetches ', (done): void => {
    const apps = [
      {
        // eslint-disable-next-line @typescript-eslint/camelcase
        unique_name: 'fake-app',
        stack: 'gigalixir-18',
        size: 1.0,
        replicas: 1,
        region: 'v2018-us-central1',
        cloud: 'gcp'
      }
    ]
    const mock = jest.spyOn(axios, 'get')
    mock.mockResolvedValueOnce({ data: { data: apps } })

    const result = list()
    result
      .then((r): void => {
        expect(r.data).toStrictEqual([
          {
            id: 'fake-app',
            stack: 'gigalixir-18',
            size: 1.0,
            replicas: 1,
            region: 'v2018-us-central1',
            cloud: 'gcp'
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

describe('create', (): void => {
  it('throws errors', (done): void => {
    // eslint-disable-next-line @typescript-eslint/camelcase
    const errors = { unique_name: ['is bad'], cloud: ['is also bad'] }
    const postMock = jest.spyOn(axios, 'post')
    const getMock = jest.spyOn(axios, 'get')
    getMock.mockResolvedValueOnce({ data: { data: 'fake-csrf' } })
    postMock.mockRejectedValueOnce({
      response: { status: 422, data: { errors } }
    })

    const result = create('fake-name', 'fake-cloud', 'fake-region')
      .then(() => {
        done.fail('The promise should have failed')
      })
      .catch(reason => {
        // failure here does not result in a failed test?! just a warning?
        // all we get is UnhandledPromiseRejectionWarning: Unhandled promise rejection. This error originated either by throwing inside of an async function without a catch block, or by rejecting a promise which was not handled with .catch().
        // I guess this line just throws or rejects which is then caught by something
        // jest? which reports it as a warning, not a failure
        // the try catch block here fixes that, but is this the right way?
        try {
          expect(reason.status).toBe(422)
          expect(reason.body).toStrictEqual({
            errors: { unique_name: ['is bad'], cloud: ['is also bad'] }
          })
        } catch (e) {
          done.fail(e)
        }
      })
      .finally((): void => {
        expect(postMock).toHaveBeenCalled()
        expect(getMock).toHaveBeenCalled()
        getMock.mockRestore()
        postMock.mockRestore()
        done()
      })
  })
})
