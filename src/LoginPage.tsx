import React, {
  Component,
  ReactElement,
  ComponentType,
  HtmlHTMLAttributes
} from 'react'
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles'

import { Link } from 'react-router-dom'
import { defaultTheme } from 'react-admin'
import LoginForm from './LoginForm'
import AuthPage from './AuthPage'

interface Props {
  form: ReactElement<object>
  theme: any
}

const styles = (theme: any) =>
  createStyles({
    main: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      height: '1px',
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundRepeat: 'no-repeat',
      backgroundSize: 'cover'
    },
    card: {
      minWidth: 300,
      marginTop: '6em',
      paddingTop: 10
    },
    avatar: {
      margin: '1em',
      display: 'flex',
      justifyContent: 'center'
    },
    icon: {
      backgroundColor: theme.palette.secondary[500]
    }
  })

/**
 * A standalone login page, to serve as authentication gate to the admin
 *
 * Expects the user to enter a login and a password, which will be checked
 * by the `authProvider` using the AUTH_LOGIN verb. Redirects to the root page
 * (/) upon success, otherwise displays an authentication error message.
 *
 * Copy and adapt this component to implement your own login logic
 * (e.g. to authenticate via email or facebook or anything else).
 *
 * @example
 *     import MyLoginPage from './MyLoginPage';
 *     const App = () => (
 *         <Admin loginPage={MyLoginPage} authProvider={authProvider}>
 *             ...
 *        </Admin>
 *     );
 */
class Login extends Component<
  Props & WithStyles<typeof styles> & HtmlHTMLAttributes<HTMLDivElement>
> {
  render() {
    const { form } = this.props
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
    return <AuthPage {...{ bottomLinks }}>{form}</AuthPage>
  }
}

const EnhancedLogin = withStyles(styles)(Login) as ComponentType<Props>

EnhancedLogin.defaultProps = {
  theme: defaultTheme,
  form: <LoginForm />
}
export default EnhancedLogin
