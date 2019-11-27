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
import { Notification, CRUD_UPDATE, UPDATE} from 'react-admin'
import { Identifier, RedirectionSideEffect, NotificationSideEffect, RefreshSideEffect} from 'ra-core'
import { Field, reduxForm, InjectedFormProps } from 'redux-form'
import Button from '@material-ui/core/Button'
import { connect } from 'react-redux'

interface Props {
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

interface RequestPayload {
    id: Identifier;
    data: any;
    previousData?: any;
}

export interface CrudUpdateAction {
    readonly type: typeof CRUD_UPDATE;
    readonly payload: RequestPayload;
    readonly meta: {
        resource: string;
        fetch: typeof UPDATE;
        onSuccess: {
            notification: NotificationSideEffect;
            redirectTo: RedirectionSideEffect;
            refresh: RefreshSideEffect;
            basePath: string;
        };
        onFailure: {
            notification?: NotificationSideEffect;
        };
    };
}


export const crudUpdate = (
    resource: string,
    id: Identifier,
    data: any,
    previousData: any,
    basePath: string,
    successNotification: string,
    redirectTo: RedirectionSideEffect = 'show',
    refresh: RefreshSideEffect = true
): CrudUpdateAction => ({
    type: CRUD_UPDATE,
    payload: { id, data, previousData },
    meta: {
        resource,
        fetch: UPDATE,
        onSuccess: {
            notification: {
                body: successNotification,
                level: 'info',
                messageArgs: {
                    smart_count: 1,
                },
            },
            refresh,
            redirectTo,
            basePath,
        },
        onFailure: {
            /* notification: { */
            /*     body: 'ra.notification.http_error', */
            /*     level: 'warning', */
            /* }, */
        },
    },
});

const action = (values: any, dispatch: any, { redirectTo }: any) => {
  return dispatch(crudUpdate('confirmation', 'resend', values, {}, '/', 'Confirmation Email Sent. Please check your email.', false))
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
}) => (
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
        type="submit"
      >
      Resend
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

const Page = (props: {
}) => {
  return (<div>
  <EnhancedForm/>
          <Notification />
  </div>)
}

export default connect(
  null,
  {
  }
)(Page)
