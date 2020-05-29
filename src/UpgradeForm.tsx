/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FormHelperText from '@material-ui/core/FormHelperText'
import { CRUD_UPDATE, UPDATE } from 'react-admin'
import compose from 'recompose/compose'
import React, { Component } from 'react'
import {
  CardElement,
  ReactStripeElements,
  injectStripe
} from 'react-stripe-elements'
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
  upgrade: (token: string) => void
  isLoading: boolean
  stripe: any
}

interface State {
  complete: boolean
  error?: string
}
class UpgradeForm extends Component<Props & EnhancedProps, State> {
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
    const { stripe, upgrade } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })
    if (!token) {
      // do nothing
    } else {
      upgrade(token.id)
    }
  }

  public render() {
    const { handleSubmit, submitting, classes, isLoading } = this.props
    const { complete } = this.state
    // eslint-disable-next-line react/destructuring-assignment
    const error = this.props.error || this.state.error
    // hacky because the stripe CardElement isn't a regular field
    // and doesn't hook into reduxForm that easily
    // TODO: hook it into redux form
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
            // we let CardElement tell us when the button is disabled
            invalid={!complete}
            pristine={false}
            // we add isLoading because submitting=true is when we call stripe
            // isLoading=true is when we hit the api server
            submitting={submitting || isLoading}
            variant="raised"
            label="Upgrade"
          />
        </form>
      </div>
    )
  }
}

const upgrade = (token: string): CrudUpdateAction => ({
  type: CRUD_UPDATE,
  payload: { id: token, data: { token } },
  meta: {
    resource: 'users',
    fetch: UPDATE,
    onSuccess: {
      notification: {
        body: 'Account Upgraded',
        level: 'info',
        messageArgs: {
          // eslint-disable-next-line @typescript-eslint/camelcase
          smart_count: 1
        }
      },
      refresh: true, // refresh
      redirectTo: false,
      basePath: '/'
    },
    onFailure: {
      // TODO: why is no callback needed here?
    }
  }
})

function mapStateToProps(state: any) {
  // TODO: let redux-form do this stuff for us?
  // const error = _.get('form.upgradeUser.submitErrors.token', state)
  return {
    isLoading: state.admin.loading > 0
  }
}

export default compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  injectStripe,
  connect(mapStateToProps, {
    upgrade
  }),
  reduxForm({
    form: 'upgradeUser'
  })
)(UpgradeForm)
