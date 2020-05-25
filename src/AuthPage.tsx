import React, { FunctionComponent, ReactNode } from 'react'
import { Notification } from 'react-admin'
import classnames from 'classnames'
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'
import Logo from './Logo'

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
      paddingTop: 10,
      paddingBottom: 10
    },
    avatar: {
      margin: '1em',
      display: 'flex',
      justifyContent: 'center'
    }
  })

interface Props {
  children: ReactNode
  bottomLinks?: ReactNode
}

interface EnhancedProps extends WithStyles<typeof styles> {}
export const AuthPage: FunctionComponent<Props & EnhancedProps> = props => {
  const { bottomLinks, children, classes } = props
  return (
    <div className={classnames(classes.main)}>
      <Card className={classes.card}>
        <div className={classes.avatar}>
          <Logo />
        </div>
        {children}
      </Card>
      {bottomLinks}
      <Notification />
    </div>
  )
}

const EnhancedAuthPage = withStyles(styles)(AuthPage)

export default EnhancedAuthPage
