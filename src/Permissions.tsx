import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import _ from 'lodash/fp'
import { useQuery } from 'ra-core'
import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import CollaboratorAddDialog from './CollaboratorAddDialog'
import CollaboratorDeleteButton from './CollaboratorDeleteButton'
import DialogButton, { CloseFunction } from './DialogButton'
import ErrorComponent from './ErrorComponent'
import Loading from './Loading'

// TODO: duplicated in Invoices.tsx
const styles = () =>
  createStyles({
    table: {
      padding: 0,
      margin: '20px 0 0 0'
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
  const { data, loading, loaded, error } = useQuery({
    type: 'getOne',
    resource: 'permissions',
    payload: {
      id,
      version // this isn't used, it's just here to make sure refresh happens
    }
  })

  if (!loaded) {
    return <Loading />
  }
  if (error) {
    return <ErrorComponent>{error.message}</ErrorComponent>
  }

  return (
    <div>
      <DialogButton label="Add Collaborator">
        {(close: CloseFunction) => {
          return <CollaboratorAddDialog id={id} close={close} />
        }}
      </DialogButton>

      <ul className={classes.table}>
        <li className={classnames(classes.row, classes.header)}>
          <div>Email</div>
          <div>Role</div>
          <div />
        </li>
        <li key={data?.owner} className={classes.row}>
          <div>{data?.owner}</div>
          <div>Owner</div>
          <div />
        </li>
        {_.map(email => {
          return (
            <li key={email} className={classes.row}>
              <div>{email}</div>
              <div>Collaborator</div>
              <div>
                <CollaboratorDeleteButton email={email} id={id} />
              </div>
            </li>
          )
        }, data?.collaborators)}
      </ul>
    </div>
  )
}

const EnhancedComponent = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Component)

export default EnhancedComponent
