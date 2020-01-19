// copy and pasted. I don't wanna go through and fix their
// typescript and lint errors right now..
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React, { SFC } from 'react'
import { Login } from 'react-admin'

import PropTypes from 'prop-types'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import {
  withTranslate,
  userLogin,
  TranslationContextProps,
  ReduxState
} from 'ra-core'

interface Props {
  redirectTo?: string
}

interface FormData {
  email: string
  password: string
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

// see http://redux-form.com/6.4.3/examples/material-ui/
const renderInput = ({
  meta: { touched, error } = { touched: false, error: '' }, // eslint-disable-line react/prop-types
  input: { ...inputProps }, // eslint-disable-line react/prop-types
  ...props
}) => {
  return (
    <TextField
      error={!!(touched && error)}
      helperText={touched && error}
      {...inputProps}
      {...props}
      fullWidth
    />
  )
}
const login = (auth: any, dispatch: any, { redirectTo }: any) =>
  dispatch(userLogin(auth, redirectTo))

const LoginForm: SFC<Props & EnhancedProps> = ({
  classes,
  isLoading,
  handleSubmit,
  translate
}) => (
  <form onSubmit={handleSubmit(login)}>
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
      <div className={classes.input}>
        <Field
          id="password"
          name="password"
          component={renderInput}
          label={translate('ra.auth.password')}
          type="password"
          disabled={isLoading}
          autoComplete="current-password"
        />
      </div>
    </div>
    <CardActions>
      <Button
        variant="raised"
        type="submit"
        color="primary"
        disabled={isLoading}
        className={classes.button}
      >
        {isLoading && (
          <CircularProgress className={classes.icon} size={18} thickness={2} />
        )}
        {translate('ra.auth.sign_in')}
      </Button>
    </CardActions>
  </form>
)

const mapStateToProps = (state: ReduxState) => ({
  isLoading: state.admin.loading > 0
})

const enhance = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps),
  reduxForm({
    form: 'signIn',
    validate: (values: FormData, props: TranslationContextProps) => {
      const errors = { email: '', password: '' }
      const { translate } = props
      if (!values.email) {
        errors.email = translate('ra.validation.required')
      }
      if (!values.password) {
        errors.password = translate('ra.validation.required')
      }
      return errors
    }
  })
)

const EnhancedLoginForm = enhance(LoginForm)

EnhancedLoginForm.propTypes = {
  redirectTo: PropTypes.string
}

const MyLoginPage = () => (
  <Login loginForm={<EnhancedLoginForm />} backgroundImage="" />
)

export default MyLoginPage
