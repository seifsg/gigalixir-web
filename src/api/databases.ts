import _ from 'lodash'
import * as api from './api'

interface Response {
  data: Database[]
}

export interface Database {
  username: string
  url: string
  tier: string
  state: string
  size: number
  region: string
  port: number
  password: string
  id: string
  host: string
  database: string
  cloud: string
  // eslint-disable-next-line camelcase
  app_name: string
}

export const get = (id: string): Promise<Response> => {
  return api.get<Database[]>(`/frontend/api/apps/${id}/databases`).then(
    (response): Response => {
      return {
        data: _.map(
          response.data,
          (r: Database): Database => ({
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
            // eslint-disable-next-line camelcase
            app_name: r.app_name
          })
        )
      }
    }
  )
}
