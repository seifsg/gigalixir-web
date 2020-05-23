import React, {
  Component,
} from 'react'

import { Link } from 'react-router-dom'
import LoginForm from './LoginForm'
import AuthPage from './AuthPage'

interface Props {
}

class Login extends Component<Props> {
  render() {
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
    return <AuthPage {...{ bottomLinks }}><LoginForm/></AuthPage>
  }
}

export default Login
