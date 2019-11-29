import { CRUD_CREATE_FAILURE, CRUD_UPDATE_FAILURE } from 'react-admin'
import { showNotification } from 'react-admin'
import {SagaIterator} from 'redux-saga';
import { stopSubmit } from 'redux-form'
import { all, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import _ from 'lodash/fp'
import { USER_LOGIN_FAILURE } from 'ra-core'

const extractError = (
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

interface CrudFailureAction extends Action {
  payload?: { errors: { [k: string]: string[] } }
  meta?: { resource: string; fetchResponse: string }
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

function* userLoginFailure(action: UserLoginFailureAction) {
  if (action.error) {
    const violations = {
      email: extractError(action.error.response.data.errors, 'email'),
      password: extractError(action.error.response.data.errors, 'password')
    }

    const a = stopSubmit('signIn', violations)
    yield put(a)
  } else {
    throw new Error('userLoginFailure with no payload')
  }
}

function* resendConfirmationFailure(action: CrudFailureAction) {
  if (action.payload) {
    const violations = {
      email: extractError(action.payload.errors, 'email'),
    }
    const a = stopSubmit('resendConfirmation', violations)
    yield put(a)
  } else {
    throw new Error('resendConfirmationFailure with no payload')
  }
}
function* userRegisterFailure(action: CrudFailureAction) {
  if (action.payload) {
    const violations = {
      email: extractError(action.payload.errors, 'email'),
      password: extractError(action.payload.errors, 'password')
    }
    const a = stopSubmit('signUp', violations)
    yield put(a)
  } else {
    throw new Error('userRegisterFailure with no payload')
  }
}
function* setPasswordFailure(action: CrudFailureAction) {
    console.log('setPasswordFailure')
  if (action.payload) {
    const tokenViolation = extractError(action.payload.errors, 'token')
    const violations = {
      newPassword: extractError(action.payload.errors, 'password'),
      token: tokenViolation
    }
      console.log(tokenViolation)
      if (tokenViolation) {
          console.log('hi')
        yield put(
        showNotification(tokenViolation, 'error')
    );

}

    const a = stopSubmit('setPassword', violations)
    yield put(a)
  } else {
    throw new Error('setPasswordFailure with no payload')
  }
}

function* resetPasswordFailure(action: CrudFailureAction) {
    console.log('resetPasswordFailure')
  if (action.payload) {
    const violations = {
      email: extractError(action.payload.errors, 'email')
    }
    const a = stopSubmit('resetPassword', violations)
    yield put(a)
  } else {
    throw new Error('resetPasswordFailure with no payload')
  }
}


function* resendConfirmationFailureSaga() {
  yield takeEvery((action: CrudFailureAction): boolean => {
    return (
      action.type === CRUD_UPDATE_FAILURE &&
      action.meta !== undefined &&
      action.meta.resource === 'confirmation' &&
      action.meta.fetchResponse === 'UPDATE' &&
      action.payload !== undefined
    )
  }, resendConfirmationFailure)
}

function* userRegisterFailureSaga() {
  yield takeEvery((action: CrudFailureAction): boolean => {
    return (
      action.type === CRUD_CREATE_FAILURE &&
      action.meta !== undefined &&
      action.meta.resource === 'users' &&
      action.meta.fetchResponse === 'CREATE' &&
      action.payload !== undefined
    )
  }, userRegisterFailure)
}

function* crudFailureSaga(type: string, resource: string, fetchResponse: string, callback: (action: CrudFailureAction) => SagaIterator) {
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
  yield all([userRegisterFailureSaga()
      , userLoginFailureSaga()
      , crudFailureSaga(CRUD_CREATE_FAILURE, 'password', 'CREATE', resetPasswordFailure)
      , crudFailureSaga(CRUD_UPDATE_FAILURE, 'password', 'UPDATE', setPasswordFailure)
      , resendConfirmationFailureSaga()])
}
