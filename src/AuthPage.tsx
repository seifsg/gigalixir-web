import React, { FunctionComponent, ReactNode } from 'react'
import classnames from 'classnames'
import { withStyles, createStyles, WithStyles } from '@material-ui/core/styles'
import Card from '@material-ui/core/Card'

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
      marginTop: '6em'
    }
  })

interface Props {
  children: ReactNode
}

interface EnhancedProps extends WithStyles<typeof styles> {}
export const AuthPage: FunctionComponent<Props & EnhancedProps> = props => {
  const { children, classes } = props
  return (
    <div className={classnames(classes.main)}>
      <Card className={classes.card}>{children}</Card>
    </div>
  )
}

const EnhancedAuthPage = withStyles(styles)(AuthPage)

export default EnhancedAuthPage
