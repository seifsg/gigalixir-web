import React, { Component } from 'react'
import compose from 'recompose/compose';
import { CrudUpdateAction } from './crudUpdate'
import { CRUD_UPDATE, UPDATE} from 'react-admin'

import { connect } from 'react-redux';
import { CardElement, injectStripe } from 'react-stripe-elements'

class UpdatePaymentMethodForm extends Component<{ isLoading: boolean, stripe: any, updatePaymentMethod: (token: string) => void }> {
  public constructor(props: any) {
    super(props)
    console.log(JSON.stringify(props))
    this.submit = this.submit.bind(this)
  }

  public submit = (ev: any) => {
    // TODO: name is not used
    const { stripe, updatePaymentMethod } = this.props
    // TODO: how does createToken get the card info?
      stripe.createToken({ name: 'Name' }).then((response: {token: {id: string}}) => {
        updatePaymentMethod(response.token.id)
      })

    // TODO: use dataProvider instead so we can set onSuccess notification and refresh/redirect
    // should we use withDataProvider or Mutation component?
    // paymentMethods.put(token.id).then(response => {
    //   console.log('updated!')
    // })
  }

  public render = () => {
    return (
      <div className="checkout">
        <CardElement />
        <button type="submit" onClick={this.submit}>
          Update
        </button>
      </div>
    )
  }
}

function mapStateToProps(state: any, props: any) {
    return {
        isLoading: state.admin.loading > 0,
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
