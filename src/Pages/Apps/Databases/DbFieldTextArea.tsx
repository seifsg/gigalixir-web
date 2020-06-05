import React, { FunctionComponent } from 'react'
import { Grid } from '@material-ui/core'

const DbFieldTextArea: FunctionComponent<{
  leftSide: string | number
  rightSide: string | number
}> = ({ leftSide, rightSide }) => {
  if (typeof rightSide === 'undefined' || rightSide === null) return null
  return (
    <Grid container spacing={24}>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        <textarea style={{ width: '100%', resize: 'none' }}>
          {rightSide}
        </textarea>
      </Grid>
    </Grid>
  )
}

export default DbFieldTextArea
