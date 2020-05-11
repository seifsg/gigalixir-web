import { Theme, createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import React from 'react'
import { Authenticated, crudGetOne as crudGetOneAction } from 'react-admin'
import { connect } from 'react-redux'
import compose from 'recompose/compose'
import { ReduxState } from 'ra-core'
import { User } from './api/users'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

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
  title: {
    borderBottom: '2px solid rgba(0,0,0,0.1)',
    paddingBottom: '20px',
  },
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
    marginTop: "40px",
    display: "flex",
    border: "1px solid rgba(0,0,0,0.1)",
    padding: "20px",
  }
})

interface Props {
  id: string
  resource: string
  children: (record: User, classes: Record<keyof typeof styles, string>) => JSX.Element
}

interface EnhancedProps extends WithStyles<typeof styles> {
  crudGetOne: Function
  record: User
  isLoading: boolean
  version: number
}

type State = {
  tabValue: number
}

class ProfileShow extends React.Component<Props & EnhancedProps, State> {
  constructor(props: Props & EnhancedProps) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
    this.state = {tabValue: 0}
  }

  componentDidMount() {
    this.updateData();
  }

  componentWillReceiveProps(nextProps: Props & EnhancedProps) {
      if (
          this.props.id !== nextProps.id ||
          nextProps.version !== this.props.version
      ) {
        this.updateData(nextProps.resource, nextProps.id);
      }
  }

  updateData(resource = this.props.resource, id = this.props.id) {
    this.props.crudGetOne(resource, id, '/login')
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    this.setState({tabValue: newValue})
  }

  render() {
    const { id, isLoading, resource, crudGetOne, record, children, classes } = this.props
    const { tabValue } = this.state

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
        <div>
          <h3 className={classes.title}>Profile</h3>
          <StyledTabs value={tabValue} onChange={this.handleTabChange}>
            <StyledTab label="My Account" />
            <StyledTab label="API Key" />
            <StyledTab label="SSH Keys" />
          </StyledTabs>

          {
            children(record, classes)
          }
        </div>
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
  resource: 'profile',
  children: (record: User, classes: Record<keyof typeof styles, string>) => {
    return <Paper className={classes.fields} elevation={0}>
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
          <div className={classes.value}>{record.credit_cents}</div>
        </div>
      </Paper>
  }
}

export default EnhancedProfileShow
