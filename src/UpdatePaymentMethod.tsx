import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Elements, StripeProvider } from 'react-stripe-elements'
import UpdatePaymentMethodForm from './UpdatePaymentMethodForm'
import Section from './Section'

const stripeKey = process.env.REACT_APP_STRIPE_API_KEY || 'missing'

interface Props {
    className: string
    record: {
        tier: string
    }
}

export default (props: Props) => {
  const {
    className,
    record: { tier }
  } = props
  if (tier === 'STANDARD') {
    return (
      <StripeProvider apiKey={stripeKey}>
        <Section>
          <h4>Update Payment Method</h4>
          <div>
              Enter your card details below
              <Elements>
                {/* stripe parameter is injected automatically by StripeProvider, but 
                    typescript complains about it if I don't put something here */}
                <UpdatePaymentMethodForm />
              </Elements>
          </div>
        </Section>
      </StripeProvider>
    )
  }
  return <span />
}
