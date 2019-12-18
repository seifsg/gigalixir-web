import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import _ from 'lodash/fp'
import compose from 'recompose/compose'
import { CRUD_UPDATE, UPDATE } from 'react-admin'

import { connect } from 'react-redux'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { CrudUpdateAction } from './crudUpdate'

class UpdatePaymentMethodForm extends Component<{
  error: string | undefined
  isLoading: boolean
  stripe: { createToken: Function }
  updatePaymentMethod: (token: string) => void
}> {
  public constructor(props: any) {
    super(props)
    // console.log(JSON.stringify(props))
    this.submit = this.submit.bind(this)
  }

  public submit = () => {
    // TODO: name is not used
    const { stripe, updatePaymentMethod } = this.props
    // TODO: how does createToken get the card info?
    stripe
      .createToken({ name: 'Name' })
      .then((response: { token: { id: string } }) => {
        updatePaymentMethod(response.token.id)
      })
  }

  public render = () => {
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
          Update
        </Button>
      </div>
    )
  }
}

function mapStateToProps(state: { admin: { loading: number } }) {
  const error = _.get('form.updatePaymentMethod.submitErrors.token', state)
  return {
    isLoading: state.admin.loading > 0,
    error
  }
}

const updatePaymentMethod = (token: string): CrudUpdateAction => ({
  type: CRUD_UPDATE,
  payload: { id: token, data: { token } },
  meta: {
    resource: 'payment_methods',
    fetch: UPDATE,
    onSuccess: {
      notification: {
        body: 'Credit Card Updated',
        level: 'info',
        messageArgs: {
          // not sure if this is needed. copy and pasted from somewhere.
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

export default compose(
  injectStripe,
  connect(mapStateToProps, {
    updatePaymentMethod
  })
)(UpdatePaymentMethodForm)
