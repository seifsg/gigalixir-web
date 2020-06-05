/* eslint-disable react/prop-types */
import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'
import { StandardDatabase, FreeDatabase } from '../../../api/databases'
import DbLimitedAt from './DbLimitedAt'
import DbField from './DbField'

const styles = createStyles({
  divider: {
    width: '100%',
    borderTop: '1px solid rgba(0,0,0,0.1)',
    height: '0px',
    padding: 0,
    margin: 0,
    marginBottom: '1.33em'
  },
  dividingBorder: {
    borderRight: '1px solid rgba(0,0,0,0.1)',
    minHeight: '100%'
  },
  container: {
    // marginBottom: '1.33em',
    // marginTop: '1.33em'
  },
  dbLimitedAt: {
    padding: '0 20px 20px 0'
  }
})

interface DatabaseCol {
  database: StandardDatabase | FreeDatabase
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
      <div className={classnames(classes.container)}>
        <Grid container spacing={24}>
          <Grid item xs={3}>
            <h4>{database.tier}</h4>
            <div className={classnames(classes.divider)} />
          </Grid>
          <Grid item xs={9}>
            &nbsp;
          </Grid>
        </Grid>
        {database.tier === 'FREE' && database.limitedAt !== null ? (
          <div className={classnames(classes.dbLimitedAt)}>
            <DbLimitedAt limitedAt={database.limitedAt} />
          </div>
        ) : null}

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
          <span />
        )}

        <DbField leftSide="URL" rightSide={database.url} />
      </div>
    </div>
  )
}

const EnhancedComponent = compose<DatabaseCol & EnhancedProps, DatabaseCol>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
