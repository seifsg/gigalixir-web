// copy and pasted. I don't wanna go through and fix their
// typescript and lint errors right now..
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import PropTypes from 'prop-types'
import { Form, Field } from 'react-final-form'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import CardActions from '@material-ui/core/CardActions'
import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import {
  withStyles,
  createStyles,
  WithStyles,
  Theme,
} from '@material-ui/core/styles'
import {
  userLogin as userLoginRa,
  withTranslate,
  TranslationContextProps,
  ReduxState,
  I18nProvider,
} from 'ra-core'
import { useTranslate } from 'react-admin'
import { renderInputField as renderInput } from './fieldComponents'
import logger from './logger'

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

interface EnhancedProps extends I18nProvider, WithStyles<typeof styles> {
  isLoading: boolean
}

const LoginForm: FunctionComponent<Props & EnhancedProps> = ({
  classes,
  isLoading,
  userLogin,
  redirectTo
}) => {
  const translate = useTranslate()
  return (
    <Form
      onSubmit={(values: FormData) => {
        logger.debug(`submitting ${JSON.stringify(values)}`)
        userLogin(values, redirectTo)
      }}
      validate={(values: FormData) => {
        logger.debug('validating')
        const errors: { email?: string; password?: string } = {}
        if (!values.email) {
          errors.email = 'Required'
        }
        if (!values.password) {
          errors.password = 'Required'
        }
        return errors
      }}
    >
      {({ handleSubmit }) => {
        return (
          <form onSubmit={handleSubmit}>
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
      }}
    </Form>
  )
}
const mapStateToProps = (state: ReduxState) => ({
  isLoading: state.admin.loading > 0,
})

const enhance = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  withTranslate,
  connect(mapStateToProps, {
    userLogin: userLoginRa
  })
)

const EnhancedLoginForm = enhance(LoginForm)

EnhancedLoginForm.propTypes = {
  redirectTo: PropTypes.string,
}

export default EnhancedLoginForm
