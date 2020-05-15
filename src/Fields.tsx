import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  fields: {
    display: 'flex'
  }
})

interface Props {
}

interface EnhancedProps extends WithStyles<typeof styles> {}

const Fields: FunctionComponent<Props & EnhancedProps> = (props) => {
  const { classes, children } = props
  return <div className={classes.fields}>{children}</div>
}

const EnhancedFields = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Fields)

export default EnhancedFields
