import axios from 'axios'
import { AUTH_LOGIN, AUTH_CHECK, AUTH_LOGOUT, AUTH_ERROR } from 'react-admin'
import authProvider from './authProvider'

it('logs in', done => {
  const csrfMock = jest.spyOn(axios, 'get')
  csrfMock.mockReturnValueOnce(
    Promise.resolve({ data: { data: 'fake-csrf-token' } })
  )
  const createSessionMock = jest.spyOn(axios, 'post')
  createSessionMock.mockReturnValueOnce(
    Promise.resolve({ data: { data: 'fake-session' } })
  )

  const result = authProvider(AUTH_LOGIN, {
    username: 'fake-email',
    password: 'fake-password'
  })
  result
    .then(r => {
      expect(r.data).toBe('fake-session')
      expect(csrfMock).toHaveBeenCalled()
      expect(createSessionMock).toHaveBeenCalled()
    })
    .catch(reason => {
      done.fail(reason)
    })
    .finally(() => {
      csrfMock.mockRestore()
      createSessionMock.mockRestore()
      done()
    })
})

it('rejects csrf error', done => {
  const csrfMock = jest.spyOn(axios, 'get')
  csrfMock.mockRejectedValueOnce({ data: { errors: 'some-error' } })
  //   csrfMock.mockReturnValueOnce(Promise.reject({ data: { errors: 'some-error' } }))
  const createSessionMock = jest.spyOn(axios, 'post')
  createSessionMock.mockReturnValueOnce(
    Promise.resolve({ data: { data: 'fake-session' } })
  )

  const result = authProvider(AUTH_LOGIN, {
    username: 'fake-email',
    password: 'fake-password'
  })
  result
    .then(() => {
      done.fail('The promise should have failed')
    })
    .catch(reason => {
      expect(reason).toStrictEqual({ data: { errors: 'some-error' }, message: undefined })
      expect(csrfMock).toHaveBeenCalled()
      expect(createSessionMock).not.toHaveBeenCalled()
    })
    .finally(() => {
      csrfMock.mockRestore()
      createSessionMock.mockRestore()
      done()
    })
})

it('checks session', done => {
  const checkSessionMock = jest.spyOn(axios, 'get')
  checkSessionMock.mockResolvedValueOnce({ data: { data: 'fake-session' } })

  const result = authProvider(AUTH_CHECK)
  result
    .then(r => {
      expect(r.data).toBe('fake-session')
      expect(checkSessionMock).toHaveBeenCalled()
    })
    .catch(reason => {
      done.fail(reason)
    })
    .finally(() => {
      checkSessionMock.mockRestore()
      done()
    })
})

it('logs out', done => {
  const csrfMock = jest.spyOn(axios, 'get')
  csrfMock.mockResolvedValueOnce({ data: { data: 'fake-csrf-token' } })
  const deleteSessionMock = jest.spyOn(axios, 'delete')
  deleteSessionMock.mockResolvedValueOnce({ data: { data: {} } })

  const result = authProvider(AUTH_LOGOUT)
  result
    .then(r => {
      expect(r.data).toStrictEqual({})
      expect(csrfMock).toHaveBeenCalled()
      expect(deleteSessionMock).toHaveBeenCalled()
    })
    .catch(reason => {
      done.fail(reason)
    })
    .finally(() => {
      csrfMock.mockRestore()
      deleteSessionMock.mockRestore()
      done()
    })
})

it('logs out on error', done => {
  const csrfMock = jest.spyOn(axios, 'get')
  csrfMock.mockResolvedValueOnce({ data: { data: 'fake-csrf-token' } })
  const deleteSessionMock = jest.spyOn(axios, 'delete')
  deleteSessionMock.mockResolvedValueOnce({ data: { data: {} } })

  const result = authProvider(AUTH_ERROR, { status: 401 })
  result
    .then(r => {
      expect(r.data).toStrictEqual({})
      expect(csrfMock).toHaveBeenCalled()
      expect(deleteSessionMock).toHaveBeenCalled()
    })
    .catch(reason => {
      done.fail(reason)
    })
    .finally(() => {
      csrfMock.mockRestore()
      deleteSessionMock.mockRestore()
      done()
    })
})
