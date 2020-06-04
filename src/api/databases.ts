import _ from 'lodash'
import * as api from './api'

export type DatabasesArray = Array<FreeDatabase | StandardDatabase>

interface Response {
  data: DatabasesArray
}

interface ServerResponse {
  data: Array<ServerResponseDatabase>
}

interface ServerResponseDatabase {
  username: string
  url: string
  tier: 'FREE' | 'STANDARD'
  state: string
  port: number
  password: string
  id: string
  host: string
  database: string
  // eslint-disable-next-line camelcase
  app_name: string
  // eslint-disable-next-line camelcase
  limited_at: Date
  size: number
  region: string
  cloud: string
}

export interface Database {
  username: string
  url: string
  state: string
  port: number
  password: string
  id: string
  host: string
  database: string
  appName: string
}

export interface StandardDatabase extends Database {
  tier: 'STANDARD'
  size: number
  region: string
  cloud: string
}
export interface FreeDatabase extends Database {
  tier: 'FREE'
  limitedAt: Date
}

export const get = (id: string): Promise<Response> => {
  return api.get<ServerResponse>(`/frontend/api/apps/${id}/databases`).then(
    (response): Response => {
      const data = _.map(response.data.data, (r: ServerResponseDatabase):
        | FreeDatabase
        | StandardDatabase => {
        if (r.tier === 'FREE') {
          const db: FreeDatabase = {
            username: r.username,
            url: r.url,
            tier: r.tier,
            state: r.state,
            port: r.port,
            password: r.password,
            id: r.id,
            host: r.host,
            database: r.database,
            appName: r.app_name,
            limitedAt: r.limited_at
          }
          return db
        }

        const db: StandardDatabase = {
          username: r.username,
          url: r.url,
          tier: r.tier,
          state: r.state,
          size: r.size,
          region: r.region,
          port: r.port,
          password: r.password,
          id: r.id,
          host: r.host,
          database: r.database,
          cloud: r.cloud,
          appName: r.app_name
        }
        return db
      })

      return {
        data
      }
    }
  )
}
