import { createStyles, Theme, withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import { ReduxState } from 'ra-core'
import React, { Component, createElement } from 'react'
import { AppBar, Error, Menu, Notification, Sidebar } from 'react-admin'
// import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import compose from 'recompose/compose'
import { CorrectedReduxState } from './CorrectedReduxState'
import Footer from './Footer'

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
      padding: theme.spacing(3),
      [theme.breakpoints.up('xs')]: {
        paddingLeft: 5
      },
      [theme.breakpoints.down('sm')]: {
        padding: 0
      }
    }
  })

/* eslint-disable @typescript-eslint/no-unused-vars */
const sanitizeRestProps = ({
  staticContext,
  history,
  location,
  match,
  ...props
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => props
/* eslint-enable @typescript-eslint/no-unused-vars */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Layout extends Component<any, any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(props: any) {
    super(props)
    /**
     * Reset the error state upon navigation
     *
     * @see https://stackoverflow.com/questions/48121750/browser-navigation-broken-by-use-of-react-error-boundaries
     */
    props.history.listen(() => {
      const { hasError } = this.state
      if (hasError) {
        this.setState({ hasError: false })
      }
    })
    this.state = { hasError: false, errorMessage: null, errorInfo: null }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public componentDidCatch(errorMessage: any, errorInfo: any) {
    this.setState({ hasError: true, errorMessage, errorInfo })
  }

  public render() {
    const {
      appBar,
      children,
      classes,
      className,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
          <Footer />
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

export default EnhancedLayout
