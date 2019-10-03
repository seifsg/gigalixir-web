// mostly copy and pasted with tweaks to change from login form to
// registration form
import React, {
  Component,
  ReactElement,
  ComponentType,
  HtmlHTMLAttributes
} from 'react'
// import PropTypes from 'prop-types'
import classnames from 'classnames'
import Card from '@material-ui/core/Card'
import Avatar from '@material-ui/core/Avatar'
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import LockIcon from '@material-ui/icons/Lock'

// import defaultTheme from '../defaultTheme'
// import Notification from '../layout/Notification'
// import DefaultLoginForm from './LoginForm'
import { defaultTheme, Notification } from 'react-admin'
import RegisterForm from './RegisterForm'

interface Props {
  backgroundImage?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loginForm: ReactElement<any>
  theme: object
  staticContext?: object
}

const styles = (theme: Theme) =>
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
      backgroundColor: theme.palette.secondary.dark
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
  // eslint-disable-next-line react/destructuring-assignment
  private theme = createMuiTheme(this.props.theme)

  private containerRef = React.createRef<HTMLDivElement>()

  private backgroundImageLoaded = false

  public componentDidMount() {
    this.lazyLoadBackgroundImage()
  }

  public componentDidUpdate() {
    if (!this.backgroundImageLoaded) {
      this.lazyLoadBackgroundImage()
    }
  }

  private updateBackgroundImage = () => {
    if (!this.backgroundImageLoaded && this.containerRef.current) {
      const { backgroundImage } = this.props
      this.containerRef.current.style.backgroundImage = `url(${backgroundImage})`
      this.backgroundImageLoaded = true
    }
  }

  // Load background image asynchronously to speed up time to interactive
  private lazyLoadBackgroundImage() {
    const { backgroundImage } = this.props

    if (backgroundImage) {
      /* global Image */
      const img = new Image()
      img.onload = this.updateBackgroundImage
      img.src = backgroundImage
    }
  }

  public render() {
    const {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      backgroundImage,
      classes,
      className,
      loginForm,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      staticContext,
      ...rest
    } = this.props

    return (
      <MuiThemeProvider theme={this.theme}>
        <div
          className={classnames(classes.main, className)}
          {...rest}
          ref={this.containerRef}
        >
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <LockIcon />
              </Avatar>
            </div>
            {loginForm}
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    )
  }
}

const EnhancedLogin = withStyles(styles)(Login) as ComponentType<Props>

// EnhancedLogin.propTypes = {
//   backgroundImage: PropTypes.string,
//   loginForm: PropTypes.element,
//   // eslint-disable-next-line react/forbid-prop-types
//   theme: PropTypes.object,
//   // eslint-disable-next-line react/forbid-prop-types
//   staticContext: PropTypes.object
// }

EnhancedLogin.defaultProps = {
  backgroundImage: '',
  theme: defaultTheme,
  loginForm: <RegisterForm />
}

export default EnhancedLogin
