import React, { Component } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText';

import _ from 'lodash/fp'
import compose from 'recompose/compose';
import { CrudUpdateAction } from './crudUpdate'
import { CRUD_UPDATE, UPDATE} from 'react-admin'

import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements'

class UpdatePaymentMethodForm extends Component<{ error: string | undefined, isLoading: boolean, stripe: any, updatePaymentMethod: (token: string) => void }> {
  public constructor(props: any) {
    super(props)
    // console.log(JSON.stringify(props))
    this.submit = this.submit.bind(this)
  }

  public submit = (ev: any) => {
    // TODO: name is not used
    const { stripe, updatePaymentMethod } = this.props
    // TODO: how does createToken get the card info?
      stripe.createToken({ name: 'Name' }).then((response: {token: {id: string}}) => {
        updatePaymentMethod(response.token.id)
      })

  }

  public render = () => {
      console.log(this.props.error)
    return (
      <div className="checkout">
        <CardElement />
        <FormHelperText error={ true }>
            {this.props.error}
        </FormHelperText>

        <button type="submit" onClick={this.submit}>
          Update
        </button>
      </div>
    )
  }
}

function mapStateToProps(state: any, props: any) {
    const error = _.get('form.updatePaymentMethod.submitErrors.token', state)
    console.log(error)
    return {
        isLoading: state.admin.loading > 0,
        error: error
    };
}

const updatePaymentMethod = (token: string): CrudUpdateAction => ({
    type: CRUD_UPDATE,
    payload: { id: token, data: { token } },
    meta: {
        resource: "payment_methods",
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: 'Credit Card Updated',
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh: true, // refresh
            redirectTo: false,
            basePath: "/",
        },
        onFailure: {
            notification: {
                body: 'ra.notification.http_error',
                level: 'warning',
            },
        },
    },
})

export default compose(
  injectStripe,
  connect(
    mapStateToProps,
    {
      updatePaymentMethod
    }
  )
)(UpdatePaymentMethodForm)
