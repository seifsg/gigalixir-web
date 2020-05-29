import FormHelperText from '@material-ui/core/FormHelperText'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import _ from 'lodash/fp'
import React, { Component } from 'react'
import { CRUD_UPDATE, UPDATE } from 'react-admin'
import { connect } from 'react-redux'
import {
  CardElement,
  injectStripe,
  ReactStripeElements
} from 'react-stripe-elements'
import compose from 'recompose/compose'
import { Field, InjectedFormProps, reduxForm } from 'redux-form'
import { CrudUpdateAction } from './crudUpdate'
import { renderError } from './fieldComponents'
import SubmitButton from './SubmitButton'

const styles = createStyles({
  checkout: {
    marginTop: '20px',
    maxWidth: '350px'
  },
  button: {
    marginTop: '20px'
  }
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface FormData {}

interface EnhancedProps
  extends WithStyles<typeof styles>,
    InjectedFormProps<FormData> {
  isLoading: boolean
  stripe: { createToken: Function }
  updatePaymentMethod: (token: string) => void
}

interface StripeErrorResponse {
  error: {
    message: string
  }
}
interface StripeTokenResponse {
  token: {
    id: string
  }
}

interface State {
  complete: boolean
  error?: string
}

class UpdatePaymentMethodForm extends Component<Props & EnhancedProps, State> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.submit = this.submit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
      complete: false
    }
  }

  private onChange(params: ReactStripeElements.ElementChangeResponse) {
    this.setState({
      complete: params.complete,
      error: params.error && params.error.message
    })
  }

  private async submit() {
    // TODO: name is not used
    const { stripe, updatePaymentMethod } = this.props
    // TODO: how does createToken get the card info?
    const { token } = await stripe.createToken({ name: 'Name' })
    if (!token) {
      // do nothing
    } else {
      updatePaymentMethod(token.id)
    }
  }

  public render = () => {
    const { handleSubmit, classes, isLoading, submitting } = this.props
    const { complete } = this.state
    const error = this.props.error || this.state.error
    return (
      <div className={classes.checkout}>
        <CardElement
          disabled={isLoading || submitting}
          onChange={this.onChange}
        />
        <Field name="token" component={renderError} />
        {error && <FormHelperText error>{error}</FormHelperText>}
        <form onSubmit={handleSubmit(this.submit)} style={{ marginTop: 10 }}>
          <SubmitButton
            invalid={!complete}
            pristine={false}
            submitting={submitting || isLoading}
            variant="raised"
            label="Update"
          />
        </form>
      </div>
    )
  }
}

function mapStateToProps(state: { admin: { loading: number } }) {
  const error = _.get('form.updatePaymentMethod.submitErrors.token', state)
  return {
    isLoading: state.admin.loading > 0,
    error
  }
}

const updatePaymentMethod = (token: string): CrudUpdateAction => ({
  type: CRUD_UPDATE,
  payload: { id: token, data: { token } },
  meta: {
    resource: 'payment_methods',
    fetch: UPDATE,
    onSuccess: {
      notification: {
        body: 'Credit Card Updated',
        level: 'info',
        messageArgs: {
          // not sure if this is needed. copy and pasted from somewhere.
          // eslint-disable-next-line @typescript-eslint/camelcase
          smart_count: 1
        }
      },
      refresh: true, // refresh
      redirectTo: false,
      basePath: '/'
    },
    onFailure: {}
  }
})

export default compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  injectStripe,
  connect(mapStateToProps, {
    updatePaymentMethod
  }),
  reduxForm({
    form: 'updatePaymentMethod'
  })
)(UpdatePaymentMethodForm)
