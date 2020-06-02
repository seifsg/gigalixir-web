/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import _ from 'lodash/fp'
import { Grid } from '@material-ui/core'
import { Database } from '../../../api/databases'

const styles = createStyles({
  divider: {
    width: '100%',
    borderTop: '4px solid #b7b7b7',
    height: '0px',
    padding: 0,
    margin: 0,
    marginBottom: '1.33em'
  },
  dividingBorder: {
    borderRight: '2px solid rgba(224, 224, 224, 1)',
    minHeight: '100%'
  },
  container: {
    marginBottom: '1.33em',
    marginTop: '1.33em'
  }
})

interface DatabaseCol {
  database: Database
  dividingBorder?: boolean
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<DatabaseCol & EnhancedProps> = ({
  database,
  dividingBorder,
  classes
}) => {
  return (
    <div
      className={`${
        dividingBorder === true ? classnames(classes.dividingBorder) : ''
      } ${classnames(classes.container)}`}
    >
      <Grid container spacing={24}>
        <Grid item xs={3}>
          <h4>{database.tier}</h4>
          <div className={classnames(classes.divider)} />
        </Grid>
        <Grid item xs={9}>
          &nbsp;
        </Grid>
      </Grid>
      <DbField leftSide="ID" rightSide={database.id} />
      <DbField leftSide="Host" rightSide={database.host} />
      <DbField leftSide="Port" rightSide={database.port} />
      <DbField leftSide="Username" rightSide={database.username} />
      <DbField leftSide="Password" rightSide={database.password} />
      <DbField leftSide="Database" rightSide={database.database} />
      <DbField leftSide="State" rightSide={database.state} />
      <DbField leftSide="Cloud" rightSide={database.cloud} />
      <DbField leftSide="Region" rightSide={database.region} />
      <DbField leftSide="Size" rightSide={database.size} />
      <DbFieldTextArea leftSide="URL" rightSide={database.url} />
    </div>
  )
}

const DbField: FunctionComponent<{
  leftSide: string | number
  rightSide: string | number
}> = ({ leftSide, rightSide }) => {
  if (
    typeof rightSide === 'undefined' ||
    (typeof rightSide === 'string' && rightSide.trim() === '')
  )
    return null
  return (
    <Grid container spacing={24}>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        {rightSide}
      </Grid>
    </Grid>
  )
}

const DbFieldTextArea: FunctionComponent<{
  leftSide: string | number
  rightSide: string | number
}> = ({ leftSide, rightSide }) => {
  if (typeof rightSide === undefined) return null
  return (
    <Grid container spacing={24}>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        <textarea style={{ width: '100%', resize: 'none', minHeight: '50px' }}>
          {rightSide}
        </textarea>
      </Grid>
    </Grid>
  )
}

const EnhancedComponent = compose<DatabaseCol & EnhancedProps, DatabaseCol>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
