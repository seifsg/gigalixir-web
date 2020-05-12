import React from 'react'
import Paper from '@material-ui/core/Paper'
import { Elements, StripeProvider } from 'react-stripe-elements'
import UpgradeForm from './UpgradeForm'

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
  if (tier === 'FREE') {
    return (
      <StripeProvider apiKey={stripeKey}>
        <Paper elevation={0} className={className}>
          <div className="upgradeMarketing">
            <h3>Upgrade</h3>
            <p>You are currently on the free plan.</p>
            <p>Standard plan features include</p>
            <ul>
              <li>Larger replica sizes</li>
              <li>Multiple replicas</li>
              <li>Team access controls</li>
              <li>No inactivity checks</li>
              <li>Production-grade postgres</li>
            </ul>
            <p>
              For more details about the standard tier, see the{' '}
              <a href="https://gigalixir.readthedocs.io/en/latest/main.html#tiers">
                Tier Comparison
              </a>
            </p>
            <p>
              The standard plan costs $10/mo per 200MB of memory. CPU, power,
              &amp; bandwidth are free. Pro-rated to the second.{' '}
              <a href="https://gigalixir.readthedocs.io/en/latest/main.html#pricing-details">
                Pricing Details
              </a>
            </p>
            <p>
                To estimate costs, try our <a href="https://www.gigalixir.com/pricing">Cost Estimator</a>
            </p>
            <p>Please enter your credit card information below to upgrade.</p>
          </div>

          <Elements>
            {/* stripe parameter is injected automatically by StripeProvider, but 
                typescript complains about it if I don't put something here */}
            <UpgradeForm />
          </Elements>
        </Paper>
      </StripeProvider>
    )
  }
  return <span />
}
