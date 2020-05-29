import React from 'react'
import { ReduxState } from 'ra-core'
import { crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import compose from 'recompose/compose'
import { CorrectedReduxState } from './CorrectedReduxState'
import { PaymentMethod } from './api/payment_methods'
import Section from './Section'

const styles = createStyles({})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

interface EnhancedProps extends WithStyles<typeof styles> {
  id: string
  resource: string
  crudGetOne: Function
  record: PaymentMethod
  isLoading: boolean
  version: number
}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

class Show extends React.Component<Props & EnhancedProps, State> {
  public componentDidMount() {
    // ininite loop here.. keeps mounting the component over and over
    // this.updateData();
  }

  public componentWillReceiveProps(nextProps: Props & EnhancedProps) {
    const { version } = this.props
    if (nextProps.version !== version) {
      this.updateData()
    }
  }

  private updateData() {
    const { resource, id, crudGetOne } = this.props
    crudGetOne(resource, id, '/account')
  }

  public render() {
    const { record, isLoading } = this.props

    if (!record && !isLoading) {
      this.updateData()
    }

    if (!record || isLoading) {
      return <div>Loading</div>
    }

    return (
      <Section>
        <h4>Current Payment Method</h4>
        <div>
          {record.brand.toUpperCase()} •••• {record.last4}
        </div>
        <div>
          Expires: {record.expMonth}/{record.expYear}
        </div>
      </Section>
    )
  }
}

function mapStateToProps(state: ReduxState & CorrectedReduxState) {
  const id = 'ignored'
  const resource = 'payment_methods'
  return {
    id,
    resource,
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
    crudGetOne: crudGetOneAction
  })
)(Show)

export default EnhancedShow
