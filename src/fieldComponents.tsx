import DialogContent from '@material-ui/core/DialogContent'
import Select from '@material-ui/core/Select'

import FormControl from '@material-ui/core/FormControl'
import InputLabel from '@material-ui/core/InputLabel'

import RadioGroup from '@material-ui/core/RadioGroup'
import React, { ReactNode } from 'react'
import FormHelperText from '@material-ui/core/FormHelperText'
import { WrappedFieldProps } from 'redux-form'
import { FieldRenderProps } from 'react-final-form'
import TextField from '@material-ui/core/TextField'

const renderFormHelper = ({
  touched,
  error
}: {
  touched: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error: any
}) => {
  if (!(touched && error)) {
    return <span />
  }
  return <FormHelperText>{touched && error}</FormHelperText>
}

export const renderTextField = ({ type }: { type: 'number' | 'input' }) => ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: { label: string } & FieldRenderProps<string, HTMLElement>): JSX.Element => {
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

export const renderNumberField = renderTextField({ type: 'number' })
export const renderInputField = renderTextField({ type: 'input' })
export const renderSelect = ({
  input,
  label,
  meta: { touched, error },
  children,
  ...custom
}: {
  label: string
  children: ReactNode
} & WrappedFieldProps) => {
  // style to match textfield width
  return (
    <FormControl style={{ width: '100%' }} error={touched && error}>
      <InputLabel htmlFor={input.name}>{label}</InputLabel>
      <Select {...input} {...custom} id={input.name}>
        {children}
      </Select>
      {renderFormHelper({ touched, error })}
    </FormControl>
  )
}

export const renderRadioGroup = ({
  input,
  ...custom
}: {} & WrappedFieldProps) => {
  return (
    <RadioGroup
      {...input}
      {...custom}
      value={input.value}
      onChange={(event: React.ChangeEvent<{}>, value: string) => {
        input.onChange(value)
      }}
    />
  )
}

// TODO: how to not have this *and* renderDialogError?
export const renderError = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  input,
  meta: { error },
  ...custom
}: {
  label: string
} & WrappedFieldProps) => {
  if (error) {
    return (
      <FormHelperText error {...custom}>
        {error}
      </FormHelperText>
    )
  }
  return <span />
}
export const renderDialogError = ({
  meta: { error }
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
