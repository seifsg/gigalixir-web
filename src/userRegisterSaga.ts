import { RedirectionSideEffect, NotificationSideEffect } from 'ra-core'
import { CRUD_CREATE, CREATE} from 'react-admin'

interface RequestPayload {
    data: any;
}

export interface CrudCreateAction {
    readonly type: typeof CRUD_CREATE;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof CREATE;
        onSuccess: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            basePath: string;
        };
        onFailure: {
            notification?: NotificationSideEffect;
        };
    };
}


export const crudCreate = (
    resource: string,
    data: any,
    basePath: string,
    redirectTo: RedirectionSideEffect = 'edit'
): CrudCreateAction => ({
    type: CRUD_CREATE,
    payload: { data },
    meta: {
        resource,
        fetch: CREATE,
        onSuccess: {
            notification: {
                body: 'ra.notification.created',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            redirectTo,
            basePath,
        },
        onFailure: {
            // notification: {
            //     body: '',
            //     level: 'warning',
            // },
        },
    },
});

export default (values: object, basePath: string, redirectTo: string) =>
  crudCreate('users', { ...values }, basePath, redirectTo)
