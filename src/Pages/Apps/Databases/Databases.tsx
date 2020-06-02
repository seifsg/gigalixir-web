import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Query } from 'ra-core'
import { Grid, Divider } from '@material-ui/core'
import Loading from '../../../Loading'
import ErrorComponent from '../../../ErrorComponent'
import { Database } from '../../../api/databases'
import DatabaseCol from './DatabaseCol'

const styles = createStyles({})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  id: string
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<Props & EnhancedProps> = ({ id }) => {
  // threading version up into here is just a way to get Query
  // to reload itself when the delete button is pressed and
  // refresh=true
  return (
    <>
      <h4>Databases</h4>
      <Divider />
      <Query type="GET_LIST_BY_ID" resource="databases" payload={{ id }}>
        {({
          data,
          loading,
          error
        }: {
          data: Database[]
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
              <div>
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
              <div>
                <Grid container spacing={24}>
                  <Grid item xs={12}>
                    <DatabaseCol database={data[0]} />
                  </Grid>
                </Grid>
              </div>
            )
          }
          return <div>No databases found.</div>
        }}
      </Query>
    </>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
