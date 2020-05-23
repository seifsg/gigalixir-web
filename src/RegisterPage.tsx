// mostly copy and pasted with tweaks to change from login form to
// registration form
import React, {
  Component,
  ComponentType,
  ReactElement,
  HtmlHTMLAttributes
} from 'react'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import { defaultTheme } from 'react-admin'
import Form from './RegisterForm'
import AuthPage from './AuthPage'

interface Props {
  form: ReactElement<object>
  theme: Theme
}

// TODO: this stuff is in AuthPage and LoginPage
const styles = () =>
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
    icon: {}
  })

class Login extends Component<
  Props & WithStyles<typeof styles> & HtmlHTMLAttributes<HTMLDivElement>
> {
  public render() {
    const { form } = this.props

    return <AuthPage>{form}</AuthPage>
  }
}

const EnhancedLogin = withStyles(styles)(Login) as ComponentType<Props>

EnhancedLogin.defaultProps = {
  form: <Form />,
  theme: defaultTheme
}

export default EnhancedLogin
