import React, { Component } from "react";
import * as payment_methods from "./api/payment_methods";
import { CardElement, injectStripe } from "react-stripe-elements";

class UpdatePaymentMethodForm extends Component<{ stripe: any }> {
  constructor(props: any) {
    super(props);
    this.submit = this.submit.bind(this);
  }

  async submit(ev: any) {
    // TODO: name is not used
    let { token } = await this.props.stripe.createToken({ name: "Name" });
    payment_methods.put(token.id).then(response => {
      console.log("updated!");
    });
  }

  render() {
    return (
      <div className="checkout">
        <p>update?</p>
        <CardElement />
        <button onClick={this.submit}>Update</button>
      </div>
    );
  }
}

export default injectStripe(UpdatePaymentMethodForm);
