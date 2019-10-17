import { crudCreate } from 'react-admin'

export default (values: object, basePath: string, redirectTo: string) =>
  crudCreate('users', { ...values }, basePath, redirectTo)
