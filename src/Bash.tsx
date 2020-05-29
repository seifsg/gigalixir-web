import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  bash: {
    backgroundColor: '#374850',
    color: '#ddd',
    padding: '8px',
    marginBottom: '10px',
    fontFamily: 'Courier,serif',
    letterSpacing: '-1px'
  }
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface EnhancedProps extends WithStyles<typeof styles> {}

const Bash: FunctionComponent<Props & EnhancedProps> = props => {
  const { classes, children } = props
  return <div className={classes.bash}>{children}</div>
}

const EnhancedBash = compose<Props & EnhancedProps, Props>(withStyles(styles))(
  Bash
)

export default EnhancedBash
