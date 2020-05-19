import React, { FunctionComponent } from 'react'
import { connect } from 'react-redux'
import { CloseFunction } from './DialogButton'
import compose from 'recompose/compose'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {
  WrappedFieldProps,
  reduxForm,
  Field as FormField,
  InjectedFormProps,
  SubmissionError
} from 'redux-form'
import { required, choices } from './validators'
import { extractError } from './errorSagas'
import { crudCreate } from './crudCreate'
import { SuccessCallback, FailureCallback } from './callbacks'
import { Cloud, Region } from './api/apps'
import { renderTextField, renderError } from './fieldComponents'

const renderNameField = renderTextField({ type: 'input' })
// change these to segmented buttons?
const renderCloudField = renderTextField({ type: 'input' })
const renderRegionField = renderTextField({ type: 'input' })

const validateName = [required()]
const validateCloud = [required(), choices(['aws', 'gcp'], 'Must be aws or gcp')]

const validateRegion = [
  required(),
  choices(['v2018-us-central1', 'europe-west1', 'us-east-1', 'us-west-2'], 'Must be v2018-us-central1 or europe-west1 or us-east-1 or us-west-2')
]

interface CreateProps {
  close: CloseFunction
}
interface FormData {
  name: string
  cloud: string
  region: string
}
interface EnhancedCreateProps extends InjectedFormProps<FormData> {
  create: (
    values: FormData,
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}
const AppCreate: FunctionComponent<CreateProps &
  EnhancedCreateProps> = props => {
  const { pristine, invalid, close, create, handleSubmit } = props
  const onCancel = () => {
    close()
  }
  const onSubmit = ({ name, cloud, region }: FormData) => {
    const newApp = {
      name,
      cloud,
      region
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        reject(
          new SubmissionError({
            form: extractError(errors, ''),
            name: extractError(errors, 'name'),
            cloud: extractError(errors, 'cloud'),
            region: extractError(errors, 'region')
          })
        )
      }
      create(
        newApp,
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
      <DialogTitle id="form-dialog-title">Create App</DialogTitle>
      <FormField name="form" component={renderError} />
      <DialogContent>
        <FormField
          validate={validateName}
          component={renderNameField}
          name="name"
          label="Name"
        />
      </DialogContent>
      <DialogContent>
        <FormField
          validate={validateCloud}
          component={renderCloudField}
          name="cloud"
          label="Cloud"
        />
      </DialogContent>
      <DialogContent>
        <FormField
          validate={validateRegion}
          component={renderRegionField}
          name="region"
          label="Region"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button type="submit" disabled={invalid || pristine} color="primary">
          Create
        </Button>
      </DialogActions>
    </form>
  )
}

const createApp_ = (
  values: FormData,
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
) => {
  const basePath = ''
  const redirectTo = ''
  const refresh = false
  return crudCreate(
    'apps',
    values,
    basePath,
    redirectTo,
    refresh,
    successCallback,
    failureCallback
  )
}

const EnhancedAppCreate = compose<
  CreateProps & EnhancedCreateProps,
  CreateProps
>(
  connect(
    (state, ownProps: CreateProps) => ({
      initialValues: {
        // cloud: 'gcp',
        // region: 'v2018-us-central1'
      }
    }),
    {
      create: createApp_
    }
  ),
  reduxForm({
    form: 'createApp'
  })
)(AppCreate)

export default EnhancedAppCreate
