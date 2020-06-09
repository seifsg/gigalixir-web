import _ from 'lodash'
import { HttpError } from 'ra-core'
import * as api from './api'
import { extractAllErrors } from '../errorSagas'

export type DatabasesArray = Array<FreeDatabase | StandardDatabase>

interface Response {
  data: DatabasesArray
}

interface ServerResponse {
  data: Array<ServerResponseDatabase>
}

interface ServerResponseSingular {
  data: ServerResponseDatabase
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
            limitedAt: r.limited_at,
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
          appName: r.app_name,
        }
        return db
      })

      return {
        data,
      }
    }
  )
}

export const createFree = (appID: string): Promise<{ data: FreeDatabase }> => {
  return api
    .post<ServerResponseSingular>(
      `/frontend/api/apps/${appID}/free_databases`,
      {}
    )
    .then((response): { data: FreeDatabase } => {
      const r = response.data.data
      return {
        data: {
          id: r.id,
          username: r.username,
          url: r.url,
          tier: 'FREE',
          state: r.state,
          port: r.port,
          password: r.password,
          host: r.host,
          database: r.database,
          // eslint-disable-next-line camelcase
          appName: r.app_name,
          // eslint-disable-next-line camelcase
          limitedAt: r.limited_at,
        },
      }
    })
    .catch((error) => {
      return Promise.reject(
        new HttpError(
          extractAllErrors(error.body.errors),
          error.status,
          error.body
        )
      )
    })
}

export const createStandard = (
  appID: string,
  size: number
): Promise<{ data: StandardDatabase }> => {
  return api
    .post<ServerResponseSingular>(`/frontend/api/apps/${appID}/databases`, {
      size,
    })
    .then((response): { data: StandardDatabase } => {
      const r = response.data.data
      return {
        data: {
          id: r.id,
          username: r.username,
          url: r.url,
          tier: 'STANDARD',
          state: r.state,
          port: r.port,
          password: r.password,
          host: r.host,
          database: r.database,
          // eslint-disable-next-line camelcase
          appName: r.app_name,
          size: r.size,
          region: r.region,
          cloud: r.cloud,
        },
      }
    })
    .catch((error) => {
      return Promise.reject(
        new HttpError(
          extractAllErrors(error.body.errors),
          error.status,
          error.body
        )
      )
    })
}

export const del = (
  appID: string,
  id: string
): Promise<{
  data: FreeDatabase | StandardDatabase | Record<string, unknown>
}> => {
  return api
    .del<ServerResponseSingular>(
      `/frontend/api/apps/${appID}/databases/${encodeURIComponent(id)}`
    )
    .then((response): {
      data: FreeDatabase | StandardDatabase | Record<string, unknown>
    } => {
      const r = response.data.data

      let db: FreeDatabase | StandardDatabase | Record<string, unknown> = {}
      if (r?.tier === 'FREE') {
        db = {
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
          limitedAt: r.limited_at,
        }
      } else if (r?.tier === 'STANDARD') {
        db = {
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
          appName: r.app_name,
        }
      }
      return { data: db }
    })
    .catch((error) => {
      return Promise.reject(
        new HttpError(
          extractAllErrors(error.body.errors),
          error.status,
          error.body
        )
      )
    })
}
