import React from 'react'
import { ReduxState } from 'ra-core'
import { CorrectedReduxState } from './CorrectedReduxState'
import { crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import Paper from '@material-ui/core/Paper'
import { PaymentMethod } from './api/payment_methods'

const styles = createStyles({})

interface Props {
    className: string
}

interface EnhancedProps extends WithStyles<typeof styles> {
  id: string,
  resource: string,
  crudGetOne: Function
  record: PaymentMethod
  isLoading: boolean
  version: number
}

type State = {
}


class Show extends React.Component<Props & EnhancedProps, State> {
  componentDidMount() {
    // ininite loop here.. keeps mounting the component over and over
    // this.updateData();
  }

  componentWillReceiveProps(nextProps: Props & EnhancedProps) {
      if (
          nextProps.version !== this.props.version
      ) {
        this.updateData();
      }
  }

  updateData() {
    this.props.crudGetOne(this.props.resource, this.props.id, '/login')
  }

  render() {
    const { record, isLoading, className } = this.props

    if (!record && !isLoading) {
      this.updateData()
    }


    if (!record || isLoading) {
      return <div>Loading</div>
    }

    return (
        <Paper elevation={0} className={className}>
          <h3>Current Payment Method</h3>
          <div>{record.brand.toUpperCase()} •••• {record.last4}</div>
          <div>Expires: {record.expMonth}/{record.expYear}</div>
        </Paper>
    )
  }
}

function mapStateToProps(state: ReduxState & CorrectedReduxState, props: Props) {
  const id = "ignored"
  const resource = "payment_methods"
  return {
    id: id,
    resource: resource,
    record: state.admin.resources[resource]
      ? state.admin.resources[resource].data[id]
      : null,
    isLoading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion
  }
}

const EnhancedShow = compose<Props & EnhancedProps, Props>(
  withStyles(styles),
  connect(mapStateToProps, { 
    crudGetOne: crudGetOneAction,
  })
)(Show)

export default EnhancedShow
