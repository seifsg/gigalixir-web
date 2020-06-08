import React, { ReactNode } from 'react'
import { CRUD_UPDATE_FAILURE } from 'react-admin'
import { SagaIterator } from 'redux-saga'
import { stopSubmit } from 'redux-form'
import { all, put, takeEvery } from 'redux-saga/effects'
import { Action } from 'redux'
import _ from 'lodash/fp'
import { FETCH_ERROR } from 'ra-core'

// TODO: can we replace everything in this file with failureCallbacks instead?
interface ErrorPayload {
  [k: string]: string[]
}
export const extractErrorValue = (
  errors: ErrorPayload,
  key: string
): string => {
  const errorList = _.get(key, errors) || []
  return _.join('. ', errorList)
}

const errorListWithKey = (key: string) =>
  _.map(msg => `${_.capitalize(key)} ${msg}`)
export const extractError = (errors: ErrorPayload, key: string): string => {
  const errorList = _.get(key, errors) || []
  return _.join('. ', errorListWithKey(key)(errorList))
}

export const extractAllErrors = (errors: ErrorPayload): string => {
  const strings = Object.entries(errors).map(([k, v]) => {
    return errorListWithKey(k)(v)
  })
  return _.join('. ', strings)
}

export interface CrudFailureAction extends Action {
  error?: string
  payload?: { errors: ErrorPayload }
  meta?: {
    resource: string
    fetchResponse: string
    fetchStatus?: typeof FETCH_ERROR
    notification?: object
  }
}

interface UserLoginFailureAction extends Action {
  error?: {
    body: {
      errors: ErrorPayload
    }
  }
}

export const extractEmailError = (errors: ErrorPayload): ReactNode => {
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

export default function* errorSagas() {
  yield all([
    crudFailureSaga(
      CRUD_UPDATE_FAILURE,
      'payment_methods',
      'UPDATE',
      updatePaymentMethodFailure
    ),
    crudFailureSaga(CRUD_UPDATE_FAILURE, 'users', 'UPDATE', upgradeUserFailure)
  ])
}
