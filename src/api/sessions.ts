import * as api from './api';

interface Session {
    tier: 'STANDARD' | 'FREE';
    email: string;
    api_key: string;
}

export const check = (): Promise<{ data: Session }> =>
    api.get<{ data: { data: Session } }>('/frontend/api/sessions').then(response => response.data);

export const login = (username: string, password: string): Promise<{ data: Session }> =>
    api
        .post<{ data: { data: Session } }>('/frontend/api/sessions', {
            session: { email: username, password: password },
        })
        .then(response => response.data);

export const logout = (): Promise<{}> =>
    api.del<{ data: {} }>('/frontend/api/sessions').then(response => response.data);
