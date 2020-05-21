import React, { FunctionComponent } from 'react'
import MenuItem from '@material-ui/core/MenuItem'
import ListSubheader from '@material-ui/core/ListSubheader'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import {
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
import { renderSelect, renderTextField, renderError } from './fieldComponents'
import SubmitButton from './SubmitButton'

const renderNameField = renderTextField({ type: 'input' })
const renderCloudRegionField = renderSelect

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
const styles = createStyles({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
})
interface EnhancedCreateProps
  extends InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  create: (
    values: { name: string; cloud: Cloud; region: Region },
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}
const AppCreate: FunctionComponent<CreateProps &
  EnhancedCreateProps> = props => {
  const { submitting, pristine, invalid, close, create, handleSubmit } = props
  const onCancel = () => {
    close()
  }
  const onSubmit = ({ name, cloudRegion }: FormData) => {
    let cloud: Cloud = 'gcp'
    let region: Region = 'v2018-us-central1'
    if (cloudRegion === 'us-east-1' || cloudRegion === 'us-west-2') {
      cloud = 'aws'
      region = cloudRegion
    } else if (
      cloudRegion === 'europe-west1' ||
      cloudRegion === 'v2018-us-central1'
    ) {
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
          name: errors.unique_name
        }
        reject(
          new SubmissionError({
            form: extractError(formErrors, ''),
            name: extractError(formErrors, 'name'),
            cloudRegion:
              extractError(formErrors, 'cloud') ||
              extractError(formErrors, 'region')
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
          label="App Name"
        />
      </DialogContent>
      <DialogContent>
        <FormField
          validate={validateCloudRegion}
          component={renderCloudRegionField}
          name="cloudRegion"
          label="Region"
        >
          <ListSubheader>Google Cloud</ListSubheader>
          <MenuItem value="v2018-us-central1">v2018-us-central1</MenuItem>
          <MenuItem value="europe-west1">europe-west1</MenuItem>
          <ListSubheader>Amazon Web Services</ListSubheader>
          <MenuItem value="us-east-1">us-east-1</MenuItem>
          <MenuItem value="us-west-2">us-west-2</MenuItem>
        </FormField>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <SubmitButton {...{ invalid, pristine, submitting }} label="Create" />
      </DialogActions>
    </form>
  )
}

const createApp_ = (
  values: { name: string; cloud: Cloud; region: Region },
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
) => {
  const basePath = ''
  const redirectTo = ''

  // needed because the create endpoint doesn't return a full app e.g. stack
  const refresh = true
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
  withStyles(styles),
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
