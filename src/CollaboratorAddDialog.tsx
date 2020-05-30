import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormHelperText from '@material-ui/core/FormHelperText'
import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import {
  Field as FormField,
  InjectedFormProps,
  reduxForm,
  SubmissionError
} from 'redux-form'
import { FailureCallback, SuccessCallback } from './callbacks'
import { crudCreate } from './crudCreate'
import { CloseFunction } from './DialogButton'
import { extractError } from './errorSagas'
import { renderTextField } from './fieldComponents'
import SubmitButton from './SubmitButton'
import { required } from './validators'

const validateEmail = [required()]
const renderEmailField = renderTextField({ type: 'input' })

interface Props {
  close: CloseFunction
  id: string // app id
}
interface FormData {
  email: string
}
interface EnhancedProps extends InjectedFormProps<FormData> {
  addCollaborator: (
    values: { id: string; email: string },
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}
const CollaboratorAdd: FunctionComponent<Props & EnhancedProps> = props => {
  const {
    error,
    submitting,
    pristine,
    invalid,
    close,
    id,
    addCollaborator,
    handleSubmit
  } = props
  const onCancel = () => {
    close()
  }
  const onSubmit = ({ email }: FormData) => {
    const values = {
      id,
      email
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        reject(
          new SubmissionError({
            _error: extractError(errors, ''),
            email: extractError(errors, 'email')
          })
        )
      }
      addCollaborator(
        values,
        () => {
          close()
          resolve()
        },
        failureCallback
      )
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle id="form-dialog-title">Add Collaborator</DialogTitle>
      {error && (
        <DialogContent>
          <FormHelperText error>{error}</FormHelperText>
        </DialogContent>
      )}
      <DialogContent>
        <FormField
          validate={validateEmail}
          component={renderEmailField}
          name="email"
          label="Email"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <SubmitButton {...{ invalid, pristine, submitting }} label="Add" />
      </DialogActions>
    </form>
  )
}

const EnhancedCollaboratorAdd = compose<Props & EnhancedProps, Props>(
  connect(null, {
    addCollaborator: (
      values: { id: string; email: string }, // email
      successCallback: SuccessCallback,
      failureCallback: FailureCallback
    ) => {
      const basePath = ''
      const redirectTo = ''
      const refresh = true
      return crudCreate(
        'permissions',
        values,
        basePath,
        redirectTo,
        refresh,
        successCallback,
        failureCallback
      )
    }
  }),
  reduxForm({
    form: 'scaleApp'
  })
)(CollaboratorAdd)

export default EnhancedCollaboratorAdd
