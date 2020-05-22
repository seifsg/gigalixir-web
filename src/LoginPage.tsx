import React, {
  Component,
  ReactElement,
  ComponentType,
  HtmlHTMLAttributes
} from 'react'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  createStyles,
  WithStyles
} from '@material-ui/core/styles'

import { defaultTheme, Notification } from 'react-admin'
import Logo from './Logo'
import LoginForm from './LoginForm'

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
      marginTop: '6em'
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
  theme = createMuiTheme(this.props.theme)

  containerRef = React.createRef<HTMLDivElement>()

  render() {
    const { classes, className, form, ...rest } = this.props
    return (
      <MuiThemeProvider theme={this.theme}>
        <div
          className={classnames(classes.main, className)}
          // title gets pass on through here which creates a weird tooltip
          {...rest}
          ref={this.containerRef}
        >
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Logo />
            </div>
            {form}
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    )
  }
}

const EnhancedLogin = withStyles(styles)(Login) as ComponentType<Props>

EnhancedLogin.defaultProps = {
  theme: defaultTheme,
  form: <LoginForm />
}
export default EnhancedLogin
