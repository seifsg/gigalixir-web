import React, { SFC } from 'react'
import qs from 'query-string'
import {
  SubmissionError,
  Field,
  reduxForm,
  InjectedFormProps
} from 'redux-form'
import { withTranslate, TranslationContextProps, ReduxState } from 'ra-core'
import compose from 'recompose/compose'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import { Notification } from 'react-admin'

import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import ConnectedSuccessPage from '../../components/SuccessPage'
import { extractError } from '../../errorSagas'
import { crudUpdate } from '../../crudUpdate'

interface Props {
  location: { search: string }
  email: string | undefined
}

interface FormData {
  email: string
}

const styles = ({ spacing }: Theme) =>
  createStyles({
    form: {
      padding: '0 1em 1em 1em'
    },
    input: {
      marginTop: '1em'
    },
    button: {
      width: '100%'
    },
    icon: {
      arginRight: spacing.unit
    }
  })

interface EnhancedProps
  extends TranslationContextProps,
    InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  isLoading: boolean
}

const action = (values: {}, dispatch: Function) => {
  const msg = 'Confirmation email resent. Please check your email.'
  return new Promise((resolve, reject) => {
    dispatch(
      crudUpdate(
        'confirmation',
        'resend',
        values,
        {},
        '/',
        `/success?msg=${encodeURIComponent(msg)}`,
        false,
        resolve,
        ({ payload: { errors } }) => {
          reject(new SubmissionError({ email: extractError(errors, 'email') }))
        }
      )
    )
  })
}

// duplicated in RegisterForm
// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({
  meta: { touched, error } = { touched: false, error: '' }, // eslint-disable-line react/prop-types
  input: { ...inputProps }, // eslint-disable-line react/prop-types
  ...props
}) => (
  <TextField
    error={!!(touched && error)}
    helperText={touched && error}
    {...inputProps}
    {...props}
    fullWidth
  />
)

const Form: SFC<Props & EnhancedProps> = ({
  location,
  classes,
  isLoading,
  handleSubmit
  // submitSucceeded,
}) => {
  // if (submitSucceeded) {
  //   return <div>Confirmation email resent. Please check your email.</div>
  // } else {
  return (
    <div>
      <ConnectedSuccessPage location={location} />
      <form onSubmit={handleSubmit(action)}>
        <div className={classes.form}>
          <div className={classes.input}>
            <Field
              autoFocus
              id="email"
              name="email"
              component={renderInput}
              label="Email"
              disabled={isLoading}
            />
          </div>
          <Button
            variant="raised"
            type="submit"
            color="primary"
            disabled={isLoading}
            className={classes.button}
          >
            Resend Confirmation
          </Button>
        </div>
      </form>
    </div>
  )
}
// }

const mapStateToProps = (state: ReduxState, props: Props) => ({
  isLoading: state.admin.loading > 0,
  initialValues: {
    email: props.email
  }
})
const EnhancedForm = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps),
  reduxForm({
    form: 'resendConfirmation',
    validate: (values: FormData, props: TranslationContextProps) => {
      const errors = { email: '', password: '' }
      const { translate } = props
      if (!values.email) {
        errors.email = translate('ra.validation.required')
      }
      return errors
    }
  })
)(Form)

const Page = (props: { location: { search: string } }) => {
  const { location } = props
  const params = qs.parse(location.search)
  let email
  if (typeof params.email === 'string') {
    email = params.email
  }
  return (
    <div>
      <EnhancedForm location={location} email={email} />
      <Notification />
    </div>
  )
}

export default connect(null, {})(Page)
