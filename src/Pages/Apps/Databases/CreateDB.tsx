import React from 'react'

import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { reduxForm, InjectedFormProps, SubmissionError } from 'redux-form'
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl
} from '@material-ui/core'
import { Slider } from 'antd'
import css from './Slider.module.css' 
import { CloseFunction } from '../../../DialogButton'
// import { required, choices } from '../../../validators'
import { extractError } from '../../../errorSagas'
import { crudCreate } from '../../../crudCreate'
import { SuccessCallback, FailureCallback } from '../../../callbacks'
import SubmitButton from '../../../SubmitButton'

export const CreateDialog = (close: CloseFunction): JSX.Element => {
  return <EnhancedCreate close={close} />
}

interface CreateProps {
  close: CloseFunction
}
interface FormData {
  size: number
}
const styles = (theme: any) =>
  createStyles({
    formControl: {
      margin: theme.spacing.unit * 3
    },
    group: {
      margin: `${theme.spacing.unit}px 0`
    }
  })

interface EnhancedCreateProps
  extends InjectedFormProps<FormData>,
    WithStyles<typeof styles> {
  create: (
    values: { size: number },
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}

interface CreateState {
  selectedDBType: 'FREE' | 'STANDARD'
  marks: { [key: string]: number }
  displaySlider: boolean
}

class DBCreate extends React.Component<
  CreateProps & EnhancedCreateProps,
  CreateState
> {
  /**
   *
   */
  constructor(props: CreateProps & EnhancedCreateProps) {
    super(props)

    this.state = {
      selectedDBType: 'FREE',
      displaySlider: false,
      marks: {
        16: 0.6,
        32: 1.7,
        48: 4,
        64: 8,
        80: 16,
        96: 32,
        112: 64,
        128: 128
      }
    }

    this.onCancel = this.onCancel.bind(this)
    this.handleChangeRadio = this.handleChangeRadio.bind(this)
  }

  onCancel = () => {
    const { close } = this.props
    close()
  }

  onSubmit = ({ size }: FormData) => {
    const { close, create } = this.props

    const createObj = {
      size
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        const formErrors = {
          ...errors,
          app_id: errors.app_id,
          upgrade: errors['']
        }
        reject(
          new SubmissionError({
            _error: extractError(formErrors, 'Failed to add database'),
            size: extractError(formErrors, 'size')
          })
        )
      }
      create(
        createObj,
        () => {
          close()
          resolve()
        },
        failureCallback
      )
    })
  }

  handleChangeRadio(event: React.ChangeEvent<{}>, value: string) {
    if (value === 'FREE') {
      this.setState({ selectedDBType: 'FREE', displaySlider: false })
    } else this.setState({ selectedDBType: 'STANDARD', displaySlider: true })
  }

  render() {
    const {
      error,
      submitting,
      pristine,
      invalid,
      handleSubmit,
      classes
    } = this.props

    const { selectedDBType, marks, displaySlider } = this.state

    return (
      <form style={{ minWidth: 600 }} onSubmit={handleSubmit(this.onSubmit)}>
        <DialogTitle id="form-dialog-title">Add Database</DialogTitle>
        {error && (
          <DialogContent>
            <FormHelperText error>{error}</FormHelperText>
          </DialogContent>
        )}

        <DialogContent>
          <FormControl>
            <RadioGroup
              row
              aria-label="Gender"
              name="gender1"
              className={classes.group}
              value={selectedDBType}
              onChange={this.handleChangeRadio}
            >
              <FormControlLabel
                value="FREE"
                control={<Radio color="primary" />}
                label="Free"
              />
              <FormControlLabel
                value="STANDARD"
                control={<Radio color="primary" />}
                label="Standard"
              />
            </RadioGroup>
          </FormControl>
        </DialogContent>
        <DialogContent style={{ display: displaySlider ? 'block' : 'none' }}>
          <div>
            <Slider marks={marks} step={null} defaultValue={48} max={144} className={css.slider}/>
          </div>
        </DialogContent>
        <DialogActions>
          <SubmitButton
            {...{ invalid, pristine, submitting }}
            label="Save Database"
          />
          <Button onClick={this.onCancel} color="primary">
            Cancel
          </Button>
        </DialogActions>
      </form>
    )
  }
}

const createForm = (
  values: { size: number },
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
) => {
  const basePath = ''
  const redirectTo = ''

  // needed because the create endpoint doesn't return a full app e.g. stack
  const refresh = true
  return crudCreate(
    'databases',
    values,
    basePath,
    redirectTo,
    refresh,
    successCallback,
    failureCallback
  )
}

const EnhancedCreate = compose<CreateProps & EnhancedCreateProps, CreateProps>(
  withStyles(styles),
  connect(
    () => ({
      initialValues: {}
    }),
    {
      create: createForm
    }
  ),
  reduxForm({
    form: 'dbCreate'
  })
)(DBCreate)

export default EnhancedCreate
