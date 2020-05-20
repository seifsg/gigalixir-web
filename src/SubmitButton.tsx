import React from 'react'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'

const styles = createStyles({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})
interface Props {
  invalid: boolean
  pristine: boolean
  submitting: boolean
  label: string
}
interface EnhancedProps extends WithStyles<typeof styles> {}
class SubmitButton extends React.Component<Props & EnhancedProps> {
  render() {
    const { classes, invalid, pristine, submitting, label } = this.props
    return (
      <Button
        type="submit"
        disabled={invalid || pristine || submitting}
        color="primary"
      >
        {submitting && (
          <CircularProgress size={24} className={classes.buttonProgress} />
        )}
        {label}
      </Button>
    )
  }
}

export default withStyles(styles)(SubmitButton)
