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
    apps.map(app => { return { 
        id: app.unique_name,
        stack: app.stack,
        size: app.size,
        replicas: app.replicas,
        region: app.region,
        cloud: app.cloud 
    } })


export const get = (): Promise<{ data: App[], total: number }> =>
    api.get("/frontend/api/apps")
        .then(response => {
            const apps = response.data.data
            return {
                data: renameIds(apps),
                total: apps.length
            }
        })

