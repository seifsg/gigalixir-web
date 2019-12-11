// pretty much copied from https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/actions/dataActions/crudCreate.ts
// except, notification onFailure is optional
import { RefreshSideEffect, RedirectionSideEffect } from "ra-core";
import { CRUD_CREATE, CREATE } from "react-admin";

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
      callback: Function;
      redirectTo: RedirectionSideEffect;
      refresh: RefreshSideEffect;
      basePath: string;
    };
    onFailure: {
      callback: Function;
      // notification?: NotificationSideEffect;
    };
  };
}

export const crudCreate = (
  resource: string,
  data: any,
  basePath: string,
  // successNotification: string,
  redirectTo: RedirectionSideEffect = "edit",
  refresh: RefreshSideEffect = true,
  resolve: Function,
  failureCallback: (params: {
    payload: { errors: { [k: string]: string[] } };
  }) => void
): CrudCreateAction => ({
  type: CRUD_CREATE,
  payload: { data },
  meta: {
    resource,
    fetch: CREATE,
    onSuccess: {
      callback: () => {
        resolve();
      },
      redirectTo,
      refresh,
      basePath
    },
    // onSuccess: {
    // notification: {
    //     body: successNotification,
    //     level: 'info',
    //     messageArgs: {
    //         smart_count: 1,
    //     },
    // },
    // redirectTo,
    // basePath,
    // },
    onFailure: {
      callback: failureCallback
      // notification: {
      //     body: '',
      //     level: 'warning',
      // },
    }
  }
});
