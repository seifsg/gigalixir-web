/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import moment from 'moment'
import Alert from '@material-ui/lab/Alert'
import { StandardDatabase, FreeDatabase } from '../../../api/databases'

const styles = createStyles({
  divider: {
    width: '100%',
    borderTop: '4px solid #b7b7b7',
    height: '0px',
    padding: 0,
    margin: 0,
    marginBottom: '1.33em',
  },
  dividingBorder: {
    borderRight: '2px solid rgba(224, 224, 224, 1)',
    minHeight: '100%',
  },
  container: {
    marginBottom: '1.33em',
    marginTop: '1.33em',
  },
  dbLimitedAt: {
    padding: '0 1.33em 1.33em',
  },
})

interface DatabaseCol {
  database: StandardDatabase | FreeDatabase
  dividingBorder?: boolean
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<DatabaseCol & EnhancedProps> = ({
  database,
  dividingBorder,
  classes,
}) => {
  return (
    <div
      className={`${
        dividingBorder === true ? classnames(classes.dividingBorder) : ''
      } ${classnames(classes.container)}`}
    >
      {database.tier === 'FREE' && database.limitedAt !== null ? (
        <div className={classnames(classes.dbLimitedAt)}>
          <DbLimitedAt limitedAt={database.limitedAt} />
        </div>
      ) : null}
      <div className={classnames(classes.container)}>
        <Grid container>
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
        {database.tier === 'STANDARD' ? (
          <>
            <DbField leftSide="Cloud" rightSide={database.cloud} />
            <DbField leftSide="Region" rightSide={database.region} />
            <DbField leftSide="Size" rightSide={database.size} />
          </>
        ) : (
          <DbFieldLimitedAt limitedAt={database.limitedAt} />
        )}

        <DbFieldTextArea leftSide="URL" rightSide={database.url} />
      </div>
    </div>
  )
}

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
    <Grid container>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        {rightSide}
      </Grid>
    </Grid>
  )
}

const DbFieldLimitedAt: FunctionComponent<{
  limitedAt: Date
}> = ({ limitedAt }) => {
  if (typeof limitedAt === 'undefined' || limitedAt === null) return null
  const limitedAtMoment = moment(limitedAt)
  return (
    <Grid container>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        Limited At
      </Grid>
      <Grid item xs={9}>
        {limitedAtMoment.format('h:mma')} on{' '}
        {limitedAtMoment.format('MM/DD/YYYY')}
      </Grid>
    </Grid>
  )
}

const DbFieldTextArea: FunctionComponent<{
  leftSide: string | number
  rightSide: string | number
}> = ({ leftSide, rightSide }) => {
  if (typeof rightSide === 'undefined' || rightSide === null) return null
  return (
    <Grid container>
      <Grid item xs={2} style={{ fontWeight: 'bold' }}>
        {leftSide}
      </Grid>
      <Grid item xs={9}>
        <textarea
          style={{ width: '100%', resize: 'none' }}
          defaultValue={rightSide}
        />
      </Grid>
    </Grid>
  )
}

const DbLimitedAt: FunctionComponent<{
  limitedAt: Date
}> = ({ limitedAt }) => {
  if (typeof limitedAt === 'undefined' || limitedAt === null) return null
  const limitedAtMoment = moment(limitedAt)
  return (
    <Alert severity="error">
      `This database was limited at ${limitedAtMoment.format('h:mma')} on $
      {limitedAtMoment.format('MM/DD/YYYY')} because it exceeded 10.000 rows`
    </Alert>
  )
}

const EnhancedComponent = compose<DatabaseCol & EnhancedProps, DatabaseCol>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
