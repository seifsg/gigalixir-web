import React, { ReactElement } from 'react'
import Paper from '@material-ui/core/Paper'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  section: {
    marginTop: "40px",
    border: "1px solid rgba(0,0,0,0.1)",
    padding: "20px",
  }
})

interface Props {
    children: ReactElement
}

interface EnhancedProps extends WithStyles<typeof styles> {
}

const Section = (props: Props & EnhancedProps) => {
    const { classes, children } = props
    return (
        <Paper className={classes.section} elevation={0}>
          {children}
        </Paper>
    )
}

const EnhancedSection = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
)(Section)

export default EnhancedSection
