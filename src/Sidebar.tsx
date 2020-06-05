import React, {
  ReactElement,
  PureComponent,
  Children,
  cloneElement
} from 'react'
import {
  ReduxState,
  setSidebarVisibility as setSidebarVisibilityRaCore
} from 'ra-core'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import Drawer from '@material-ui/core/Drawer'
import {
  Theme,
  WithStyles,
  withStyles,
  createStyles
} from '@material-ui/core/styles'
import withWidth from '@material-ui/core/withWidth'

import { Responsive } from 'react-admin'
import { CorrectedReduxState } from './CorrectedReduxState'

export const DRAWER_WIDTH = 240
export const CLOSED_DRAWER_WIDTH = 55

const styles = (theme: Theme) =>
  createStyles({
    drawerPaper: {
      position: 'relative',
      height: 'auto',
      overflowX: 'hidden',
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      }),
      backgroundColor: 'transparent',
      marginTop: '0.5em',
      borderRight: 'none',
      [theme.breakpoints.only('xs')]: {
        marginTop: 0,
        height: '100vh',
        position: 'inherit',
        backgroundColor: theme.palette.background.default
      },
      [theme.breakpoints.up('md')]: {
        border: 'none',
        marginTop: '1.5em'
      },
      // undo antd hover color
      '& a:hover': {
        color: 'inherit'
      }
    }
  })

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface EnhancedProps extends WithStyles<typeof styles> {
  children: ReactElement
  closedSize: number
  open: boolean
  setSidebarVisibility: (open: boolean) => void
  size: number
  width: string
}

// We shouldn't need PureComponent here as it's connected
// but for some reason it keeps rendering even though mapStateToProps returns the same object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class Sidebar extends PureComponent<Props & EnhancedProps> {
  public componentWillMount() {
    const { width, setSidebarVisibility } = this.props
    if (width !== 'xs' && width !== 'sm') {
      setSidebarVisibility(true)
    }
  }

  // eslint-disable-next-line react/destructuring-assignment
  private handleClose = () => this.props.setSidebarVisibility(false)

  private toggleSidebar = () =>
    // eslint-disable-next-line react/destructuring-assignment
    this.props.setSidebarVisibility(!this.props.open)

  public render() {
    const { children, classes, closedSize, open, size, ...rest } = this.props

    // pulls out properties we do not want to pass to components below
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { setSidebarVisibility, ...sanitizedProps } = rest
    const child = Children.only(children)

    return (
      <Responsive
        xsmall={
          <Drawer
            variant="temporary"
            open={open}
            PaperProps={{
              className: classes.drawerPaper,
              style: { width: size }
            }}
            onClose={this.toggleSidebar}
            {...sanitizedProps}
          >
            {cloneElement(child, {
              onMenuClick: this.handleClose
            })}
          </Drawer>
        }
        small={
          <Drawer
            variant="permanent"
            open={open}
            PaperProps={{
              className: classes.drawerPaper,
              style: {
                width: open ? size : closedSize
              }
            }}
            onClose={this.toggleSidebar}
            {...sanitizedProps}
          >
            {cloneElement(child, {
              dense: true,
              onMenuClick: this.handleClose
            })}
          </Drawer>
        }
        medium={
          <Drawer
            variant="permanent"
            open={open}
            PaperProps={{
              className: classes.drawerPaper,
              style: {
                width: open ? size : closedSize
              }
            }}
            onClose={this.toggleSidebar}
            {...sanitizedProps}
          >
            {cloneElement(child, { dense: true })}
          </Drawer>
        }
      />
    )
  }
}

// Sidebar.propTypes = {
//     children: PropTypes.node.isRequired,
//     classes: PropTypes.object,
//     closedSize: PropTypes.number,
//     open: PropTypes.bool.isRequired,
//     setSidebarVisibility: PropTypes.func.isRequired,
//     size: PropTypes.number,
//     width: PropTypes.string,
// };

const mapStateToProps = (state: ReduxState & CorrectedReduxState) => ({
  open: state.admin.ui.sidebarOpen,
  locale: state.locale // force redraw on locale change
})

const EnhancedSidebar = compose<Props & EnhancedProps, Props>(
  connect(mapStateToProps, {
    setSidebarVisibility: setSidebarVisibilityRaCore
  }),
  withStyles(styles),
  withWidth({ resizeInterval: Infinity }) // used to initialize the visibility on first render
)(Sidebar)

EnhancedSidebar.defaultProps = {
  size: DRAWER_WIDTH,
  closedSize: CLOSED_DRAWER_WIDTH
}

export default EnhancedSidebar
