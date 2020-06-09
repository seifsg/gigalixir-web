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
  FormHelperText,
  withStyles,
} from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever'
import { Form, Field } from 'react-final-form'
import CheckCircleOutlineIcon from '@material-ui/icons/CheckCircleOutline'
import { blue } from '@material-ui/core/colors'
import { FORM_ERROR } from 'final-form'
import { extractError } from '../../../errorSagas'
import SubmitButton from '../../../SubmitButton'

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

const ColorButton = withStyles((theme: Theme) => ({
  root: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: '#2877ff',
    '&:hover': {
      backgroundColor: blue[700],
    },
  },
}))(Button)

interface Props {
  appID: string
}
const Component: FunctionComponent<Props> = (props) => {
  const [open, setOpen] = useState(false)
  const [id, setID] = useState('lul')
  const [deletedSuccessfully, setDeletedSuccessfully] = useState(false)
  const { appID } = props

  const classes = useStyles(props)
  const refresh = useRefresh()
  const notify = useNotify()
  const [mutate, { loading }] = useMutation()
  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const submit = (values: { id: string }) => {
    return new Promise((resolve) => {
      mutate(
        {
          type: 'delete',
          resource: 'databases',
          payload: { appID, id: values.id },
        },
        {
          onSuccess: () => {
            notify('Database deleted')
            refresh()
            setDeletedSuccessfully(true)
            resolve()
            setID(values.id)
          },
          onFailure: ({ body: { errors } }) => {
            resolve({
              [FORM_ERROR]: extractError(errors, ['', 'database_id']),
            })
          },
        }
      )
    })
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
        {deletedSuccessfully ? (
          <>
            <DialogContent>
              <div className={classes.deleteIconArea}>
                <CheckCircleOutlineIcon className={classes.largeIcon} />
                <h2 className={classes.deleteIconAreaH2}>Success!</h2>
              </div>
              <p>{`The "${id}" database was successfully deleted.`}</p>
            </DialogContent>
            <DialogActions
              style={{
                justifyContent: 'center',
                margin: '0 1.33em 1.33em 1.33em',
              }}
            >
              <ColorButton
                onClick={handleClose}
                variant="contained"
                color="primary"
              >
                Continue
              </ColorButton>
            </DialogActions>
          </>
        ) : (
          <>
            <DialogTitle id="form-dialog-title">Delete Database</DialogTitle>
            <Form
              onSubmit={submit}
              render={({
                handleSubmit,
                submitError,
                submitting,
                hasValidationErrors,
                hasSubmitErrors,
                modifiedSinceLastSubmit,
                pristine,
              }) => {
                return (
                  <form onSubmit={handleSubmit} style={{ minWidth: 600 }}>
                    <DialogContent>
                      <div className={classes.deleteIconArea}>
                        <DeleteForeverIcon className={classes.largeIcon} />
                        <h2 className={classes.deleteIconAreaH2}>Delete?</h2>
                      </div>
                      <Alert severity="error">
                        <b>Warning:</b> Deleting a database cannot be undone and
                        will destroy all backups
                      </Alert>

                      {submitError && (
                        <DialogContent>
                          <FormHelperText error>{submitError}</FormHelperText>
                        </DialogContent>
                      )}
                      <Field name="id" type="text">
                        {(formProps) => (
                          <TextField
                            autoFocus
                            margin="dense"
                            id="name"
                            label="Database ID"
                            type="text"
                            fullWidth
                            name={formProps.input.name}
                            value={formProps.input.value}
                            onChange={formProps.input.onChange}
                          />
                        )}
                      </Field>
                    </DialogContent>
                    <DialogActions>
                      <Button onClick={handleClose} color="primary">
                        Cancel
                      </Button>
                      <SubmitButton
                        {...{
                          invalid:
                            hasValidationErrors ||
                            (hasSubmitErrors && !modifiedSinceLastSubmit),
                          pristine,
                          submitting,
                        }}
                        color="secondary"
                        label="Delete"
                      />
                    </DialogActions>
                  </form>
                )
              }}
            />
          </>
        )}
      </Dialog>
    </>
  )
}

export default Component
