/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { connect } from 'react-redux';
import { CrudUpdateAction } from './crudUpdate'
import { CRUD_UPDATE, UPDATE} from 'react-admin'
import compose from 'recompose/compose';
import React, { Component } from 'react'
import { CardElement, injectStripe } from 'react-stripe-elements'

class UpgradeForm extends Component<{ upgrade: (token: string) => void, stripe: any }> {
  public constructor(props: any) {
    super(props)
    this.submit = this.submit.bind(this)
  }

  public async submit() {
    const { stripe, upgrade } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })
    upgrade(token.id)
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


const upgrade = (token: string): CrudUpdateAction => ({
    type: CRUD_UPDATE,
    payload: { id: token, data: { token } },
    meta: {
        resource: "users",
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: 'Account Upgraded',
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
    null,
    {
      upgrade
    }
  )
)(UpgradeForm)
