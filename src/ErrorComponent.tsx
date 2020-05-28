import React, { FunctionComponent, ReactNode } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

interface Props {
  children: ReactNode
}

type EnhancedProps = WithStyles<typeof styles>

const ErrorComponent: FunctionComponent<Props & EnhancedProps> = ({
  children
}) => {
  return <div>{children}</div>
}

const EnhancedErrorComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(ErrorComponent)

export default EnhancedErrorComponent
