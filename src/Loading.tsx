import React from 'react'
import { withStyles, Theme, createStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import classnames from 'classnames'
import CircularProgress from '@material-ui/core/CircularProgress'

const styles = (theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      [theme.breakpoints.up('md')]: {
        height: '100%'
      },
      [theme.breakpoints.down('sm')]: {
        height: '100vh',
        marginTop: '-3em'
      }
    },
    icon: {
      width: '9em',
      height: '9em'
    },
    message: {
      textAlign: 'center',
      fontFamily: 'Roboto, sans-serif',
      opacity: 0.5,
      margin: '0 1em'
    }
  })

const Loading = ({
  classes,
  className
}: /* eslint-disable @typescript-eslint/no-explicit-any */
any) => (
  <div className={classnames(classes.container, className)}>
    <div className={classes.message}>
      <CircularProgress className={classes.icon} color="primary" />
    </div>
  </div>
)

// Loading.propTypes = {
//   classes: PropTypes.object,
//   className: PropTypes.string,
//   translate: PropTypes.func.isRequired,
//   loadingPrimary: PropTypes.string,
//   loadingSecondary: PropTypes.string
// }

// Loading.defaultProps = {
//   loadingPrimary: 'ra.page.loading',
//   loadingSecondary: 'ra.message.loading'
// }

const enhance = compose(withStyles(styles))

export default enhance(Loading)
