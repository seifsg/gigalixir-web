import React from 'react'
import { Loading, Query, Show, SimpleShowLayout, TextField } from 'react-admin'
import { Elements, StripeProvider } from 'react-stripe-elements'
import UpgradeForm from './UpgradeForm'
import UpdatePaymentMethodForm from './UpdatePaymentMethodForm'
import { PaymentMethod } from './api/payment_methods'

const ProfileShow = (props: { staticContext: {} }) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { staticContext, ...sanitizedProps } = props
  return (
    <div>
      <Show
        /*
          As this component isn't loaded from a route generated by a <Resource>,
          I have to provide the id myself.
          As there is only one config for the current user, I decided to
          hard-code it here
        */
        id="profile"
        /*
          For the same reason, I need to provide the resource and basePath props
          which are required by the Edit component
        */

        resource="profile"
        basePath="/login"
        redirect="" // I don't need any redirection here, there's no list page
        /*
          I also customized the page title as it'll make more sense to the user
        */
        title="My profile"
        {...sanitizedProps}
      >
        <SimpleShowLayout>
          <TextField source="email" />
          <TextField source="tier" />
          <TextField source="credit_cents" />
        </SimpleShowLayout>
      </Show>
      <Query type="GET_ONE" resource="payment_methods">
        {({
          data,
          loading,
          error
        }: {
          data: PaymentMethod
          loading: boolean
          error: Error
        }): React.ReactElement => {
          if (loading) {
            return <Loading />
          }
          if (error) {
            return <div>Error: {error.message}</div>
          }
          return (
            <div>
              <h1>Current Credit Card</h1>
              <ul>
                <li>Brand: {data.brand}</li>
                <li>
                  Expiration: {data.expMonth}/{data.expYear}
                </li>
                <li>Last 4: {data.last4}</li>
              </ul>
            </div>
          )
        }}
      </Query>

      <StripeProvider apiKey="pk_test_6tMDkFKTz4N0wIFQZHuzOUyW">
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
            <UpgradeForm stripe="hello" />
          </Elements>
        </div>
      </StripeProvider>
      <StripeProvider apiKey="pk_test_6tMDkFKTz4N0wIFQZHuzOUyW">
        <div className="example">
          <h1>Update Credit Card</h1>
          Enter your new credit card information below
          <Elements>
            {/* stripe parameter is injected automatically by StripeProvider, but 
                typescript complains about it if I don't put something here */}
            <UpdatePaymentMethodForm stripe="hello" />
          </Elements>
        </div>
      </StripeProvider>
    </div>
  )
}

export default ProfileShow