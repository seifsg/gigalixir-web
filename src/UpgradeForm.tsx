/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash/fp'
import { connect } from 'react-redux'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
import { CRUD_UPDATE, UPDATE } from 'react-admin'
import compose from 'recompose/compose'
import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { CrudUpdateAction } from './crudUpdate'

class UpgradeForm extends Component<{
  upgrade: (token: string) => void
  isLoading: boolean
  error: string | undefined
  stripe: any
}> {
  public constructor(props: any) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  public async submit() {
    const { stripe, upgrade } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })
    upgrade(token.id)
  }

  public render() {
    const { isLoading, error } = this.props
    return (
      <div className="checkout">
        <CardElement disabled={isLoading} />
        <FormHelperText error>{error}</FormHelperText>
        <Button
          type="submit"
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
  console.log(JSON.stringify(state))
  const error = _.get('form.upgradeUser.submitErrors.token', state)
  console.log(error)
  return {
    isLoading: state.admin.loading > 0,
    error
  }
}

export default compose(
  injectStripe,
  connect(mapStateToProps, {
    upgrade
  })
)(UpgradeForm)
