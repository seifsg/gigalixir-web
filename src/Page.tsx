import React, { ReactElement } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({
  container: {
    marginLeft: "15px"
  },
  title: {
    borderBottom: '1px solid rgba(0,0,0,0.1)',
    paddingBottom: '20px',
  }
})

interface Props {
    title: string,
    children: ReactElement
}

interface EnhancedProps extends WithStyles<typeof styles> {
}

const Page = (props: Props & EnhancedProps) => {
    const { classes, children, title } = props
    return (
        <div className={classes.container}>
          <h3 className={classes.title}>{title}</h3>
          {children}
        </div>
    )
}

const EnhancedPage = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
)(Page)

export default EnhancedPage
