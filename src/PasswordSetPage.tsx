// most of this is copied from ConfirmationResendPage. refactor
import FormHelperText from '@material-ui/core/FormHelperText'
import qs from 'query-string'
import { showNotification, Notification } from 'react-admin'
import React, { FunctionComponent } from 'react'
import { withTranslate, TranslationContextProps, ReduxState } from 'ra-core'
import compose from 'recompose/compose'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'

import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from 'redux-form'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { renderInputField as renderInput, renderError } from './fieldComponents'
import AuthPage from './AuthPage'

import { extractError } from './errorSagas'
import { crudUpdate } from './crudUpdate'

interface Props {
  search: string
}

interface FormData {
  token: string
  newPassword: string
}

// TODO: pull this stuff out. it's duplicated in
// PasswordSetPage
// PasswordResetPage
// ConfirmationResendPage
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
    }
  })

interface EnhancedProps
  extends TranslationContextProps,
    InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  isLoading: boolean
}

const action = (search: string) => (values: object, dispatch: Function) => {
  const params = qs.parse(search)
  if (typeof params.token === 'string') {
    const { token } = params
    return new Promise((resolve, reject) => {
      dispatch(
        crudUpdate(
          'password',
          'set',
          { token, ...values },
          {},
          '/',
          '/apps',
          false,
          () => {
            dispatch(showNotification('Password changed'))
            resolve()
          },
          ({ payload: { errors } }) => {
            reject(
              new SubmissionError({
                _error: extractError(errors, ''),
                token: extractError(errors, 'token'),
                newPassword: extractError(errors, 'password')
              })
            )
          }
        )
      )
    })
  }
  // dispatch(showNotification('Token missing'))
  return Promise.reject(new SubmissionError({ _error: 'Token is missing' }))
}

const Form: FunctionComponent<Props & EnhancedProps> = props => {
  const { error, classes, isLoading, handleSubmit, search } = props
  return (
    <form onSubmit={handleSubmit(action(search))}>
      <div className={classes.form}>
        {error && <FormHelperText error>{error}</FormHelperText>}
        <Field name="token" component={renderError} style={{ marginTop: 20 }} />
        <div className={classes.input}>
          <Field
            autoFocus
            id="newPassword"
            name="newPassword"
            component={renderInput}
            fullWidth
            label="New Password"
            type="password"
            disabled={isLoading}
          />
        </div>
        <Button
          variant="raised"
          color="primary"
          disabled={isLoading}
          type="submit"
          className={classes.button}
        >
          Set Password
        </Button>
      </div>
    </form>
  )
}

const mapStateToProps = (state: ReduxState) => ({
  isLoading: state.admin.loading > 0
})
const EnhancedForm = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps),
  reduxForm({
    form: 'setPassword',
    validate: (values: FormData, props: TranslationContextProps) => {
      const errors = { newPassword: '' }
      const { translate } = props
      if (!values.newPassword) {
        errors.newPassword = translate('ra.validation.required')
      }
      return errors
    }
  })
)(Form)

const Page = (props: { location: { search: string } }) => {
  const {
    location: { search }
  } = props
  return (
    <AuthPage>
      <EnhancedForm search={search} />
      <Notification />
    </AuthPage>
  )
}

export default connect(null, {})(Page)
