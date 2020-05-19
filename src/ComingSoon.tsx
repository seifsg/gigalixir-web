import React, { FunctionComponent} from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

interface Props {}

interface EnhancedProps extends WithStyles<typeof styles> {}

const ComingSoon: FunctionComponent<Props & EnhancedProps> = props => {
  return (
    <div>
      <div>Please use the CLI while we work on implementing this section. </div>
      <div>
        <a href="https://gigalixir.readthedocs.io/en/latest/main.html#install-the-command-line-interface">
          How to install the CLI
        </a>
      </div>
    </div>
  )
}

const EnhancedComingSoon = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(ComingSoon)

export default EnhancedComingSoon
