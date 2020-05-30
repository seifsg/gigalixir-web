// react-admin's validators try to translate which is annoying
// so we create our own here

/* eslint-disable @typescript-eslint/no-explicit-any */
export const required = (message = 'Required') => (value: any) =>
  value ? undefined : message
export const isNumber = (message = 'Must be a number') => (value: any) =>
  // eslint-disable-next-line no-restricted-globals
  value && isNaN(Number(value)) ? message : undefined
export const minValue = (min: number, message = 'Too small') => (value: any) =>
  value && value < min ? message : undefined
export const maxValue = (max: number, message = 'Too big') => (value: any) =>
  value && value > max ? message : undefined
export const choices = (list: any[], message = 'Invalid choice') => (
  value: any
) => (list.indexOf(value) === -1 ? message : undefined)
/* eslint-enable @typescript-eslint/no-explicit-any */
