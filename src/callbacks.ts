export type SuccessCallback = Function
export type FailureCallback = (params: {
 payload: { errors: { [k: string]: string[] } }
}) => void
