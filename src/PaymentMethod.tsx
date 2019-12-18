import React from 'react'
import { Query } from 'react-admin'
import { PaymentMethod } from './api/payment_methods'

export default (props: { record: { tier: string } }) => {
  const {
    record: { tier }
  } = props
  if (tier === 'STANDARD') {
    return (
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
          // if (loading) {
          //   return <Loading />
          // }
          // if (error) {
          //   return <div>Error: {error.message}</div>
          // }
          if (!loading && !error) {
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
          }
          return <span />
        }}
      </Query>
    )
  }
  return <span />
}
