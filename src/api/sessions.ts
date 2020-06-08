import * as api from './api'

export interface Session {
  tier: 'STANDARD' | 'FREE'
  email: string
  // eslint-disable-next-line camelcase
  api_key: string
}

export const check = (): Promise<{ data: Session }> =>
  api
    .get<{ data: Session }>('/frontend/api/sessions')
    .then(response => response.data)

export const login = (
  username: string,
  password: string
): Promise<{ data: Session }> =>
  api
    .post<{ data: Session }>('/frontend/api/sessions', {
      session: { email: username, password }
    })
    .then(response => response.data)
    .catch(e => {
      // if there is a login error, just discard the msg since it is not a good one: "401 something"
      // this notification system is really bothering me. in this case we can not override the
      // action and remove the meta notification or onFailure section because the sideEffect/auth saga
      // itself checks for the error and dispatches the notification. I'm not sure how to hide the
      // notification here, but we can change the msg to be better than "401". i think we probably need
      // to override the Notification element at some point since this is getting really messy.
      e.message = 'Sorry, please try again'
      return Promise.reject(e)
    })

export const logout = (): Promise<string> =>
  api
    .del<{ data: Record<string, unknown> }>('/frontend/api/sessions')
    .then(response => response.data)
    .then(() => '/login') // where to redirectTo
