import * as api from './api'

type Email = string
interface Response {
  owner: Email
  collaborators: Email[]
}

export interface Permissions {
  id: string // not really used, but required by react-admin
  owner: Email
  collaborators: Email[]
}

export const get = (id: string): Promise<{ data: Permissions }> => {
  return api
    .get<{ data: Response }>(`/frontend/api/apps/${id}/permissions`)
    .then(response => {
      return {
        data: {
          id: id,
          owner: response.data.data.owner,
          collaborators: response.data.data.collaborators,
        }
      }
    })
}
