// most of this is copied from ConfirmationResendPage. refactor
import React, { SFC } from 'react'
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
import { extractError } from './errorSagas'
import { crudCreate } from './crudCreate'

interface Props {}

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
      marginRight: spacing.unit
      // marginRight: spacing(1)
    }
  })

interface EnhancedProps
  extends TranslationContextProps,
    InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  isLoading: boolean
}

const action = (values: any, dispatch: any, { redirectTo }: any) => {
  const msg = 'Reset password email sent. Please check your email.'
  return new Promise((resolve, reject) => {
    dispatch(
      crudCreate(
        'password',
        values,
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
  classes,
  isLoading,
  handleSubmit,
  translate
}) => {
  return (
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
          Reset Password
        </Button>
      </div>
    </form>
  )
}

const mapStateToProps = (state: ReduxState) => {
  console.log(JSON.stringify(state))
  return {
    isLoading: state.admin.loading > 0
  }
}
const EnhancedForm = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps),
  reduxForm({
    form: 'resetPassword',
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

const Page = (props: {}) => {
  return (
    <div>
      <EnhancedForm />
      <Notification />
    </div>
  )
}

// todo: what does this do?
export default connect(
  null,
  {}
)(Page)
