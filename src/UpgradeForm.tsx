/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import _ from 'lodash/fp'
import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from 'redux-form'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import FormHelperText from '@material-ui/core/FormHelperText'
import Button from '@material-ui/core/Button'
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

interface Props {}
interface FormData {}
interface EnhancedProps
  extends WithStyles<typeof styles>,
    InjectedFormProps<FormData> {
  upgrade: (token: string) => void
  isLoading: boolean
  stripe: any
}

interface State {
    complete: boolean,
        error?: string
}
class UpgradeForm extends Component<Props & EnhancedProps, State> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.submit = this.submit.bind(this)
    this.onChange = this.onChange.bind(this)
    this.state = {
        complete: false,
    }
  }

  public async submit() {
    const { stripe, upgrade } = this.props
    const { token } = await stripe.createToken({ name: 'Name' })
    if (!token) {
      // do nothing
    } else {
      upgrade(token.id)
    }
  }

  onChange(params: ReactStripeElements.ElementChangeResponse) {
    console.log(params)
    this.setState({
      complete: params.complete,
      error: params.error && params.error.message
    })
  }

  public render() {
    const {
      handleSubmit,
      pristine,
      submitting,
      invalid,
      classes,
      isLoading,
    } = this.props
    const { complete } = this.state
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
        <form onSubmit={handleSubmit(this.submit)} style={{marginTop: 10}}>
          <SubmitButton
            invalid={!complete}
            pristine={false}
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
