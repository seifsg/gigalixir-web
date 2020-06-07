import React, { FunctionComponent } from 'react'
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
      marginRight: spacing()
    }
  })
interface Props {
  invalid: boolean
  pristine: boolean
  submitting: boolean
  label: string
  variant?: 'text' | 'outlined' | 'contained' | undefined
}
type EnhancedProps = WithStyles<typeof styles>
const SubmitButton: FunctionComponent<Props & EnhancedProps> = ({
  classes,
  variant,
  invalid,
  pristine,
  submitting,
  label
}) => {
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

export default withStyles(styles)(SubmitButton)
