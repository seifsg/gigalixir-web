import { crudCreate } from './crudCreate'
import { RedirectionSideEffect} from 'ra-core'

export default (values: object, basePath: string, redirectTo: RedirectionSideEffect) =>
  crudCreate('users', { ...values }, basePath, 'Confirmation email sent. Please check your email.', redirectTo)
