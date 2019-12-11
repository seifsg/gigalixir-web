import React from 'react'
import UpdatePaymentMethodForm from './UpdatePaymentMethodForm'
import { Elements, StripeProvider } from 'react-stripe-elements'

const stripeKey = process.env.REACT_APP_STRIPE_API_KEY  || "missing"

export default (props: {record: {tier: string}}) => {
    console.log(JSON.stringify(props.record))
    if (props.record.tier === "STANDARD") {
    return (
      <StripeProvider apiKey={stripeKey}>
        <div className="example">
          <h1>Update Credit Card</h1>
          Enter your new credit card information below
          <Elements>
            {/* stripe parameter is injected automatically by StripeProvider, but 
                typescript complains about it if I don't put something here */}
            <UpdatePaymentMethodForm />
          </Elements>
        </div>
      </StripeProvider>
          )
} else {
    return <span />
        }
    }
