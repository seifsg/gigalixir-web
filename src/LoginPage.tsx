import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'
import AuthPage from './AuthPage'
import LoginForm from './LoginForm'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

const Login: FunctionComponent<Props> = () => {
  const bottomLinks = (
    <div style={{ display: 'flex', margin: 20 }}>
      <div style={{ margin: 10 }}>
        <Link to="/register">Register</Link>
      </div>
      <div style={{ margin: 10 }}>
        <Link to="/password/reset">Reset Password</Link>
      </div>
      <div style={{ margin: 10 }}>
        <Link to="/confirmation/resend">Resend Confirmation</Link>
      </div>
    </div>
  )
  return (
    <AuthPage {...{ bottomLinks }}>
      <LoginForm />
    </AuthPage>
  )
}

export default Login
