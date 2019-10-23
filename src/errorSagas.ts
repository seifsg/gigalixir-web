import { CRUD_CREATE_FAILURE } from 'react-admin'
import { stopSubmit } from 'redux-form'
import { put, takeEvery } from 'redux-saga/effects'
import _ from 'lodash/fp'

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

export function* crudCreateFailure(action: {
  payload: { errors: { [k: string]: string[] } }
  meta: { resource: string; fetchResponse: string }
}) {
  if (
    action.meta.resource === 'users' &&
    action.meta.fetchResponse === 'CREATE'
  ) {
    console.log('crudCreateFailure', action)

    const violations = {
      email: extractError(action.payload.errors, 'email'),
      password: extractError(action.payload.errors, 'password')
    }
    const a = stopSubmit('signUp', violations)
    console.log(a)
    yield put(a)
  }
}

export default function* errorSagas() {
  yield takeEvery(CRUD_CREATE_FAILURE, crudCreateFailure)
}
