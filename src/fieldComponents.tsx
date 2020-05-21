import DialogContent from '@material-ui/core/DialogContent'
import Select from '@material-ui/core/Select'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import RadioGroup from '@material-ui/core/RadioGroup'
import React, { ReactNode } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import { WrappedFieldProps } from 'redux-form'
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

export const renderSelect = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}: {
  label: string
  children: ReactNode
} & WrappedFieldProps) => (
  <FormControl error={touched && error}>
    <InputLabel htmlFor={input.name}>{label}</InputLabel>
    <Select {...input} {...custom} id={input.name}>
      {children}
    </Select>
    {renderFormHelper({ touched, error })}
  </FormControl>
)

export const renderRadioGroup = ({
  input,
  meta: { touched, invalid, error },
  ...custom
}: {} & WrappedFieldProps) => {
  return (
    <RadioGroup
      {...input}
      {...custom}
      value={input.value}
      onChange={(event: React.ChangeEvent<{}>, value: string) =>
        input.onChange(value)}
    />
  )
}

const renderFormHelper = ({
  touched,
  error
}: {
  touched: boolean
  error: any
}) => {
  if (!(touched && error)) {
  } else {
    return <FormHelperText>{touched && error}</FormHelperText>
  }
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
