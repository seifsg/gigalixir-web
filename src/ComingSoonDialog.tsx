import React, { FunctionComponent } from 'react'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import { CloseFunction } from './DialogButton'
import ComingSoon from './ComingSoon'

interface Props {
  close: CloseFunction
}
const Dialog: FunctionComponent<Props> = props => {
  const { close } = props
  const onCancel = () => {
    close()
  }
  return (
    <div>
      <DialogContent>
        <ComingSoon />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Close
        </Button>
      </DialogActions>
    </div>
  )
}

export default Dialog
