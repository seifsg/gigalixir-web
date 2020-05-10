import { withStyles, WithStyles } from '@material-ui/core/styles'
import React from 'react'
import { Authenticated, crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { ReduxState } from 'ra-core'
import { User } from './api/users'

const styles = {
  h3: {
    borderBottom: '1px solid #ccc',
    paddingBottom: '20px'
  }
}

interface Props {
  id: string
  resource: string
}

interface EnhancedProps extends WithStyles<typeof styles> {
  crudGetOne: Function
  record: User
  isLoading: boolean
  version: number
}

class ProfileShow extends React.Component<Props & EnhancedProps> {
  componentWillReceiveProps(nextProps: Props & EnhancedProps) {
      if (
          this.props.id !== nextProps.id ||
          nextProps.version !== this.props.version
      ) {
          this.props.crudGetOne(nextProps.id, nextProps.resource, '/login', false)
      }
  }

  render() {
    const { id, isLoading, resource, crudGetOne, record } = this.props

    if (!record && !isLoading) {
      // first time there is no record and isLoading is false
      // second time there is no record and isLoading is true
      // third time, there is a record, but it has no fields! and isLoading is true
      // fourth time, there is a record with fields and isLoading is false
      // this puts it in the store. sets isLoading and waits for new props I think
      crudGetOne(id, resource, '/login', false)
    }

    if (!record || isLoading) {
      return <div>Loading</div>
    }

    return (
      <Authenticated>
        <div>{record.email}</div>
      </Authenticated>
    )
  }
}

export interface CorrectedReduxState {
  admin: {
    ui: {
      viewVersion: number
    }
  }
}

function mapStateToProps(state: ReduxState & CorrectedReduxState, props: Props) {
  return {
    id: props.id,
    record: state.admin.resources[props.resource]
      ? state.admin.resources[props.resource].data[props.id]
      : null,
    isLoading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion
  }
}

const EnhancedProfileShow = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  connect(mapStateToProps, { crudGetOne: crudGetOneAction })
)(ProfileShow)

EnhancedProfileShow.defaultProps = {
  id: 'profile',
  resource: 'profile'
}

export default EnhancedProfileShow
