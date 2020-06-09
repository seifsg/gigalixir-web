import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import { makeStyles, Theme } from '@material-ui/core/styles'
import { useMutation, useRefresh, useNotify } from 'ra-core'
import React, { FunctionComponent, useState } from 'react'
import {
  Dialog,
  DialogTitle,
  TextField,
  DialogActions,
  DialogContent,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { extractErrorNotify } from '../../../errorSagas'

const useStyles = makeStyles(
  (theme: Theme) => ({
    icon: {
      marginRight: theme.spacing(1),
    },
    largeIcon: { fontSize: 120, color: '#2877ff' },
    deleteIconArea: { textAlign: 'center', h2: { margin: 0 } },
    deleteIconAreaH2: { margin: '0 0 1.33em 0' },
  }),
  { name: 'DBDeleteButton' }
)

interface Props {
  appID: string
}
const Component: FunctionComponent<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [id, setId] = useState('')
  const { appID } = props

  const classes = useStyles(props)
  const refresh = useRefresh()
  const notify = useNotify()
  const [mutate, { loading }] = useMutation(
    {
      type: 'delete',
      resource: 'databases',
      payload: { appID, id },
    },
    {
      onSuccess: () => {
        notify('Database deleted')
        refresh()
      },
      onFailure: ({ body: { errors } }) => {
        extractErrorNotify(errors, '')(notify)
        extractErrorNotify(errors, 'database_id')(notify)
      },
    }
  )
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <>
      <Button color="secondary" variant="contained" onClick={handleClickOpen}>
        {loading && (
          <CircularProgress className={classes.icon} size={18} thickness={2} />
        )}
        <DeleteForeverIcon /> &nbsp; &nbsp; <span>Delete</span>
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Delete Database</DialogTitle>
        <DialogContent>
          <div className={classes.deleteIconArea}>
            <DeleteForeverIcon className={classes.largeIcon} />
            <h2 className={classes.deleteIconAreaH2}>Delete?</h2>
          </div>
          <Alert severity="error">
            <b>Warning:</b> Deleting a database cannot be undone and will
            destroy all backups
          </Alert>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Database name"
            type="text"
            fullWidth
            onChange={(
              event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
            ) => setId(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              mutate()
              handleClose()
            }}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Component
