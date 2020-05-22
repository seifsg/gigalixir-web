import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import {
  withStyles,
  createStyles,
  WithStyles,
} from '@material-ui/core/styles'
import qs from 'query-string'
import Card from '@material-ui/core/Card'

// copied from RegisterPage. pull it out if we use it a lot
// like say in LoginPage?
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
  location: {
    search: string
  }
}

interface EnhancedProps extends WithStyles<typeof styles> {}
export const SuccessPage: FunctionComponent<Props & EnhancedProps> = props => {
  const { classes, location } = props
  const params = qs.parse(location.search)
  if (typeof params.msg === 'string') {
    return (
        <div className={classnames(classes.main)}>
          <Card className={classes.card}>
            <div style={{ padding: 40 }}>{params.msg}</div>
          </Card>
        </div>
    )
  }
  return <span />
}

const EnhancedSuccessPage = withStyles(styles)(SuccessPage)

export default EnhancedSuccessPage
