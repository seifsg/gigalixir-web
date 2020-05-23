import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  Theme,
  withStyles,
  WithStyles,
  createStyles
} from '@material-ui/core/styles'

const styles = ({ spacing }: Theme) =>
  createStyles({
    icon: {
      marginRight: spacing.unit
    }
  })
interface Props {
  invalid: boolean
  pristine: boolean
  submitting: boolean
  label: string
  variant?: 'text' | 'flat' | 'outlined' | 'contained' | 'raised'
}
interface EnhancedProps extends WithStyles<typeof styles> {}
class SubmitButton extends React.Component<Props & EnhancedProps> {
  render() {
    const {
      classes,
      variant,
      invalid,
      pristine,
      submitting,
      label
    } = this.props
    return (
      <Button
        type="submit"
        disabled={invalid || pristine || submitting}
        color="primary"
        variant={variant}
      >
        {submitting && (
          <CircularProgress className={classes.icon} size={18} thickness={2} />
        )}
        {label}
      </Button>
    )
  }
}

export default withStyles(styles)(SubmitButton)
