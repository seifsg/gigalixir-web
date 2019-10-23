import { CRUD_CREATE_FAILURE } from 'react-admin'
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

interface CrudCreateFailureAction extends Action {
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

function* userRegisterFailure(action: CrudCreateFailureAction) {
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

function* userRegisterFailureSaga() {
  yield takeEvery((action: CrudCreateFailureAction): boolean => {
    return (
      action.type === CRUD_CREATE_FAILURE &&
      action.meta !== undefined &&
      action.meta.resource === 'users' &&
      action.meta.fetchResponse === 'CREATE' &&
      action.payload !== undefined
    )
  }, userRegisterFailure)
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
  yield all([userRegisterFailureSaga(), userLoginFailureSaga()])
}
