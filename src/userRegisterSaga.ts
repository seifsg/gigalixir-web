import { put, takeEvery } from 'redux-saga/effects'
import { crudCreate, showNotification } from 'react-admin'

export const USER_REGISTER = 'GIGALIXIR/USER_REGISTER'
export const USER_REGISTER_LOADING = 'GIGALIXIR/USER_REGISTER_LOADING'
export const USER_REGISTER_FAILURE = 'GIGALIXIR/USER_REGISTER_FAILURE'
export const USER_REGISTER_SUCCESS = 'GIGALIXIR/USER_REGISTER_SUCCESS'

// export interface UserRegisterAction {
//   readonly type: typeof USER_REGISTER
//   readonly payload: object
//   // readonly meta: { pathName: string }
// }

export const userRegister = (
  values: object,
  basePath: string,
  redirectTo: string
) => crudCreate('users', { ...values }, basePath, redirectTo)

// export const userRegister = (data: object, pathName: string) => ({
//   type: USER_REGISTER,
//   payload: data,
//   meta: { fetch: UPDATE, resource: 'comments' }
// })

// export const userRegister = (
//   payload: object,
//   pathName: string
// ): UserRegisterAction => ({
//   type: USER_REGISTER,
//   payload
//   // meta: { pathName }
// })

// function* handleUserRegister(action: any) {
//   console.log('handleUserRegister')
//   yield put(showNotification('Bitcoin rate updated'))
// }

// export default function*() {
//   yield takeEvery(USER_REGISTER, handleUserRegister)
// }
