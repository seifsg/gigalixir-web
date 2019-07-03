import * as api from './api';

interface App {
    id: string;
    stack?: string; // TODO: make this required
    size: number;
    replicas: number;
    region: string;
    cloud: string;
}

type Cloud = 'gcp' | 'aws'
type GcpRegion = 'v2018-us-central1' | 'europe-west1'
type AwsRegion = 'us-east-1' | 'us-west-2'

interface CloudRegion {
    cloud: Cloud;
}

interface Aws extends CloudRegion {
    cloud: 'aws';
    region: AwsRegion;
}

interface Gcp extends CloudRegion {
    cloud: 'gcp';
    region: GcpRegion;
}

/* eslint-disable @typescript-eslint/camelcase */
// using object spread operator to copy over all fields except unique_name field
const renameIds = (apps: {unique_name: string; stack: string; size: number; replicas: number; region: string; cloud: string}[]): App[] => {
    return apps.map(({ unique_name, ...others }): App => ({
        id: unique_name, ...others,
    }));
}


export const get = (): Promise<{ data: App[]; total: number }> => {
    return api.get('/frontend/api/apps')
        .then((response): {data: App[]; total: number} => {
            const apps = response.data.data;
            return {
                data: renameIds(apps),
                total: apps.length,
            };
        });
}


export const create = (name: string, cloud: string, region: string): Promise<{}> => {
    return api.post('/frontend/api/apps', {
        unique_name: name,
        cloud: cloud,
        region: region
    }).then((response): {data: App} => {
        const app = response.data;
        return {data: {
            id: app.unique_name as string,
            cloud: cloud,
            region: region,
            replicas: app.replicas as number,
            size: app.size as number,
        }}
    })
}
/* eslint-enable @typescript-eslint/camelcase */
