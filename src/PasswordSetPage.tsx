// most of this is copied from ConfirmationResendPage. refactor
import qs from 'query-string'
import { showNotification, Notification } from 'react-admin'
import React, { SFC } from 'react'
import { withTranslate, TranslationContextProps, ReduxState } from 'ra-core'
import compose from 'recompose/compose'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'

import {
  Field,
  reduxForm,
  InjectedFormProps,
  SubmissionError
} from 'redux-form'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { extractError } from './errorSagas'
import { crudUpdate } from './crudUpdate'

interface Props {
  search: string
}

interface FormData {
  token: string
  newPassword: string
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
                token: extractError(errors, 'token'),
                newPassword: extractError(errors, 'password')
              })
            )
          }
        )
      )
    })
  }
  dispatch(showNotification('Token missing'))
  return Promise.reject(new SubmissionError({ token: 'Token missing' }))
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
  search
}) => {
  return (
    <form onSubmit={handleSubmit(action(search))}>
      <div className={classes.form}>
        <div className={classes.input}>
          <Field
            autoFocus
            id="newPassword"
            name="newPassword"
            component={renderInput}
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
    <div>
      <EnhancedForm search={search} />
      <Notification />
    </div>
  )
}

export default connect(null, {})(Page)
