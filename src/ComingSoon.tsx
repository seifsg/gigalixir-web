import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'

const styles = createStyles({})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

type EnhancedProps = WithStyles<typeof styles>

const ComingSoon: FunctionComponent<Props & EnhancedProps> = () => {
  return (
    <div>
      <div>
        Sorry, this is coming soon. Please use the CLI in the meantime.{' '}
      </div>
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
