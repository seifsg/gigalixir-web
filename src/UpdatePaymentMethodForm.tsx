import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import FormHelperText from '@material-ui/core/FormHelperText'

import _ from 'lodash/fp'
import compose from 'recompose/compose'
import { CRUD_UPDATE_FAILURE, CRUD_UPDATE, UPDATE } from 'react-admin'

import { connect } from 'react-redux'
import { CardElement, injectStripe } from 'react-stripe-elements'
import { FETCH_ERROR } from 'ra-core'
import { reset } from 'redux-form'
import { CrudUpdateAction } from './crudUpdate'
import { CrudFailureAction } from './errorSagas'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}
interface EnhancedProps {
  error?: string
  isLoading: boolean
  stripe: { createToken: Function }
  updatePaymentMethod: (token: string) => void
  showError: (error: StripeErrorResponse) => void
  myReset: () => void
}

interface StripeErrorResponse {
  error: {
    message: string
  }
}
interface StripeTokenResponse {
  token: {
    id: string
  }
}
class UpdatePaymentMethodForm extends Component<Props & EnhancedProps> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    // console.log(JSON.stringify(props))
    this.submit = this.submit.bind(this)
  }

  public submit = () => {
    // TODO: name is not used
    const { stripe, updatePaymentMethod, showError, myReset } = this.props
    // TODO: how does createToken get the card info?
    stripe
      .createToken({ name: 'Name' })
      .then((response: StripeErrorResponse | StripeTokenResponse) => {
        if ('token' in response) {
          updatePaymentMethod(response.token.id)
          myReset()
        } else if ('error' in response) {
          showError(response)
        } else {
          showError({ error: { message: 'Unknown Error' } })
        }
      })
      .catch(() => {
        showError({ error: { message: 'Unknown Error' } })
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

// could this be CrudUpdateFailureAction instead? The problem is payload which they define as a string
// but we use sometimes as an object with errors and stuff.
const showError = (error: StripeErrorResponse): CrudFailureAction => {
  return {
    type: CRUD_UPDATE_FAILURE,
    error: error.error.message,
    payload: {
      errors: {
        // eslint-disable-next-line @typescript-eslint/camelcase
        stripe_token: [error.error.message]
      }
    },
    meta: {
      resource: 'payment_methods',
      fetchResponse: UPDATE,
      fetchStatus: FETCH_ERROR,
      notification: {
        body: '',
        level: 'warning'
      }
    }
  }
}

export default compose<Props & EnhancedProps, Props>(
  injectStripe,
  connect(mapStateToProps, {
    updatePaymentMethod,
    showError,
    myReset: () => reset('updatePaymentMethod')
  })
)(UpdatePaymentMethodForm)
