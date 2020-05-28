import React, { FunctionComponent, ReactNode } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

interface Props {
  children: ReactNode
}

type EnhancedProps = WithStyles<typeof styles>

const Error: FunctionComponent<Props & EnhancedProps> = ({ children }) => {
  return <div>{children}</div>
}

const EnhancedError = compose<Props & EnhancedProps, Props>(withStyles(styles))(
  Error
)

export default EnhancedError
