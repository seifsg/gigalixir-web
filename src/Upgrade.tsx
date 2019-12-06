import React from 'react'
import UpgradeForm from './UpgradeForm'
import { Elements, StripeProvider } from 'react-stripe-elements'

const stripeKey = process.env.STRIPE_API_KEY || "missing!"

export default (props: {record: {tier: string}}) => {
    if (props.record.tier === "FREE") {
    return (
      <StripeProvider apiKey={stripeKey}>
        <div className="example">
          <h1>Upgrade</h1>
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
              To estimate costs, try our <a href="/pricing">Cost Estimator</a>
            </p>
            <p>Please enter your credit card information below to upgrade.</p>
          </div>

          <Elements>
            {/* stripe parameter is injected automatically by StripeProvider, but 
                typescript complains about it if I don't put something here */}
            <UpgradeForm stripe="override-me" />
          </Elements>
        </div>
      </StripeProvider>
          )
} else {
    return <span />
        }
    }
