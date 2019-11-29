// most of this is copied from ConfirmationResendPage. refactor
import qs from 'query-string'
import { showNotification } from 'react-admin'
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
import { Notification} from 'react-admin'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'
import { crudUpdate } from './crudUpdate'

interface Props {
  search: string
}

interface FormData {
  token: string,
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
      // marginRight: spacing.unit
      marginRight: spacing(1)
    }
  })

interface EnhancedProps
  extends TranslationContextProps,
    InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  isLoading: boolean
}

const action = (search: string) => (values: any, dispatch: any, { redirectTo }: any) => {
  const params = qs.parse(search)
  console.log(JSON.stringify(params))
  if (typeof params.token === 'string') {
    let token = params.token
    console.log(token)
    return dispatch(crudUpdate('password', 'set', { token, ...values}, {}, '/', 'Password changed', false))
    } else {
    return dispatch(showNotification('Token missing'))
  }
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
  translate,
  search
}) => (
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
        type="submit"
      >
      Set Password
      </Button>
    </div>
  </form>
)

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
      const errors = { newPassword: ''}
      const { translate } = props
      if (!values.newPassword) {
        errors.newPassword = translate('ra.validation.required')
      }
      return errors
    }
  })
)(Form)

const Page = (props: {
  location: {search: string}
}) => {
const { location: { search } } = props
console.log('search')
console.log(search)
  return (<div>
  <EnhancedForm search={ search }/>
          <Notification />
  </div>)
}

export default connect(
  null,
  {
  }
)(Page)
