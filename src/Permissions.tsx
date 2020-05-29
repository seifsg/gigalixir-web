import React, { FunctionComponent } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import Button from '@material-ui/core/Button'
import classnames from 'classnames'
import compose from 'recompose/compose'
import {
  Theme,
  createStyles,
  withStyles,
  WithStyles
} from '@material-ui/core/styles'
import { Query, Mutation } from 'ra-core'
import _ from 'lodash/fp'
import { Permissions } from './api/permissions'
import Loading from './Loading'
import ErrorComponent from './ErrorComponent'

// TODO: duplicated in Invoices.tsx
const styles = ({ spacing }: Theme) =>
  createStyles({
    table: {
      padding: 0,
      margin: 0
    },
    row: {
      display: 'flex',
      padding: 12,
      fontSize: '0.875rem',
      borderTop: '1px solid rgba(224, 224, 224, 1)',
      '& div': {
        flex: '1 1 0px'
      }
    },
    header: {
      color: 'rgba(0,0,0,0.5)',
      borderTop: 'none'
    },
    // duplicated in SubmitButton. how to not duplicate?
    icon: {
      marginRight: spacing.unit
    }
  })

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {
  id: string
  version: number
}

type EnhancedProps = WithStyles<typeof styles>

const Component: FunctionComponent<Props & EnhancedProps> = ({
  id,
  classes,
  version
}) => {
  // threading version up into here is just a way to get Query
  // to reload itself when the delete button is pressed and
  // refresh=true
  return (
    <Query
      type="GET_ONE"
      resource="permissions"
      payload={{ id }}
      options={{ version }}
    >
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
        const delOptions = {
          refresh: true,
          onSuccess: {
            notification: { body: 'Deleted', level: 'info' }
          },
          onFailure: {
            notification: { body: 'Error', level: 'warning' }
          }
        }
        return (
          <ul className={classes.table}>
            <li className={classnames(classes.row, classes.header)}>
              <div>Email</div>
              <div>Role</div>
              <div />
            </li>
            <li key={data.owner} className={classes.row}>
              <div>{data.owner}</div>
              <div>Owner</div>
              <div />
            </li>
            {_.map(email => {
              return (
                <li key={email} className={classes.row}>
                  <div>{email}</div>
                  <div>Collaborator</div>
                  <div>
                    <Mutation
                      type="DELETE"
                      resource="permissions"
                      payload={{ id, email }}
                      options={delOptions}
                    >
                      {(del: () => void, { loading }: { loading: boolean }) => (
                        <Button color="primary" variant="raised" onClick={del}>
                          {loading && (
                            <CircularProgress
                              className={classes.icon}
                              size={18}
                              thickness={2}
                            />
                          )}
                          Delete
                        </Button>
                      )}
                    </Mutation>
                  </div>
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
