import React, { Children } from 'react'
import { connect } from 'react-redux'
import classNames from 'classnames'
import MuiAppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import { Theme, withStyles, createStyles } from '@material-ui/core/styles'
import MenuIcon from '@material-ui/icons/Menu'
import withWidth from '@material-ui/core/withWidth'
import compose from 'recompose/compose'
import { toggleSidebar as toggleSidebarAction } from 'ra-core'

import UserMenu from './UserMenu'
import Headroom from './Headroom'

const styles = (theme: Theme) =>
  createStyles({
    border: {
      display: "block",
      margin: "0 25px",
      borderBottom: "2px solid rgba(0,0,0,0.1)"
    },
    toolbar: {
      paddingRight: 24
    },
    menuButton: {
      marginLeft: '0.5em',
      marginRight: '0.5em'
    },
    menuButtonIconClosed: {
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      transform: 'rotate(0deg)'
    },
    menuButtonIconOpen: {
      transition: theme.transitions.create(['transform'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      transform: 'rotate(180deg)'
    },
    title: {
      flex: 1,
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }
  })

const AppBar = ({
  children,
  classes,
  className,
  // logo,
  logout,
  open,
  // title,
  toggleSidebar,
  userMenu,
  width,
  ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => (
  <Headroom>
    <MuiAppBar
      className={className}
      color="inherit"
      position="static"
      elevation={0}
      {...rest}
    >
      <Toolbar
        disableGutters
        variant={width === 'xs' ? 'regular' : 'dense'}
        className={classes.toolbar}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={toggleSidebar}
          className={classNames(classes.menuButton)}
        >
          <MenuIcon
            classes={{
              root: open
                ? classes.menuButtonIconOpen
                : classes.menuButtonIconClosed
            }}
          />
        </IconButton>
        {Children.count(children) === 0 ? (
          <Typography
            variant="title"
            color="inherit"
            className={classes.title}
            id="react-admin-title"
          />
        ) : (
          children
        )}
      </Toolbar>
    </MuiAppBar>
    <div className={classes.border}></div>
  </Headroom>
)

// AppBar.propTypes = {
//   children: PropTypes.node,
//   classes: PropTypes.object,
//   className: PropTypes.string,
//   logout: PropTypes.element,
//   open: PropTypes.bool,
//   title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
//   toggleSidebar: PropTypes.func.isRequired,
//   userMenu: PropTypes.node,
//   width: PropTypes.string
// }

AppBar.defaultProps = {
  userMenu: <UserMenu />
}

const enhance = compose(
  connect(() => ({}), {
    toggleSidebar: toggleSidebarAction
  }),
  withStyles(styles),
  withWidth()
)

export default enhance(AppBar)
