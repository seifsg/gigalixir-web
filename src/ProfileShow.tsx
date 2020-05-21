import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import _ from 'lodash/fp'
import { push as routerPush } from 'react-router-redux'
import React from 'react'
import { Authenticated, crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { ReduxState } from 'ra-core'
import Field from './Field'
import Fields from './Fields'
import Section from './Section'
import { User } from './api/users'
import PaymentMethod from './PaymentMethod'
import UpdatePaymentMethod from './UpdatePaymentMethod'
import Upgrade from './Upgrade'
import { CorrectedReduxState } from './CorrectedReduxState'
import Page from './Page'
import { StyledTab, StyledTabs } from './Tabs'
import Loading from './Loading'
import ComingSoon from './ComingSoon'

const styles = createStyles({})

interface Props {
  match: {
    params: {
      tab: string
    }
  }
  id: string
  resource: string
  tabs: {
    path: string
    label: string
    element: (
      record: User,
      classes: Record<keyof typeof styles, string>
    ) => JSX.Element
  }[]
}

interface EnhancedProps extends WithStyles<typeof styles> {
  crudGetOne: Function
  push: (url: string) => void
  record: User
  isLoading: boolean
  version: number
}

interface State {}

class ProfileShow extends React.Component<Props & EnhancedProps, State> {
  constructor(props: Props & EnhancedProps) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  componentDidMount() {
    // not an infinite loop like the child component because this does not
    // have to re-render on every state change (i think). But just to stay
    // consistent, we updateData below in the render function based on the
    // record and isLoading state
    // this.updateData();
  }

  componentWillReceiveProps(nextProps: Props & EnhancedProps) {
    if (
      this.props.id !== nextProps.id ||
      nextProps.version !== this.props.version
    ) {
      this.updateData()
    }
  }

  updateData() {
    this.props.crudGetOne(this.props.resource, this.props.id, '/login')

    // should we load everything from the "container" and let everything
    // else be "presentational" only?
    // this.props.crudGetOne('payment_methods', 'ignored', '/login')
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    const tabName = this.props.tabs[newValue].path
    this.props.push(`/account/${tabName}`)
  }

  selectedTab() {
    const index = this.selectedTabIndex()
    return this.props.tabs[index]
  }

  selectedTabIndex() {
    const index = _.findIndex(tab => {
      return tab.path === this.props.match.params.tab
    }, this.props.tabs)

    if (index === -1) {
      return 0
    }

    return index
  }

  render() {
    const { tabs, isLoading, record, classes } = this.props

    if (!record && !isLoading) {
      this.updateData()
    }

    if (!record || isLoading) {
      return <Loading />
    }

    return (
      <Authenticated>
        <Page title="My Account">
          <div>
            <StyledTabs
              value={this.selectedTabIndex()}
              onChange={this.handleTabChange}
            >
              {tabs.map(x => (
                <StyledTab key={x.label} label={x.label} />
              ))}
            </StyledTabs>
            {this.selectedTab().element(record, classes)}
          </div>
        </Page>
      </Authenticated>
    )
  }
}

function mapStateToProps(
  state: ReduxState & CorrectedReduxState,
  props: Props
) {
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
  connect(mapStateToProps, {
    crudGetOne: crudGetOneAction,
    push: routerPush
  })
)(ProfileShow)

EnhancedProfileShow.defaultProps = {
  id: 'ignored',
  resource: 'profile',
  tabs: [
    {
      path: 'profile',
      label: 'Profile',
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        const formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        })

        return (
          <div>
            <Section>
              <Fields>
                <Field label="Email"> {record.email} </Field>
                <Field label="Tier"> {record.tier} </Field>
                {record.creditCents !== 0 && (
                  <Field label="Credits">
                    {formatter.format(record.creditCents / 100.0)}
                  </Field>
                )}
              </Fields>
            </Section>
            <Upgrade record={record} />
          </div>
        )
      }
    },
    {
      path: 'payment-method',
      label: 'Payment Method',
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return (
          <div>
            <PaymentMethod />
            <UpdatePaymentMethod record={record} />
          </div>
        )
      }
    },
    {
      path: 'api-key',
      label: 'API Key',
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return (
          <Section>
            <ComingSoon />
          </Section>
        )
      }
    },
    {
      path: 'ssh-keys',
      label: 'SSH Keys',
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return (
          <Section>
            <ComingSoon />
          </Section>
        )
      }
    }
  ]
}

export default EnhancedProfileShow
