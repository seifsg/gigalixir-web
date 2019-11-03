import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import * as paymentMethods from './api/payment_methods'

class UpdatePaymentMethodForm extends Component<{ stripe: any }> {
  public constructor(props: any) {
    super(props)
    console.log(JSON.stringify(props))
    this.submit = this.submit.bind(this)
  }

  public async submit(ev: any) {
    // TODO: name is not used
    const { stripe } = this.props
    // TODO: how does createToken get the card info?
    const { token } = await stripe.createToken({ name: 'Name' })
    paymentMethods.put(token.id).then(response => {
      console.log('updated!')
    })
  }

  public render() {
    return (
      <div className="checkout">
        <p>update?</p>
        <CardElement />
        <button type="submit" onClick={this.submit}>
          Update
        </button>
      </div>
    )
  }
}

export default injectStripe(UpdatePaymentMethodForm)
