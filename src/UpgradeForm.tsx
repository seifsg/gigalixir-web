/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash/fp'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import { CRUD_UPDATE, UPDATE } from 'react-admin'
import compose from 'recompose/compose'
import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { CrudUpdateAction } from './crudUpdate'

const styles = createStyles({
  checkout: {
    marginTop: '20px',
    maxWidth: '350px'
  },
  button: {
    marginTop: '20px'
  }
})

interface Props {}
interface EnhancedProps extends WithStyles<typeof styles> {
  upgrade: (token: string) => void
  isLoading: boolean
  error: string | undefined
  stripe: any
}

class UpgradeForm extends Component<Props & EnhancedProps> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  public async submit() {
    const { stripe, upgrade } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })
    if (!token) {
      // do nothing
    } else {
      upgrade(token.id)
    }
  }

  public render() {
    const { classes, isLoading, error } = this.props
    return (
      <div className={classes.checkout}>
        <CardElement disabled={isLoading} />
        <FormHelperText error>{error}</FormHelperText>
        <Button
          type="submit"
          className={classes.button}
          variant="raised"
          color="primary"
          onClick={this.submit}
          disabled={isLoading}
        >
          Upgrade
        </Button>
      </div>
    )
  }
}

const upgrade = (token: string): CrudUpdateAction => ({
  type: CRUD_UPDATE,
  payload: { id: token, data: { token } },
  meta: {
    resource: 'users',
    fetch: UPDATE,
    onSuccess: {
      notification: {
        body: 'Account Upgraded',
        level: 'info',
        messageArgs: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          smart_count: 1
        }
      },
      refresh: true, // refresh
      redirectTo: false,
      basePath: '/'
    },
    onFailure: {
      notification: {
        body: 'ra.notification.http_error',
        level: 'warning'
      }
    }
  }
})

function mapStateToProps(state: any) {
  // TODO: let redux-form do this stuff for us?
  const error = _.get('form.upgradeUser.submitErrors.token', state)
  return {
    isLoading: state.admin.loading > 0,
    error
  }
}

export default compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  injectStripe,
  connect(mapStateToProps, {
    upgrade
  })
)(UpgradeForm)
