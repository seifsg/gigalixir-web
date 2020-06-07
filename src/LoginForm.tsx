// copy and pasted. I don't wanna go through and fix their
// typescript and lint errors right now..
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme
} from '@material-ui/core/styles'
import {
  userLogin,
  withTranslate,
  TranslationContextProps,
  ReduxState,
  I18nProvider
} from 'ra-core'
import { useTranslate } from 'react-admin'
import { renderInputField as renderInput } from './fieldComponents'

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
      marginRight: spacing()
    }
  })

interface EnhancedProps
  extends TranslationContextProps,
    InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  isLoading: boolean
}

const login = (auth: any, dispatch: any, { redirectTo }: any) =>
  dispatch(userLogin(auth, redirectTo))

const LoginForm: FunctionComponent<Props & EnhancedProps> = ({
  classes,
  isLoading,
  handleSubmit
}) => {
  const translate = useTranslate()
  return (
    <form onSubmit={handleSubmit(login)}>
      <div className={classes.form}>
        <div className={classes.input}>
          <Field
            id="email"
            name="email"
            component={renderInput}
            fullWidth
            label="Email"
            disabled={isLoading}
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
            disabled={isLoading}
            autoComplete="current-password"
          />
        </div>
      </div>
      <CardActions>
        <Button
          variant="contained"
          type="submit"
          color="primary"
          disabled={isLoading}
          className={classes.button}
        >
          {isLoading && (
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
}
const mapStateToProps = (state: ReduxState) => ({
  isLoading: state.admin.loading > 0
})

const enhance = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps),
  reduxForm({
    form: 'signIn',
    validate: (values: FormData, props: I18nProvider) => {
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

export default EnhancedLoginForm
