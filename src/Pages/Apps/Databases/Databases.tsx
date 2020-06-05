import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { Query } from 'ra-core'
import { Grid, createStyles, WithStyles, withStyles } from '@material-ui/core'
import classnames from 'classnames'
import Loading from '../../../Loading'
import ErrorComponent from '../../../ErrorComponent'
import { DatabasesArray } from '../../../api/databases'
import DatabaseCol from './DatabaseCol'

const styles = createStyles({
  container: {
    // padding: '1.3em 0'
  }
})

interface Props {
  id: string
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<Props & EnhancedProps> = ({
  id,
  classes
}) => {
  return (
    <div>
      <Query type="GET_LIST_BY_ID" resource="databases" payload={{ id }}>
        {({
          data,
          loading,
          error
        }: {
          data: DatabasesArray
          loading: boolean
          error: Error
        }): React.ReactElement => {
          if (loading) {
            return <Loading />
          }
          if (error) {
            return <ErrorComponent>{error.message}</ErrorComponent>
          }
          if (data.length === 2) {
            return (
              <div className={classnames(classes.container)}>
                <Grid container spacing={24}>
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
          if (data.length === 1) {
            return (
              <div className={classnames(classes.container)}>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <DatabaseCol database={data[0]} />
                  </Grid>
                </Grid>
              </div>
            )
          }
          return (
            <div className={classnames(classes.container)}>
              No databases found.
            </div>
          )
        }}
      </Query>
    </div>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
