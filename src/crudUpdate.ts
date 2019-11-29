// pretty much copied from https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/actions/dataActions/crudCreate.ts
// except, notification onFailure is optional
import { Identifier, RefreshSideEffect, RedirectionSideEffect, NotificationSideEffect } from 'ra-core'
import { CRUD_UPDATE, UPDATE} from 'react-admin'

interface RequestPayload {
    id: Identifier;
    data: any;
    previousData?: any;
}

export interface CrudUpdateAction {
    readonly type: typeof CRUD_UPDATE;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof UPDATE;
        onSuccess: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            refresh: RefreshSideEffect;
            basePath: string;
        };
        onFailure: {
            notification?: NotificationSideEffect;
        };
    };
}


export const crudUpdate = (
    resource: string,
    id: Identifier,
    data: any,
    previousData: any,
    basePath: string,
    successNotification: string,
    redirectTo: RedirectionSideEffect = 'show',
    refresh: RefreshSideEffect = true
): CrudUpdateAction => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData },
    meta: {
        resource,
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: successNotification,
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh,
            redirectTo,
            basePath,
        },
        onFailure: {
            /* notification: { */
            /*     body: 'ra.notification.http_error', */
            /*     level: 'warning', */
            /* }, */
        },
    },
});

