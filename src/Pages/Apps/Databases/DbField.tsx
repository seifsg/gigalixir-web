import React, { FunctionComponent } from 'react'
import { Grid } from '@material-ui/core'

const DbField: FunctionComponent<{
  leftSide: string | number
  rightSide: string | number
}> = ({ leftSide, rightSide }) => {
  if (
    typeof rightSide === 'undefined' ||
    rightSide === null ||
    (typeof rightSide === 'string' && rightSide.trim() === '')
  )
    return null
  return (
    <Grid container style={{ margin: '0.66em 0' }}>
      <Grid item xs={2} style={{ color: 'rgba(0,0,0,0.5)' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        {rightSide}
      </Grid>
    </Grid>
  )
}

export default DbField
