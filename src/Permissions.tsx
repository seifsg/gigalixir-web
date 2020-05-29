import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Query } from 'ra-core'
import _ from 'lodash/fp'
import { Permissions } from './api/permissions'
import Loading from './Loading'
import ErrorComponent from './ErrorComponent'

const styles = createStyles({
  table: {
    padding: 0,
    margin: 0
  },
  row: {
    display: 'flex',
    padding: 12,
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '& div': {
      flex: '1 1 0px'
    }
  },
  header: {
    color: 'rgba(0,0,0,0.5)'
  }
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  id: string
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<Props & EnhancedProps> = ({
  id,
  classes
}) => {
  return (
    <Query type="GET_ONE" resource="permissions" payload={{ id }}>
      {({
        data,
        loading,
        error
      }: {
        data: Permissions
        loading: boolean
        error: Error
      }): React.ReactElement => {
        if (loading) {
          return <Loading />
        }
        if (error) {
          return <ErrorComponent>{error.message}</ErrorComponent>
        }
        return (
          <ul className={classes.table}>
            <li className={classnames(classes.row, classes.header)}>
              <div>Email</div>
              <div>Role</div>
            </li>
            <li key={data.owner} className={classes.row}>
              <div>{data.owner}</div>
              <div>Owner</div>
            </li>
            {_.map(email => {
              return (
                <li key={email} className={classes.row}>
                  <div>{email}</div>
                  <div>Collaborator</div>
                </li>
              )
            }, data.collaborators)}
          </ul>
        )
      }}
    </Query>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
