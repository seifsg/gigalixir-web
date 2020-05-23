// mostly copy and pasted with tweaks to change from login form to
// registration form
import React, { Component } from 'react'
import RegisterForm from './RegisterForm'
import AuthPage from './AuthPage'

interface Props {}

class RegisterPage extends Component<Props> {
  public render() {
    return (
      <AuthPage>
        <RegisterForm />
      </AuthPage>
    )
  }
}

export default RegisterPage
