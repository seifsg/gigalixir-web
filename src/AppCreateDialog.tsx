import React, { FunctionComponent } from 'react'
import FormControlLabel from '@material-ui/core/FormControlLabel'

import FormLabel from '@material-ui/core/FormLabel'

import Radio from '@material-ui/core/Radio'
import { connect } from 'react-redux'
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
import { CloseFunction } from './DialogButton'
import { required, choices } from './validators'
import { extractError } from './errorSagas'
import { crudCreate } from './crudCreate'
import { SuccessCallback, FailureCallback } from './callbacks'
import { Cloud, Region } from './api/apps'
import {
  renderRadioGroup,
  renderTextField,
  renderError
} from './fieldComponents'

const renderNameField = renderTextField({ type: 'input' })
const renderCloudRegionField = renderRadioGroup

const validateName = [required()]
const validateCloudRegion = [
  required(),
  choices(
    ['v2018-us-central1', 'europe-west1', 'us-east-1', 'us-west-2'],
    'Must be v2018-us-central1 or europe-west1 or us-east-1 or us-west-2'
  )
]

interface CreateProps {
  close: CloseFunction
}
interface FormData {
  name: string
  cloudRegion: string
}
interface EnhancedCreateProps extends InjectedFormProps<FormData> {
  create: (
    values: { name: string, cloud: Cloud, region: Region },
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
  const onSubmit = ({ name, cloudRegion }: FormData) => {
    let cloud: Cloud = 'gcp'
    let region: Region = 'v2018-us-central1'
    if (cloudRegion === 'us-east-1' || cloudRegion === 'us-west-2') {
      cloud = 'aws'
      region = cloudRegion
    } else if (cloudRegion === 'europe-west1' || cloudRegion === 'v2018-us-central1') {
      cloud = 'gcp'
      region = cloudRegion
    } else {
      // this should never happen
    }
    const newApp = {
      name,
      cloud,
      region
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        const formErrors = {
          ...errors,
          name: errors['unique_name'],
        }
        reject(
          new SubmissionError({
            form: extractError(formErrors, ''),
            name: extractError(formErrors, 'name'),
            cloudRegion: extractError(formErrors, 'cloud') || extractError(formErrors, 'region'),
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
          validate={validateCloudRegion}
          component={renderCloudRegionField}
          name="cloudRegion"
        >

          <FormControlLabel
            control={<Radio />}
            value="v2018-us-central1"
            label="v2018-us-central1"
          />
          <FormControlLabel
            control={<Radio />}
            value="europe-west1"
            label="europe-west1"
          />
          <FormControlLabel
            control={<Radio />}
            value="us-west-2"
            label="us-west-2"
          />
          <FormControlLabel
            control={<Radio />}
            value="us-east-1"
            label="us-east-1"
          />
        </FormField>
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
  values: { name: string, cloud: Cloud, region: Region },
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
        cloudRegion: 'v2018-us-central1'
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
