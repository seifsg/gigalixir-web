// most of this is copied from ConfirmationResendPage. refactor
import FormHelperText from '@material-ui/core/FormHelperText'
import React, { FunctionComponent } from 'react'
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
import { renderTextField } from './fieldComponents'
import AuthPage from './AuthPage'
import { extractError, extractErrorValue } from './errorSagas'
import { crudCreate } from './crudCreate'

// eslint-disable-next-line @typescript-eslint/no-empty-interface
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
      width: '100%',
      marginTop: 20
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

const action = (values: object, dispatch: Function) => {
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
        params => {
          const {
            payload: { errors }
          } = params
          reject(
            new SubmissionError({
              _error: extractErrorValue(errors, ''),
              email: extractError(errors, 'email')
            })
          )
        }
      )
    )
  })
}

const renderEmail = renderTextField({ type: 'input' })
const Form: FunctionComponent<Props & EnhancedProps> = props => {
  const { error, classes, isLoading, handleSubmit } = props
  return (
    <form onSubmit={handleSubmit(action)}>
      <div className={classes.form}>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <div className={classes.input}>
          <Field
            id="email"
            name="email"
            component={renderEmail}
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
          Reset Password
        </Button>
      </div>
    </form>
  )
}

const mapStateToProps = (state: ReduxState) => {
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

const Page = () => {
  return (
    <AuthPage>
      <EnhancedForm />
      <Notification />
    </AuthPage>
  )
}

// todo: what does this do?
export default connect(null, {})(Page)
