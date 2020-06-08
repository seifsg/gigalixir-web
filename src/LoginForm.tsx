// copy and pasted. I don't wanna go through and fix their
// typescript and lint errors right now..
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FunctionComponent } from 'react'
import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme } from '@material-ui/core/styles'
import {
  useLogin,
  useNotify,
  useSafeSetState,
  useTranslate,
  ReduxState
} from 'ra-core'
import { renderInputField as renderInput } from './fieldComponents'
import logger from './logger'
import { extractEmailError, extractError } from './errorSagas'

interface Props {
  redirectTo?: string
}

interface FormData {
  email: string
  password: string
}

const useStyles = makeStyles(
  (theme: Theme) => ({
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
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'LoginForm' }
)

interface EnhancedProps {
  loading: boolean
}

const LoginForm: FunctionComponent<Props & EnhancedProps> = props => {
  const { redirectTo } = props
  const [loading, setLoading] = useSafeSetState<boolean>(false)
  const login = useLogin()
  const notify = useNotify()
  const translate = useTranslate()
  const classes = useStyles(props)
  const validate = (values: FormData) => {
    const errors: { email?: string; password?: string } = {
      email: undefined,
      password: undefined
    }

    if (!values.email) {
      errors.email = translate('ra.validation.required')
    }
    if (!values.password) {
      errors.password = translate('ra.validation.required')
    }
    return errors
  }

  const submit = (values: FormData) => {
    setLoading(true)
    return login(values, redirectTo)
      .then(() => {
        setLoading(false)
      })
      .catch(error => {
        logger.debug(`login error: ${typeof error}: ${JSON.stringify(error)}`)
        setLoading(false)
        notify(
          typeof error === 'string'
            ? error
            : typeof error === 'undefined' || !error.message
            ? 'ra.auth.sign_in_error'
            : error.message,
          'warning'
        )
        return {
          email: extractEmailError(error.body.errors),
          password: extractError(error.body.errors, 'password')
        }
      })
  }

  return (
    <Form
      onSubmit={submit}
      validate={validate}
      render={({ handleSubmit, submitError }) => {
        logger.debug(`login submitError: ${submitError}`)
        return (
          <form onSubmit={handleSubmit}>
            {submitError && <div className="error">{submitError}</div>}

            <div className={classes.form}>
              <div className={classes.input}>
                <Field
                  id="email"
                  name="email"
                  component={renderInput}
                  fullWidth
                  label="Email"
                  disabled={loading}
                />
              </div>
              <div className={classes.input}>
                <Field
                  id="password"
                  name="password"
                  component={renderInput}
                  fullWidth
                  label={translate('ra.auth.password')}
                  type="password"
                  disabled={loading}
                  autoComplete="current-password"
                />
              </div>
            </div>
            <CardActions>
              <Button
                variant="contained"
                type="submit"
                color="primary"
                disabled={loading}
                className={classes.button}
              >
                {loading && (
                  <CircularProgress
                    className={classes.icon}
                    size={18}
                    thickness={2}
                  />
                )}
                {translate('ra.auth.sign_in')}
              </Button>
            </CardActions>
          </form>
        )
      }}
    />
  )
}
const mapStateToProps = (state: ReduxState) => ({
  loading: state.admin.loading > 0
})

const enhance = compose<Props & EnhancedProps, Props>(
  connect(mapStateToProps, {})
)

const EnhancedLoginForm = enhance(LoginForm)

export default EnhancedLoginForm
