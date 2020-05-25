import React, { FunctionComponent } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
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
import { Notification } from 'react-admin'

import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import AuthPage from './AuthPage'
import { renderInputField as renderInput } from './fieldComponents'
import ConnectedSuccessPage from './components/SuccessPage'
import { extractError } from './errorSagas'
import { crudUpdate } from './crudUpdate'

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
      width: '100%',
      marginTop: 20
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
          reject(new SubmissionError({ 
            _error: extractError(errors, ''),
            email: extractError(errors, 'email') 
          }))
        }
      )
    )
  })
}

const Form: FunctionComponent<Props & EnhancedProps> = ({
  error,
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
          {error && <FormHelperText error>{error}</FormHelperText>}
          <div className={classes.input}>
            <Field
              id="email"
              name="email"
              component={renderInput}
              label="Email"
              disabled={isLoading}
              fullWidth
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
    <AuthPage>
      <EnhancedForm location={location} email={email} />
      <Notification />
    </AuthPage>
  )
}

export default connect(null, {})(Page)
