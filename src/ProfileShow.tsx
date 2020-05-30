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
import Invoices from './Invoices'
import { formatMoney } from './formatters'
import ApiKeyTab from './ApiKeyTab'

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
    shouldShow?: (tier: string) => boolean
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

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface State {}

class ProfileShow extends React.Component<Props & EnhancedProps, State> {
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  public componentWillReceiveProps(nextProps: Props & EnhancedProps) {
    const { id, version } = this.props
    if (id !== nextProps.id || version !== nextProps.version) {
      this.updateData()
    }
  }

  private updateData() {
    const { crudGetOne, id, resource } = this.props
    crudGetOne(resource, id, '/login')

    // should we load everything from the "container" and let everything
    // else be "presentational" only?
    // this.props.crudGetOne('payment_methods', 'ignored', '/login')
  }

  private handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    const { tabs, push } = this.props
    const tabName = tabs[newValue].path
    push(`/account/${tabName}`)
  }

  private selectedTab() {
    const { tabs } = this.props
    const index = this.selectedTabIndex()
    return tabs[index]
  }

  private selectedTabIndex() {
    const { tabs, match } = this.props
    const index = _.findIndex(tab => {
      return tab.path === match.params.tab
    }, tabs)

    if (index === -1) {
      return 0
    }

    return index
  }

  public render() {
    const { tabs, isLoading, record, classes } = this.props

    if (!record && !isLoading) {
      this.updateData()
    }

    if (!record) {
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
              {tabs.map(x => {
                return <StyledTab key={x.label} label={x.label} />
              })}
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
      element: (record: User) => {
        return (
          <div>
            <Section>
              <Fields>
                <Field label="Email"> {record.email} </Field>
                <Field label="Tier"> {record.tier} </Field>
                {record.creditCents !== 0 && (
                  <Field label="Credits">
                    {formatMoney(record.creditCents)}
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
      element: (record: User) => {
        if (record.tier === 'FREE') {
          return (
            <Section>
              No payment method required for free tier accounts.
            </Section>
          )
        }
        return (
          <div>
            <PaymentMethod />
            <UpdatePaymentMethod record={record} />
          </div>
        )
      }
    },
    {
      path: 'invoices',
      label: 'Invoices',
      element: () => {
        return (
          <Section>
            <Invoices />
          </Section>
        )
      }
    },
    {
      path: 'api-key',
      label: 'API Key',
      element: () => {
        return (
          <Section>
            <ApiKeyTab />
          </Section>
        )
      }
    },
    {
      path: 'ssh-keys',
      label: 'SSH Keys',
      element: () => {
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
