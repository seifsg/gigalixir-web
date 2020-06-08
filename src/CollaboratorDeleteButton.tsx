import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useMutation, useRefresh, useNotify } from 'ra-core'
import React, { FunctionComponent } from 'react'
import { extractError } from './errorSagas'

const useStyles = makeStyles(
  (theme: Theme) => ({
    // duplicated in SubmitButton and LoginForm? how to not duplicate?
    icon: {
      marginRight: theme.spacing(1)
    }
  }),
  { name: 'CollaboratorDeleteButton' }
)

interface Props {
  id: string
  email: string
}
const Component: FunctionComponent<Props> = props => {
  const refresh = useRefresh()
  const { id, email } = props
  const classes = useStyles(props)
  const notify = useNotify()
  const [mutate, { loading }] = useMutation(
    {
      type: 'delete',
      resource: 'permissions',
      payload: { id, email }
    },
    {
      onSuccess: () => {
        refresh()
      },
      onFailure: ({ body: { errors } }) => {
        notify(extractError(errors, ''), 'error')
      }
    }
  )
  return (
    <Button
      color="primary"
      variant="contained"
      size="small"
      style={{ margin: '-10px 0px' }}
      onClick={mutate}
    >
      {loading && (
        <CircularProgress className={classes.icon} size={18} thickness={2} />
      )}
      Delete
    </Button>
  )
}

export default Component
