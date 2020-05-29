// pretty much copied from https://github.com/marmelab/react-admin/blob/master/packages/ra-core/src/actions/dataActions/crudCreate.ts
// except, notification onFailure is optional
import { RedirectionSideEffect, RefreshSideEffect } from 'ra-core'
import { CREATE, CRUD_CREATE } from 'react-admin'
import { FailureCallback, SuccessCallback } from './callbacks'

interface RequestPayload {
  data: {}
}

export interface CrudCreateAction {
  readonly type: typeof CRUD_CREATE
  readonly payload: RequestPayload
  readonly meta: {
    resource: string
    fetch: typeof CREATE
    onSuccess: {
      callback: Function
      redirectTo: RedirectionSideEffect
      refresh: RefreshSideEffect
      basePath: string
    }
    onFailure: {
      callback: Function
      // notification?: NotificationSideEffect;
    }
  }
}

export const crudCreate = (
  resource: string,
  data: {},
  basePath: string,
  // successNotification: string,
  redirectTo: RedirectionSideEffect = 'edit',
  refresh: RefreshSideEffect = true,
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
): CrudCreateAction => ({
  type: CRUD_CREATE,
  payload: { data },
  meta: {
    resource,
    fetch: CREATE,
    onSuccess: {
      callback: successCallback,
      refresh,
      redirectTo,
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
})
