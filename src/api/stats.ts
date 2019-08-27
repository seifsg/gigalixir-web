import * as api from './api';

export interface Stats {
    id: string;
    data: {
        mem: point[];
        cpu: point[];
    };
}

export type value = number | null;
export type point = (value)[];

export const get = (id: string): Promise<{ data: Stats }> => {
    return api.get<{ data: Stats }>('/frontend/api/apps/' + id + '/stats').then((response): {
        data: Stats;
    } => {
        const data = response.data.data;
        return {
            data: {
                id: id,
                data: data,
            },
        };
    });
};
