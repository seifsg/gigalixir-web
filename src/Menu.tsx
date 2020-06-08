import { createStyles, withStyles } from '@material-ui/core/styles'
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/PowerSettingsNew'
import DefaultIcon from '@material-ui/icons/ViewList'
import classnames from 'classnames'
import { getResources, useLogout } from 'ra-core'
import React, { useCallback } from 'react'
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
  // we handle this in sessions.ts. we do not need to vary the logout
  // destination, so we just ignore it here
  // redirectTo,
  // this is here so that it isn't in `rest` and does not get passed into the div which errors
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  hasDashboard,
  ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => {
  const logout = useLogout()
  const handleLogoutClick = useCallback(() => logout('/login'), [
    // redirectTo,
    logout
  ])

  return (
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
        to="/login"
        primaryText="Logout"
        leftIcon={<ExitIcon />}
        onClick={handleLogoutClick}
        dense={dense}
      />
    </div>
  )
}

Menu.defaultProps = {
  onMenuClick: () => null
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = (state: any) => ({
  open: state.admin.ui.sidebarOpen,
  resources: getResources(state),
  pathname: state.router.location.pathname // used to force redraw on navigation
})

const enhance = compose(
  connect(
    mapStateToProps,
    {}, // Avoid connect passing dispatch in props,
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
