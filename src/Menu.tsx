import { createStyles, withStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/PowerSettingsNew'
import DefaultIcon from '@material-ui/icons/ViewList'
import classnames from 'classnames'
import { getResources, userLogout as userLogoutAction } from 'ra-core'
import React from 'react'
import { MenuItemLink } from 'react-admin'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import _ from 'lodash/fp'

const styles = createStyles({
  main: {
    marginTop: '14px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start'
  }
})

const Menu = ({
  classes,
  className,
  dense,
  onMenuClick,
  resources,
  userLogout,
  ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => (
  <div className={classnames(classes.main, className)} {...rest}>
    {resources
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((r: any) => r.hasList)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((resource: any) => (
        <MenuItemLink
          key={resource.name}
          to={`/${resource.name}`}
          primaryText={_.capitalize(resource.name)}
          leftIcon={resource.icon ? <resource.icon /> : <DefaultIcon />}
          onClick={onMenuClick}
          dense={dense}
        />
      ))}
    <MenuItemLink
      key="account"
      to="/account"
      primaryText="My Account"
      leftIcon={<AccountCircle />}
      onClick={onMenuClick}
      dense={dense}
    />
    <MenuItemLink
      key="logout"
      to="#"
      primaryText="Logout"
      leftIcon={<ExitIcon />}
      onClick={userLogout}
      dense={dense}
    />
  </div>
)

// Menu.propTypes = {
//   classes: PropTypes.object,
//   className: PropTypes.string,
//   dense: PropTypes.bool,
//   hasDashboard: PropTypes.bool,
//   logout: PropTypes.element,
//   onMenuClick: PropTypes.func,
//   open: PropTypes.bool,
//   pathname: PropTypes.string,
//   resources: PropTypes.array.isRequired,
//   translate: PropTypes.func.isRequired
// }

Menu.defaultProps = {
  onMenuClick: () => null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: any) => ({
  open: state.admin.ui.sidebarOpen,
  resources: getResources(state),
  pathname: state.router.location.pathname // used to force redraw on navigation
})

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapDispatchToProps = (dispatch: any, { redirectTo }: any) => ({
  userLogout: () => dispatch(userLogoutAction(redirectTo))
})

const enhance = compose(
  connect(
    mapStateToProps,
    mapDispatchToProps,
    // {}, // Avoid connect passing dispatch in props,
    null,
    {
      areStatePropsEqual: (prev, next) =>
        prev.resources.every(
          (value, index) => value === next.resources[index] // shallow compare resources
        ) &&
        prev.pathname === next.pathname &&
        prev.open === next.open
    }
  ),
  withStyles(styles)
)

export default enhance(Menu)
