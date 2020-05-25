import React, { Component, createElement } from 'react'
import { ReduxState } from 'ra-core'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import classnames from 'classnames'
import { withRouter } from 'react-router'
import {
  MuiThemeProvider,
  createMuiTheme,
  withStyles,
  createStyles,
  Theme
} from '@material-ui/core/styles'
import compose from 'recompose/compose'

import {
  AppBar,
  Sidebar,
  Menu,
  Notification,
  Error,
  defaultTheme
} from 'react-admin'
import { CorrectedReduxState } from './CorrectedReduxState'

const styles = (theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1,
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      position: 'relative',
      minWidth: 'fit-content',
      width: '100%'
    },
    appFrame: {
      display: 'flex',
      flexDirection: 'column'
    },
    contentWithSidebar: {
      display: 'flex',
      flexGrow: 1
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      flexBasis: 0,
      padding: theme.spacing.unit * 3,
      [theme.breakpoints.up('xs')]: {
        paddingLeft: 5
      },
      [theme.breakpoints.down('sm')]: {
        padding: 0
      }
    }
  })

const sanitizeRestProps = ({
  staticContext,
  history,
  location,
  match,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => props

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Layout extends Component<any, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(props: any) {
    super(props)
    /**
     * Reset the error state upon navigation
     *
     * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
     */
    props.history.listen(() => {
      if (this.state.hasError) {
        this.setState({ hasError: false })
      }
    })
    this.state = { hasError: false, errorMessage: null, errorInfo: null }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentDidCatch(errorMessage: any, errorInfo: any) {
    this.setState({ hasError: true, errorMessage, errorInfo })
  }

  render() {
    const {
      appBar,
      children,
      classes,
      className,
      customRoutes,
      error,
      dashboard,
      logout,
      menu,
      notification,
      open,
      sidebar,
      title,
      ...props
    } = this.props
    const { hasError, errorMessage, errorInfo } = this.state
    return (
      <div
        className={classnames('layout', classes.root, className)}
        {...sanitizeRestProps(props)}
      >
        <div className={classes.appFrame}>
          {createElement(appBar, { title, open, logout })}
          <main className={classes.contentWithSidebar}>
            {createElement(sidebar, {
              children: createElement(menu, {
                logout,
                hasDashboard: !!dashboard
              })
            })}
            <div className={classes.content}>
              {hasError
                ? createElement(error, {
                    error: errorMessage,
                    errorInfo,
                    title
                  })
                : children}
            </div>
          </main>
          {createElement(notification)}
        </div>
      </div>
    )
  }
}

// const componentPropType = PropTypes.oneOfType([
//     PropTypes.func,
//     PropTypes.string,
// ]);

// Layout.propTypes = {
//     appBar: componentPropType,
//     children: PropTypes.oneOfType([PropTypes.func, PropTypes.node]),
//     classes: PropTypes.object,
//     className: PropTypes.string,
//     customRoutes: PropTypes.array,
//     dashboard: componentPropType,
//     error: componentPropType,
//     history: PropTypes.object.isRequired,
//     logout: PropTypes.oneOfType([
//         PropTypes.node,
//         PropTypes.func,
//         PropTypes.string,
//     ]),
//     menu: componentPropType,
//     notification: componentPropType,
//     open: PropTypes.bool,
//     sidebar: componentPropType,
//     title: PropTypes.node.isRequired,
// };

const mapStateToProps = (state: ReduxState & CorrectedReduxState) => ({
  open: state.admin.ui.sidebarOpen
})

const EnhancedLayout = compose(
  connect(
    mapStateToProps,
    {} // Avoid connect passing dispatch in props
  ),
  withRouter,
  withStyles(styles)
)(Layout)

EnhancedLayout.defaultProps = {
  appBar: AppBar,
  error: Error,
  menu: Menu,
  notification: Notification,
  sidebar: Sidebar
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class LayoutWithTheme extends Component<any, any> {
  static defaultProps = { theme: defaultTheme }

  theme: Theme = defaultTheme

  constructor(props: any) {
    super(props)
    this.theme = createMuiTheme(props.theme)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  componentWillReceiveProps(nextProps: any) {
    if (nextProps.theme !== this.props.theme) {
      this.theme = createMuiTheme(nextProps.theme)
    }
  }

  render() {
    const { theme, ...rest } = this.props
    return (
      <MuiThemeProvider theme={this.theme}>
        <EnhancedLayout {...rest} />
      </MuiThemeProvider>
    )
  }
}

// LayoutWithTheme.propTypes = {
//     theme: PropTypes.object,
// };

// LayoutWithTheme.defaultProps = {
//     theme: defaultTheme,
// };

export default LayoutWithTheme
