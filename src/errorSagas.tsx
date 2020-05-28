import React from 'react'
import { CRUD_UPDATE_FAILURE } from 'react-admin'
import { SagaIterator } from 'redux-saga'
import { stopSubmit } from 'redux-form'
import { all, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import _ from 'lodash/fp'
import { USER_LOGIN_FAILURE, FETCH_ERROR } from 'ra-core'

// TODO: can we replace everything in this file with failureCallbacks instead?

export const extractErrorValue = (
  errors: { [k: string]: string[] },
  key: string
): string => {
  const errorList = _.get(key, errors) || []
  return _.join('. ', errorList)
}

export const extractError = (
  errors: { [k: string]: string[] },
  key: string
): string => {
  const errorList = _.get(key, errors) || []
  const errorListWithKey = _.map(
    msg => `${_.capitalize(key)} ${msg}`,
    errorList
  )
  return _.join('. ', errorListWithKey)
}

export interface CrudFailureAction extends Action {
  error?: string
  payload?: { errors: { [k: string]: string[] } }
  meta?: {
    resource: string
    fetchResponse: string
    fetchStatus?: typeof FETCH_ERROR
    notification?: object
  }
}

interface UserLoginFailureAction extends Action {
  error?: {
    response: {
      data: {
        errors: {}
      }
    }
  }
}

function extractEmailError(errors: { [k: string]: string[] }) {
  const key = 'email'
  const errorList = _.get(key, errors) || []
  const msg = extractError(errors, key)
  //
  // TODO: extremely brittle. if error msg ever changes, this won't work. what to do instead?
  // we can't return jsx elements through http so we need to use a code or something instead
  // but then that won't work well with the CLI which needs text..
  if (_.includes('not yet confirmed.', errorList)) {
    return (
      <span>
        {msg}. <a href="/#/confirmation/resend">Resend Confirmation</a>
      </span>
    )
  }
  if (_.includes('or password is incorrect.', errorList)) {
    return (
      <span>
        {msg}. <a href="/#/password/reset">Reset Password</a>
      </span>
    )
  }
  return msg
}
function* userLoginFailure(action: UserLoginFailureAction) {
  if (action.error) {
    const violations = {
      email: extractEmailError(action.error.response.data.errors),
      password: extractError(action.error.response.data.errors, 'password')
    }

    const a = stopSubmit('signIn', violations)
    yield put(a)
  } else {
    throw new Error('userLoginFailure with no payload')
  }
}

// function* resendConfirmationFailure(action: CrudFailureAction) {
//  if (action.payload) {
//    const violations = {
//      email: extractError(action.payload.errors, 'email'),
//    }
//    const a = stopSubmit('resendConfirmation', violations)
//    yield put(a)
//  } else {
//    throw new Error('resendConfirmationFailure with no payload')
//  }
// }
// function* userRegisterFailure(action: CrudFailureAction) {
//   if (action.payload) {
//     const violations = {
//       email: extractError(action.payload.errors, 'email'),
//       password: extractError(action.payload.errors, 'password')
//     }
//     const a = stopSubmit('signUp', violations)
//     yield put(a)
//   } else {
//     throw new Error('userRegisterFailure with no payload')
//   }
// }
function* upgradeUserFailure(action: CrudFailureAction) {
  if (action.payload) {
    // since we use token here, but '' in the api, maybe translate it
    // back to token before we get it here to keep it consistent within gigalixir-web
    //
    // also, we don't want the key in the error this time.. maybe we should
    // always omit the key and make all other errors consistent?
    const tokenViolation = extractErrorValue(action.payload.errors, '')
    const violations = {
      token: tokenViolation
    }

    const a = stopSubmit('upgradeUser', violations)
    yield put(a)
  } else {
    throw new Error('upgradeUserFailure with no payload')
  }
}

function* updatePaymentMethodFailure(action: CrudFailureAction) {
  if (action.payload) {
    // since we use token here, but stripe_token in the api, maybe translate it
    // back to token before we get it here to keep it consistent within gigalixir-web
    //
    // also, we don't want the key in the error this time.. maybe we should
    // always omit the key and make all other errors consistent?
    const tokenViolation = extractErrorValue(
      action.payload.errors,
      'stripe_token'
    )
    const violations = {
      token: tokenViolation
    }

    const a = stopSubmit('updatePaymentMethod', violations)
    yield put(a)
  } else {
    throw new Error('updatePaymentMethodFailure with no payload')
  }
}

// function* setPasswordFailure(action: CrudFailureAction) {
//   if (action.payload) {
//     const tokenViolation = extractError(action.payload.errors, 'token')
//     const violations = {
//       newPassword: extractError(action.payload.errors, 'password'),
//       token: tokenViolation
//     }
//       if (tokenViolation) {
//         yield put(
//         showNotification(tokenViolation, 'warning')
//     );

// }

//     const a = stopSubmit('setPassword', violations)
//     yield put(a)
//   } else {
//     throw new Error('setPasswordFailure with no payload')
//   }
// }

// function* resetPasswordFailure(action: CrudFailureAction) {
//   if (action.payload) {
//     const violations = {
//       email: extractError(action.payload.errors, 'email')
//     }
//     const a = stopSubmit('resetPassword', violations)
//     yield put(a)
//   } else {
//     throw new Error('resetPasswordFailure with no payload')
//   }
// }

// function* resendConfirmationFailureSaga() {
//   yield takeEvery((action: CrudFailureAction): boolean => {
//     return (
//       action.type === CRUD_UPDATE_FAILURE &&
//       action.meta !== undefined &&
//       action.meta.resource === 'confirmation' &&
//       action.meta.fetchResponse === 'UPDATE' &&
//       action.payload !== undefined
//     )
//   }, resendConfirmationFailure)
// }

// function* userRegisterFailureSaga() {
//   yield takeEvery((action: CrudFailureAction): boolean => {
//     return (
//       action.type === CRUD_CREATE_FAILURE &&
//       action.meta !== undefined &&
//       action.meta.resource === 'users' &&
//       action.meta.fetchResponse === 'CREATE' &&
//       action.payload !== undefined
//     )
//   }, userRegisterFailure)
// }

function* crudFailureSaga(
  type: string,
  resource: string,
  fetchResponse: string,
  callback: (action: CrudFailureAction) => SagaIterator
) {
  yield takeEvery((action: CrudFailureAction): boolean => {
    return (
      action.type === type &&
      action.meta !== undefined &&
      action.meta.resource === resource &&
      action.meta.fetchResponse === fetchResponse &&
      action.payload !== undefined
    )
  }, callback)
}

function* userLoginFailureSaga() {
  yield takeEvery((action: UserLoginFailureAction): boolean => {
    return (
      action.type === USER_LOGIN_FAILURE &&
      action.error !== undefined &&
      action.error.response !== undefined &&
      action.error.response.data !== undefined &&
      action.error.response.data.errors !== undefined
    )
  }, userLoginFailure)
}

export default function* errorSagas() {
  yield all([
    // userRegisterFailureSaga()
    userLoginFailureSaga(),
    // , crudFailureSaga(CRUD_CREATE_FAILURE, 'password', 'CREATE', resetPasswordFailure)
    // , crudFailureSaga(CRUD_UPDATE_FAILURE, 'password', 'UPDATE', setPasswordFailure)
    crudFailureSaga(
      CRUD_UPDATE_FAILURE,
      'payment_methods',
      'UPDATE',
      updatePaymentMethodFailure
    ),
    crudFailureSaga(CRUD_UPDATE_FAILURE, 'users', 'UPDATE', upgradeUserFailure)
    // crudFailureSaga(CRUD_UPDATE_FAILURE, 'apps', 'UPDATE', updateAppFailure)
  ])
  // , resendConfirmationFailureSaga()])
}
