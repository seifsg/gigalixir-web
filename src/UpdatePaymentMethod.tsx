import React from 'react'
import UpdatePaymentMethodForm from './UpdatePaymentMethodForm'
import { Elements, StripeProvider } from 'react-stripe-elements'

export default (props: {record: {tier: string}}) => {
    console.log(JSON.stringify(props.record))
    if (props.record.tier === "STANDARD") {
    return (
      <StripeProvider apiKey="pk_test_6tMDkFKTz4N0wIFQZHuzOUyW">
        <div className="example">
          <h1>Update Credit Card</h1>
          Enter your new credit card information below
          <Elements>
            {/* stripe parameter is injected automatically by StripeProvider, but 
                typescript complains about it if I don't put something here */}
            <UpdatePaymentMethodForm stripe="override-me" />
          </Elements>
        </div>
      </StripeProvider>
          )
} else {
    return <span />
        }
    }
