import DialogContent from '@material-ui/core/DialogContent'
import React from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import {
  WrappedFieldProps,
} from 'redux-form'
import TextField from '@material-ui/core/TextField'

export const renderTextField = ({ type }: { type: 'number' | 'input' }) => ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: {
  label: string
} & WrappedFieldProps) => {
  return (
    <TextField
      type={type}
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
    />
  )
}

export const renderError = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: {
  label: string
} & WrappedFieldProps) => {
  if (error) {
    return (
      <DialogContent>
        <FormHelperText error>{error}</FormHelperText>
      </DialogContent>
    )
  }
  return <span />
}

