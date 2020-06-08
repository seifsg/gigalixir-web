import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormHelperText from '@material-ui/core/FormHelperText'
import { FORM_ERROR } from 'final-form'
import { useMutation, useNotify, useRefresh } from 'ra-core'
import React, { FunctionComponent } from 'react'
import { Field, Form } from 'react-final-form'
import { CloseFunction } from './DialogButton'
import { extractError } from './errorSagas'
import { renderTextField } from './fieldComponents'
import SubmitButton from './SubmitButton'
import { required } from './validators'

const validateEmail = required()
const renderEmailField = renderTextField({ type: 'input' })

interface Props {
  close: CloseFunction
  id: string // app id
}
interface FormData {
  email: string
}
const CollaboratorAdd: FunctionComponent<Props> = props => {
  const { close, id } = props
  const [mutate] = useMutation()
  const notify = useNotify()
  const refresh = useRefresh()

  const onCancel = () => {
    close()
  }
  const submit = ({ email }: FormData) => {
    return new Promise(resolve => {
      mutate(
        {
          type: 'create',
          resource: 'permissions',
          payload: {
            data: { id, email }
          }
        },
        {
          onSuccess: () => {
            notify('Collaborator added')
            close()
            resolve()
            refresh()
          },
          onFailure: ({ body: { errors } }) => {
            resolve({
              [FORM_ERROR]: extractError(errors, ''),
              email: extractError(errors, 'email')
            })
          }
        }
      )
    })
  }

  return (
    <Form
      onSubmit={submit}
      render={({
        handleSubmit,
        error,
        submitting,
        pristine,
        hasValidationErrors,
        hasSubmitErrors,
        modifiedSinceLastSubmit
      }) => {
        return (
          <form onSubmit={handleSubmit}>
            <DialogTitle id="form-dialog-title">Add Collaborator</DialogTitle>
            {error && (
              <DialogContent>
                <FormHelperText error>{error}</FormHelperText>
              </DialogContent>
            )}
            <DialogContent>
              <Field
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
              <SubmitButton
                {...{
                  invalid:
                    hasValidationErrors ||
                    (hasSubmitErrors && !modifiedSinceLastSubmit),
                  pristine,
                  submitting
                }}
                label="Add"
              />
            </DialogActions>
          </form>
        )
      }}
    />
  )
}

export default CollaboratorAdd
