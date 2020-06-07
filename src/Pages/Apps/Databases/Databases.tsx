import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { Query } from 'ra-core'
import {
  Grid,
  Divider,
  createStyles,
  WithStyles,
  withStyles
} from '@material-ui/core'
import classnames from 'classnames'
import { Icon } from 'antd'
import Loading from '../../../Loading'
import ErrorComponent from '../../../ErrorComponent'
import { DatabasesArray } from '../../../api/databases'
import DatabaseCol from './DatabaseCol'
import DialogButton from '../../../DialogButton'
import { CreateDialog } from './CreateDB'

const styles = createStyles({
  container: {
    padding: '1.3em 0'
  },
  title: {
    display: 'inline-block'
  },
  titleContainer: {
    width: '100%',
    marginBottom: 5
  },
  controlButtons: {
    float: 'right',
    marginRight: 2
  },
  btn: {
    display: 'inline',
    marginLeft: '1em'
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
    <>
      <div className={classnames(classes.titleContainer)}>
        <Grid container spacing={24}>
          <Grid item xs={6}>
            <h2 className={classnames(classes.title)}>Databases</h2>
          </Grid>
          <Grid item xs={6} style={{ textAlign: 'right' }}>
            <DialogButton
              containerClassName={classnames(classes.btn)}
              label={
                <>
                  <Icon type="plus" /> &nbsp; &nbsp; <span>Add Database</span>
                </>
              }
            >
              {CreateDialog}
            </DialogButton>
            <DialogButton
              containerClassName={classnames(classes.btn)}
              color="secondary"
              label={
                <>
                  <Icon type="delete" /> &nbsp; &nbsp; <span>Delete</span>
                </>
              }
            >
              {CreateDialog}
            </DialogButton>
          </Grid>
        </Grid>
      </div>
      <Divider />
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
              <div>No database listed yet.</div>
              <div>
                {' '}
                <DialogButton
                  containerClassName={classnames(classes.btn)}
                  label={
                    <>
                      <Icon type="plus" /> &nbsp; &nbsp;{' '}
                      <span>Add Database</span>
                    </>
                  }
                >
                  {CreateDialog}
                </DialogButton>
              </div>
            </div>
          )
        }}
      </Query>
    </>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
