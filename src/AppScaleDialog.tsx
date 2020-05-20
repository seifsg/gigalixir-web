import React, { FunctionComponent } from 'react'

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
import { App } from './api/apps'
import { crudUpdate } from './crudUpdate'
import { CloseFunction } from './DialogButton'
import { isNumber, minValue, maxValue, required } from './validators'
import { extractError } from './errorSagas'
import { SuccessCallback, FailureCallback } from './callbacks'
import { renderTextField, renderError } from './fieldComponents'
import SubmitButton from './SubmitButton'

const validateSize = [
  required(),
  isNumber(),
  minValue(0.2, 'Must be at least 0.2'),
  maxValue(16, 'Please contact enterprise@gigalixir.com to scale above 16.')
]
const validateReplicas = [
  isNumber(),
  minValue(0, 'Must be non-negative'),
  maxValue(16, 'Please contact enterprise@gigalixir.com to scale above 16.')
]

const renderSizeField = renderTextField({ type: 'input' })
const renderReplicasField = renderTextField({ type: 'number' })

interface ScaleProps {
  close: CloseFunction
  app: App
}
interface FormData {
  size: string
  replicas: string
}
interface EnhancedScaleProps extends InjectedFormProps<FormData> {
  scale: (
    values: App,
    previous: App,
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}
const AppScale: FunctionComponent<ScaleProps & EnhancedScaleProps> = props => {
  const {
    submitting,
    pristine,
    invalid,
    close,
    app,
    scale,
    handleSubmit
  } = props
  const onCancel = () => {
    close()
  }
  const onSubmit = ({ size, replicas }: FormData) => {
    // Do we need to do something like this instead?
    // handleBlur = event => {
    /**
     * Necessary because of a React bug on <input type="number">
     * @see https://github.com/facebook/react/issues/1425
     */
    // const numericValue = isNaN(parseFloat(event.target.value))
    //     ? null
    //     : parseFloat(event.target.value);
    // this.props.onBlur(numericValue);
    // this.props.input.onBlur(numericValue);
    // };

    const newApp = {
      ...app,
      size: size ? parseFloat(size) : app.size,
      replicas: replicas ? parseInt(replicas) : app.replicas
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        reject(
          new SubmissionError({
            form: extractError(errors, ''),
            size: extractError(errors, 'size'),
            replicas: extractError(errors, 'replicas')
          })
        )
      }
      scale(
        newApp,
        app,
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
      <DialogTitle id="form-dialog-title">Scale</DialogTitle>
      <FormField name="form" component={renderError} />
      <DialogContent>
        <FormField
          validate={validateSize}
          component={renderSizeField}
          name="size"
          label="Size"
        />
      </DialogContent>
      <DialogContent>
        <FormField
          validate={validateReplicas}
          component={renderReplicasField}
          name="replicas"
          label="Replicas"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <SubmitButton {...{ invalid, pristine, submitting }} label="Scale" />
      </DialogActions>
    </form>
  )
}

const scaleApp_ = (
  values: App,
  previousValues: App,
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
) => {
  const basePath = ''
  const redirectTo = ''
  // this needs to be refresh=true in this case because otherwise, the app data in the redux store gets wiped out.
  // here is what happens
  // 1. fetch.ts calls the dataProvider
  // 2. fetch.ts uses the result of the dataProvider and sends a CRUD_UPDATE_SUCCESS action with the response
  // 3. the problem is the response isn't a full App, it's just the new size and replicas
  // 4. reducers/data.ts processes this and replaces what is in the store rather than merging the updated fields
  //
  // refresh here tells somenoe to refetch the App to get the new values so everything is right again.
  // TODO: change scale endpoint to return a full app
  const refresh = true
  return crudUpdate(
    'apps',
    values.id,
    values,
    previousValues,
    basePath,
    redirectTo,
    refresh,
    successCallback,
    failureCallback
  )
}

const EnhancedAppScale = compose<ScaleProps & EnhancedScaleProps, ScaleProps>(
  connect(
    (state, ownProps: ScaleProps) => ({
      initialValues: {
        size: `${ownProps.app.size}`,
        replicas: `${ownProps.app.replicas}`
      }
    }),
    {
      scale: scaleApp_
    }
  ),
  reduxForm({
    form: 'scaleApp'
  })
)(AppScale)

export default EnhancedAppScale
