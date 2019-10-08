import * as api from './api'

type tier = 'STANDARD' | 'FREE'
interface Response {
  tier: tier
  email: string
  credit_cents: number
}
interface User extends Response {
  id: 'profile'
}
const get = (): Promise<{ data: User }> => {
  return api
    .get<{ data: { data: Response } }>(`/frontend/api/users`)
    .then((response): { data: User } => {
      // logger.debug(JSON.stringify(response))
      // debug = {
      //   data: { data: { tier: 'STANDARD', email: 'fake@email.com', credit_cents: 0 } },
      // }

      return {
        data: {
          id: 'profile',
          ...response.data.data
        }
      }
    })
}

export default get
