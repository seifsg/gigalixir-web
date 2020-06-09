import React, { FunctionComponent, useState } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { Form, Field } from 'react-final-form'
import {
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  Theme,
  Dialog,
} from '@material-ui/core'
import Slider from '@material-ui/core/Slider'
import { useMutation, useRefresh, useNotify } from 'ra-core'
import { FORM_ERROR } from 'final-form'
import AddIcon from '@material-ui/icons/Add'
import { extractError } from '../../../errorSagas'
import SubmitButton from '../../../SubmitButton'

interface CreateProps {
  appID: string
}
interface FormData {
  size: number
}
const styles = (theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(3),
    },
    group: {
      margin: `${theme.spacing()}px 0`,
    },
  })

type EnhancedCreateProps = WithStyles<typeof styles>

const DBCreate: FunctionComponent<CreateProps & EnhancedCreateProps> = (
  props
) => {
  const { classes, appID } = props
  const [displaySlider, setDisplaySlider] = useState(false)
  const [open, setOpen] = useState(false)
  const refresh = useRefresh()
  const notify = useNotify()
  const [mutate] = useMutation()

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const marks = [
    {
      value: 16,
      label: 0.6,
    },
    {
      value: 32,
      label: 1.7,
    },
    {
      value: 48,
      label: 4,
    },
    {
      value: 80,
      label: 16,
    },
    {
      value: 96,
      label: 32,
    },
    {
      value: 112,
      label: 64,
    },
    {
      value: 128,
      label: 128,
    },
  ]

  const onCancel = () => {
    handleClose()
  }

  const submit = (values: FormData) => {
    return new Promise((resolve) => {
      mutate(
        {
          type: 'create',
          resource: 'databases',
          payload: {
            data: { size: values.size, appID },
          },
        },
        {
          onSuccess: () => {
            notify('Database added!')
            handleClose()
            resolve()
            refresh()
          },
          onFailure: ({ body: { errors } }) => {
            resolve({
              [FORM_ERROR]: extractError(errors, ['', 'app_name', 'app_id']),
            })
          },
        }
      )
    })
  }

  const handleChangeRadio = (
    event: React.ChangeEvent<HTMLInputElement>,
    value: string
  ) => {
    if (value === 'FREE') {
      setDisplaySlider(false)
    } else {
      setDisplaySlider(true)
    }
  }

  /**
   * Since the distance between slider select points is calculated by value
   * I set values that serve an ergonomic purpose
   * So this function serves to get the actual value
   */
  const loopForSelectedValue = (value: number) => {
    let i = marks.length
    let selected = 0
    while (i > 0 && selected === 0) {
      i -= 1
      if (marks[i].value === value) selected = marks[i].label
    }
    return selected
  }

  return (
    <>
      <Button color="primary" variant="contained" onClick={handleClickOpen}>
        <AddIcon /> &nbsp; &nbsp; <span>Add Database</span>
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <Form
          onSubmit={submit}
          mutators={{
            changeValue: (args, state, utils) => {
              utils.changeValue(state, args[0], () => args[1])
            },
          }}
          render={({
            handleSubmit,
            submitError,
            submitting,
            hasValidationErrors,
            hasSubmitErrors,
            modifiedSinceLastSubmit,
            pristine,
            values,
            form,
          }) => {
            return (
              <form onSubmit={handleSubmit} style={{ minWidth: 600 }}>
                <DialogTitle id="form-dialog-title">Add Database</DialogTitle>
                {submitError && (
                  <DialogContent>
                    <FormHelperText error>{submitError}</FormHelperText>
                  </DialogContent>
                )}

                <DialogContent>
                  <FormControl>
                    <Field name="type" type="radio">
                      {(formProps) => (
                        <RadioGroup
                          row
                          className={classes.group}
                          name={formProps.input.name}
                          value={formProps.input.value}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                            value: string
                          ) => {
                            formProps.input.onChange(event)
                            handleChangeRadio(event, value)
                            if (
                              typeof values.size === 'undefined' &&
                              value === 'STANDARD'
                            ) {
                              form.mutators.changeValue('size', 4) // setting default value that only needed when "STANDARD" is selected
                            } else {
                              form.mutators.changeValue('size', undefined)
                            }
                          }}
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
                      )}
                    </Field>
                  </FormControl>
                </DialogContent>
                <DialogContent
                  style={{ display: displaySlider ? 'block' : 'none' }}
                >
                  <div>
                    <Field name="size">
                      {(formProps) => (
                        <Slider
                          marks={marks}
                          step={null}
                          defaultValue={48}
                          max={144}
                          name={formProps.input.name}
                          onChange={(
                            event: React.ChangeEvent<unknown>,
                            value: number | number[]
                          ) => {
                            formProps.input.onChange(event)
                            if (typeof value === 'number') {
                              const val = loopForSelectedValue(value)
                              form.mutators.changeValue('size', val)
                            }
                          }}
                        />
                      )}
                    </Field>
                  </div>
                </DialogContent>
                <DialogActions>
                  <SubmitButton
                    {...{
                      invalid:
                        hasValidationErrors ||
                        (hasSubmitErrors && !modifiedSinceLastSubmit),
                      pristine,
                      submitting,
                    }}
                    label="Save database"
                  />
                  <Button onClick={onCancel} color="primary">
                    Cancel
                  </Button>
                </DialogActions>
              </form>
            )
          }}
        />
      </Dialog>
    </>
  )
}

const EnhancedCreate = compose<CreateProps & EnhancedCreateProps, CreateProps>(
  withStyles(styles),
  connect()
)(DBCreate)

export default EnhancedCreate
