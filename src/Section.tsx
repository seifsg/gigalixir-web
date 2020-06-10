import React, { ReactNode } from 'react'
import Paper from '@material-ui/core/Paper'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  section: {
    border: '1px solid rgba(0,0,0,0.1)',
    padding: '20px',
    '& h4': {
      marginTop: 20
    },
    '& h4:first-child': {
      marginTop: 0
    }
  }
})

interface Props {
  children: ReactNode
  marginTop?: number
}

type EnhancedProps = WithStyles<typeof styles>

const Section = (props: Props & EnhancedProps) => {
  const { marginTop, classes, children } = props
  return (
    <Paper style={{ marginTop }} className={classes.section} elevation={0}>
      {children}
    </Paper>
  )
}

const EnhancedSection = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Section)

EnhancedSection.defaultProps = {
  marginTop: 40
}

export default EnhancedSection
