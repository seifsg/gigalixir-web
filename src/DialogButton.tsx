import React, { ReactNode } from 'react'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

interface Props {
  children: ReactNode
}

interface EnhancedProps extends WithStyles<typeof styles> {}

interface State {
  open: boolean
}

class DialogButton extends React.Component<Props & EnhancedProps, State> {
  constructor(props: Props & EnhancedProps) {
    super(props)
    this.state = { open: false }
  }

  render() {
    const toggleDrawer = (open: boolean) => (
      event: React.KeyboardEvent | React.MouseEvent
    ) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      this.setState({ open })
    }

    const { children } = this.props
    const { open } = this.state
    return (
      <div>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          color="primary"
        >
          Scale
        </Button>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
            {children}
        </SwipeableDrawer>
      </div>
    )
  }
}

const EnhancedDialogButton = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(DialogButton)

export default EnhancedDialogButton
