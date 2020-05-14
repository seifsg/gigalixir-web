import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import _ from 'lodash/fp'
import { push as routerPush } from 'react-router-redux'
import classNames from 'classnames'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { Authenticated, crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { ReduxState } from 'ra-core'
import { User } from './api/users'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import PaymentMethod from './PaymentMethod'
import UpdatePaymentMethod from './UpdatePaymentMethod'
import Upgrade from './Upgrade'
import { CorrectedReduxState } from './CorrectedReduxState'
import Page from './Page'

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}


const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 80,
      width: "100%",
      height: "1px",
      backgroundColor: "rgba(0,0,0,0.1)"
    }
  }
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));

const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      textTransform: "none",
      color: "#000",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing.unit,
      "&:focus": {
        opacity: 1
      }
    }
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

const styles = createStyles({
  label: {
    color: "rgba(0,0,0,0.5)",
    paddingBottom: '5px',
  },
  value: {
  },
  field: {
    flex: 1,
  },
  fields: {
    display: "flex",
  },
  section: {
    marginTop: "40px",
    border: "1px solid rgba(0,0,0,0.1)",
    padding: "20px",
  }
})

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
    element: (record: User, classes: Record<keyof typeof styles, string>) => JSX.Element

  }[]
}

interface EnhancedProps extends WithStyles<typeof styles> {
  crudGetOne: Function
  push: (url: string) => void
  record: User
  isLoading: boolean
  version: number
}

type State = {
}

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
        this.updateData();
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
    this.props.push('/account/' + tabName)
  }

  selectedTab() {
    let index = this.selectedTabIndex()
    return this.props.tabs[index]
  }

  selectedTabIndex() {
    const index = _.findIndex((tab) => {
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
      return <div>Loading</div>
    }

    return (
      <Authenticated>
        <Page title="My Account">
          <div>
            <StyledTabs value={this.selectedTabIndex()} onChange={this.handleTabChange}>
              {
                tabs.map(x => <StyledTab key={x.label} label={x.label} />)
              }
            </StyledTabs>
            { this.selectedTab().element(record, classes) }
          </div>
        </Page>
      </Authenticated>
    )
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
      path: "profile",
      label: "Profile",
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        var formatter = new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD',
        });

        return <div>
          <Paper className={classNames(classes.fields, classes.section)} elevation={0}>
            <div className={classes.field}>
              <div className={classes.label}>Email</div>
              <div className={classes.value}>{record.email}</div>
            </div>
            <div className={classes.field}>
              <div className={classes.label}>Tier</div>
              <div className={classes.value}>{record.tier}</div>
            </div>
            <div className={classes.field}>
              <div className={classes.label}>Credits</div>
          <div className={classes.value}>{formatter.format(record.credit_cents / 100.0)}</div>
            </div>
          </Paper>
          <Upgrade className={classes.section} record={record}/>
        </div>
      }
    },
    {
      path: "payment-method",
      label: "Payment Method",
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return <div>
          <PaymentMethod className={classes.section} />
          <UpdatePaymentMethod className={classes.section} record={record} />
        </div>
      }
    },
    {
      path: "api-key",
      label: "API Key",
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return <Paper className={classes.section} elevation={0}>Coming Soon</Paper>
      }
    },
    {
      path: "ssh-keys",
      label: "SSH Keys",
      element: (record: User, classes: Record<keyof typeof styles, string>) => {
        return <Paper className={classes.section} elevation={0}>Coming Soon</Paper>
      }
    }
  ]
}

export default EnhancedProfileShow
