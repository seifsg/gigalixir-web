// mostly copy and pasted with tweaks to change from login form to
// registration form
import React, { FunctionComponent } from 'react'
import AuthPage from './AuthPage'
import RegisterForm from './RegisterForm'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const RegisterPage: FunctionComponent<Props> = () => {
  return (
    <AuthPage>
      <RegisterForm />
    </AuthPage>
  )
}

export default RegisterPage
