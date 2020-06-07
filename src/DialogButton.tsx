import React, { ReactNode } from 'react'
import Dialog from '@material-ui/core/Dialog'
import Button from '@material-ui/core/Button'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { PropTypes as MaterialUiPropTypes } from '@material-ui/core'

const styles = createStyles({})

export type CloseFunction = Function
interface Props {
  label: ReactNode
  className?: string
  containerClassName?: string
  color?: MaterialUiPropTypes.Color
  disabled?: boolean
  children: (close: CloseFunction) => ReactNode
}

type EnhancedProps = WithStyles<typeof styles>

interface State {
  open: boolean
}

class BaseDialogButton extends React.Component<Props & EnhancedProps, State> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.state = { open: false }
  }

  public render() {
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

    const {
      label,
      disabled,
      children,
      className,
      color,
      containerClassName
    } = this.props
    const { open } = this.state
    return (
      <div className={containerClassName || ''}>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          color={color || 'primary'}
          disabled={disabled}
          className={className || ''}
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

const DialogButton = compose<Props & EnhancedProps, Props>(withStyles(styles))(
  BaseDialogButton
)

export default DialogButton
