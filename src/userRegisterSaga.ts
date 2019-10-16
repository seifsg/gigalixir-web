import { put, takeEvery } from 'redux-saga/effects'
import { showNotification } from 'react-admin'

export const USER_REGISTER = 'GIGALIXIR/USER_REGISTER'
export const USER_REGISTER_LOADING = 'GIGALIXIR/USER_REGISTER_LOADING'
export const USER_REGISTER_FAILURE = 'GIGALIXIR/USER_REGISTER_FAILURE'
export const USER_REGISTER_SUCCESS = 'GIGALIXIR/USER_REGISTER_SUCCESS'

export interface UserRegisterAction {
  readonly type: typeof USER_REGISTER
  readonly payload: object
  // readonly meta: { pathName: string }
}

export const userRegister = (
  payload: object,
  pathName: string
): UserRegisterAction => ({
  type: USER_REGISTER,
  payload
  // meta: { pathName }
})

function* handleUserRegister(action: any) {
  console.log('handleUserRegister')
  yield put(showNotification('Bitcoin rate updated'))
}

export default function*() {
    yield takeEvery(USER_REGISTER, handleUserRegister)
}
