/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'
import * as api from './api/api'

class UpgradeForm extends Component<{ stripe: any }> {
  public constructor(props: any) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  public async submit() {
    const { stripe } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })

    api
      .post('/frontend/api/upgrade', {
        // eslint-disable-next-line @typescript-eslint/camelcase
        stripe_token: token.id
      })
      .then(() => {
        console.log('upgraded')
      })
  }

  public render() {
    return (
      <div className="checkout">
        <CardElement />
        <button type="submit" onClick={this.submit}>
          Upgrade
        </button>
      </div>
    )
  }
}

export default injectStripe(UpgradeForm)
