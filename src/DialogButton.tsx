import React, { ReactNode } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

export type CloseFunction = Function
interface Props {
  label: ReactNode
  children: (close: CloseFunction) => ReactNode
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

    const { label, children } = this.props
    const { open } = this.state
    return (
      <div>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          color="primary"
        >
          {label}
        </Button>
        <Dialog
          open={open}
          onClose={toggleDrawer(false)}
          aria-labelledby="form-dialog-title"
        >
          {children(toggleDrawer(false))}
        </Dialog>
      </div>
    )
  }
}

const EnhancedDialogButton = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(DialogButton)

export default EnhancedDialogButton
