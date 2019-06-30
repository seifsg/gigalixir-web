import * as api from './api'

interface App {
    id: string,
    stack: string,
    size: number,
    replicas: number,
    region: string,
    cloud: string
}

const renameIds = (apps: any[]): App[] =>
    // using object spread operator to copy over all fields except unique_name field
    apps.map(({ unique_name, ...others }) => {
        return {
            id: unique_name, ...others
        }
    })


export const get = (): Promise<{ data: App[], total: number }> =>
    api.get("/frontend/api/apps")
        .then(response => {
            const apps = response.data.data
            return {
                data: renameIds(apps),
                total: apps.length
            }
        })

