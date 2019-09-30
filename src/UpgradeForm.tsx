import React, {Component} from 'react';
import * as api from './api/api';
import {CardElement, injectStripe} from 'react-stripe-elements';

class UpgradeForm extends Component<{stripe: any}> {
  constructor(props: any) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev: any) {
    let {token} = await this.props.stripe.createToken({name: "Name"});

    // TODO: move into user.ts?
    api.post("/frontend/api/upgrade", {
        stripe_token: token.id
    }).then((response) => {
        console.log("upgraded")
    })
  }

  render() {
    return (
      <div className="checkout">
        <p>upgrade?</p>
        <CardElement />
        <button onClick={this.submit}>Upgrade</button>
      </div>
    );
  }
}

export default injectStripe(UpgradeForm);
