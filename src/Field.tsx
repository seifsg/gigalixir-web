import React, { FunctionComponent, ReactNode } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  label: {
    color: 'rgba(0,0,0,0.5)',
    paddingBottom: '5px'
  },
  value: {},
  field: {
    flex: 1
  }
})

interface Props {
  label: string
  children: ReactNode
}

interface EnhancedProps extends WithStyles<typeof styles> {}

const Field: FunctionComponent<Props & EnhancedProps> = (props) => {
  const { classes, label, children } = props
  return (
    <div className={classes.field}>
      <div className={classes.label}>{label}</div>
      <div className={classes.value}>{children}</div>
    </div>
  )
}

const EnhancedField = compose<Props & EnhancedProps, Props>(withStyles(styles))(
  Field
)

export default EnhancedField
