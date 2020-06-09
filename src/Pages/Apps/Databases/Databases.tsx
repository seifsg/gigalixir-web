import React, { FunctionComponent, ReactNode } from 'react'
import compose from 'recompose/compose'
import { useQueryWithStore } from 'ra-core'
import {
  Grid,
  Divider,
  createStyles,
  WithStyles,
  withStyles,
} from '@material-ui/core'
import classnames from 'classnames'
import Loading from '../../../Loading'
import ErrorComponent from '../../../ErrorComponent'
import { DatabasesArray } from '../../../api/databases'
import DatabaseCol from './DatabaseCol'
import AddDatabase from './CreateDB'
import DeleteDB from './DeleteDB'

const styles = createStyles({
  container: {
    padding: '1.3em 0',
  },
  title: {
    display: 'inline-block',
  },
  titleContainer: {
    width: '100%',
    marginBottom: 5,
  },
  controlButtons: {
    float: 'right',
    marginRight: 2,
  },
  btn: {
    display: 'inline',
    marginLeft: '1em',
  },
  containerNoDB: {
    minHeight: '200px',
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'center',
    justifyItems: 'center',
    flexDirection: 'column',
  },
  noDB: {},
})

interface Props {
  id: string
}

type EnhancedProps = WithStyles<typeof styles>

const renderDatabases = (
  classes: Record<keyof typeof styles, string>,
  loading: boolean,
  error: Error,
  data: DatabasesArray,
  id: string
): ReactNode => {
  if (loading) {
    return <Loading />
  }
  if (error) {
    return <ErrorComponent>{error.message}</ErrorComponent>
  }
  if (data?.length === 2) {
    return (
      <div className={classnames(classes.container)}>
        <Grid container>
          <Grid item xs={6}>
            <DatabaseCol database={data[0]} dividingBorder />
          </Grid>
          <Grid item xs={6}>
            <DatabaseCol database={data[1]} />
          </Grid>
        </Grid>
      </div>
    )
  }
  if (data?.length === 1) {
    return (
      <div className={classnames(classes.container)}>
        <Grid container>
          <Grid item xs={12}>
            <DatabaseCol database={data[0]} />
          </Grid>
        </Grid>
      </div>
    )
  }
  return (
    <div className={classnames(classes.containerNoDB)}>
      <div className={classnames(classes.noDB)}>
        <h3>No database listed yet.</h3>
        <div className={classnames(classes.btn)}>
          <AddDatabase appID={id} />
        </div>
      </div>
    </div>
  )
}

const Component: FunctionComponent<Props & EnhancedProps> = ({
  id,
  classes,
}) => {
  const { data, loaded, error } = useQueryWithStore({
    type: 'GET_LIST_BY_ID',
    resource: 'databases',
    payload: { id },
  })

  return (
    <>
      <div className={classnames(classes.titleContainer)}>
        <Grid container>
          <Grid item xs={6}>
            <h2 className={classnames(classes.title)}>Databases</h2>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <div className={classnames(classes.btn)}>
              <AddDatabase appID={id} />
            </div>
            <div className={classnames(classes.btn)}>
              <DeleteDB appID={id} />
            </div>
          </Grid>
        </Grid>
      </div>
      <Divider />
      {renderDatabases(classes, !loaded, error, data, id)}
    </>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
