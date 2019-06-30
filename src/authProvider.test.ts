import axios from "axios";
import authProvider from "./authProvider"
import { AUTH_LOGIN } from 'react-admin';

it('logs in', (done) => {
    const csrfMock = jest.spyOn(axios, 'get')
    csrfMock.mockReturnValueOnce(Promise.resolve({ data: { data: "fake-csrf-token" } }))
    const createSessionMock = jest.spyOn(axios, 'post')
    createSessionMock.mockReturnValueOnce(Promise.resolve({ data: { data: "fake-session" } }))

    const result = authProvider(AUTH_LOGIN, { username: "fake-email", password: "fake-password" })
    result.then(r => {
        expect(r.data).toBe("fake-session")
        expect(csrfMock).toHaveBeenCalled()
        expect(createSessionMock).toHaveBeenCalled()
    }).catch(reason => {
        fail(reason)
        done()
    }).finally(() => {
        csrfMock.mockRestore()
        createSessionMock.mockRestore()
        done()
    })
})

it('csrf error', (done) => {
    const csrfMock = jest.spyOn(axios, 'get')
    csrfMock.mockReturnValueOnce(Promise.reject({ data: { errors: "some-error" } }))
    const createSessionMock = jest.spyOn(axios, 'post')
    createSessionMock.mockReturnValueOnce(Promise.resolve({ data: { data: "fake-session" } }))

    const result = authProvider(AUTH_LOGIN, { username: "fake-email", password: "fake-password" })
    result.then(r => {
        fail("The promise should have failed")
    }).catch(reason => {
        expect(reason).toStrictEqual({ "data": { "errors": "some-error" } })
        expect(csrfMock).toHaveBeenCalled()
        expect(createSessionMock).not.toHaveBeenCalled()
    }).finally(() => {
        csrfMock.mockRestore()
        createSessionMock.mockRestore()
        done()
    })
})