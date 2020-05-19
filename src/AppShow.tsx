import { withRouter } from 'react-router'
import FormHelperText from '@material-ui/core/FormHelperText'
import TextField from '@material-ui/core/TextField'
import Button from '@material-ui/core/Button'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import { push as routerPush } from 'react-router-redux'
import {
  WrappedFieldProps,
  reduxForm,
  Field as FormField,
  InjectedFormProps,
  SubmissionError
} from 'redux-form'
import compose from 'recompose/compose'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import React, { FunctionComponent } from 'react'
import { Query, ShowController } from 'react-admin'
import { connect } from 'react-redux'
import _ from 'lodash/fp'
import { FailureCallback, SuccessCallback, crudUpdate } from './crudUpdate'
import { extractError } from './errorSagas'
import { point, Stats } from './api/stats'
import { StyledTab, StyledTabs } from './Tabs'
import { App } from './api/apps'
import { User } from './api/users'
import Chart, { ChartPoint } from './Chart'
import logger from './logger'
import Page from './Page'
import Section from './Section'
import Fields from './Fields'
import Field from './Field'
import Bash from './Bash'
import DialogButton, { CloseFunction } from './DialogButton'
import Loading from './Loading'
import ComingSoon from './ComingSoon'

const styles = {}

interface ShowProps {
  id: string
  basePath: string
  resource: string
}

const chartStyles = createStyles({
  loading: {
    marginTop: 40
  },
  chartSection: {
    display: 'flex',
    // this is paired with the child's padding
    // to produce space between elements
    marginLeft: -20,
    marginRight: -20
  }
})

interface ChartsProps extends WithStyles<typeof chartStyles> {
  id: string
}
interface Error {
  message: string
}
const formatStatsPointForChart = (p: point): ChartPoint => {
  const [x] = p
  const [, y] = p
  if (x === null) {
    throw new Error('data point x can not be null')
  }
  return {
    x,
    y
  }
}
const formatStatsForChart = (data: point[]): ChartPoint[] =>
  data.map(formatStatsPointForChart)

const toMegabytes = (data: ChartPoint[]): ChartPoint[] =>
  data.map(
    (p: ChartPoint): ChartPoint => {
      let { x: time, y: value } = p
      if (value !== null) {
        value /= 1000000 // convert to megabytes
      }
      return { x: time, y: value }
    }
  )

export const Charts: React.FunctionComponent<ChartsProps> = (
  props
): React.ReactElement => {
  const { classes, id } = props
  return (
    <Query type="GET_ONE" resource="stats" payload={{ id }}>
      {({
        data,
        loading,
        error
      }: {
        data: Stats
        loading: boolean
        error: Error
      }): React.ReactElement => {
        if (loading) {
          return (
            <div className={classes.loading}>
              <Loading />
            </div>
          )
        }
        if (error) {
          return (
              <div>Error: {error.message}</div>
          )
        }
        return (
          <div className={classes.chartSection}>
            <Chart
              data={formatStatsForChart(data.data.cpu)}
              title="CPU (Millicores)"
            />
            <Chart
              data={toMegabytes(formatStatsForChart(data.data.mem))}
              title="Memory (MB)"
            />
          </div>
        )
      }}
    </Query>
  )
}

const EnhancedCharts = withStyles(chartStyles)(Charts)

/* eslint-disable @typescript-eslint/no-explicit-any */
const required = (message = 'Required') => (value: any) =>
  value ? undefined : message
const number = (message = 'Must be a number') => (value: any) =>
  // eslint-disable-next-line no-restricted-globals
  value && isNaN(Number(value)) ? message : undefined
const minValue = (min: number, message = 'Too small') => (value: any) =>
  value && value < min ? message : undefined
const maxValue = (max: number, message = 'Too big') => (value: any) =>
  value && value > max ? message : undefined
/* eslint-enable @typescript-eslint/no-explicit-any */

const validateSize = [
  required(),
  number(),
  minValue(0.2, 'Must be at least 0.2'),
  maxValue(16, 'Please contact enterprise@gigalixir.com to scale above 16.')
]
const validateReplicas = [
  number(),
  minValue(0, 'Must be non-negative'),
  maxValue(16, 'Please contact enterprise@gigalixir.com to scale above 16.')
]

const renderTextField = ({ type }: { type: 'number' | 'input' }) => ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: {
  label: string
} & WrappedFieldProps) => {
  return (
    <TextField
      type={type}
      label={label}
      placeholder={label}
      error={touched && invalid}
      helperText={touched && error}
      {...input}
      {...custom}
    />
  )
}

const renderError = ({
  label,
  input,
  meta: { touched, invalid, error },
  ...custom
}: {
  label: string
} & WrappedFieldProps) => {
  if (error) {
    return (
      <DialogContent>
        <FormHelperText error>{error}</FormHelperText>
      </DialogContent>
    )
  }
  return <span />
}

const renderSizeField = renderTextField({ type: 'input' })
const renderReplicasField = renderTextField({ type: 'number' })

interface ScaleProps {
  close: CloseFunction
  app: App
}
interface FormData {
  size: string
  replicas: string
}
interface EnhancedScaleProps extends InjectedFormProps<FormData> {
  scale: (
    values: App,
    previous: App,
    onSuccess: SuccessCallback,
    onFailure: FailureCallback
  ) => void
}
const AppScale: FunctionComponent<ScaleProps & EnhancedScaleProps> = props => {
  const { pristine, invalid, close, app, scale, handleSubmit } = props
  const onCancel = () => {
    close()
  }
  const onSubmit = ({ size, replicas }: FormData) => {
    // Do we need to do something like this instead?
    // handleBlur = event => {
    /**
     * Necessary because of a React bug on <input type="number">
     * @see https://github.com/facebook/react/issues/1425
     */
    // const numericValue = isNaN(parseFloat(event.target.value))
    //     ? null
    //     : parseFloat(event.target.value);
    // this.props.onBlur(numericValue);
    // this.props.input.onBlur(numericValue);
    // };

    const newApp = {
      ...app,
      size: size ? parseFloat(size) : app.size,
      replicas: replicas ? parseInt(replicas) : app.replicas
    }
    return new Promise((resolve, reject) => {
      const failureCallback: FailureCallback = ({ payload: { errors } }) => {
        reject(
          new SubmissionError({
            form: extractError(errors, ''),
            size: extractError(errors, 'size'),
            replicas: extractError(errors, 'replicas')
          })
        )
      }
      scale(
        newApp,
        app,
        () => {
          close()
          resolve(newApp)
        },
        failureCallback
      )
    })
  }
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogTitle id="form-dialog-title">Scale</DialogTitle>
      <FormField name="form" component={renderError} />
      <DialogContent>
        <FormField
          validate={validateSize}
          component={renderSizeField}
          name="size"
          label="Size"
        />
      </DialogContent>
      <DialogContent>
        <FormField
          validate={validateReplicas}
          component={renderReplicasField}
          name="replicas"
          label="Replicas"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          Cancel
        </Button>
        <Button type="submit" disabled={invalid || pristine} color="primary">
          Save
        </Button>
      </DialogActions>
    </form>
  )
}

const scaleApp_ = (
  values: App,
  previousValues: App,
  successCallback: SuccessCallback,
  failureCallback: FailureCallback
) => {
  logger.debug('scaleApp')
  const basePath = ''
  const redirectTo = ''
  // this needs to be refresh=true in this case because otherwise, the app data in the redux store gets wiped out.
  // here is what happens
  // 1. fetch.ts calls the dataProvider
  // 2. fetch.ts uses the result of the dataProvider and sends a CRUD_UPDATE_SUCCESS action with the response
  // 3. the problem is the response isn't a full App, it's just the new size and replicas
  // 4. reducers/data.ts processes this and replaces what is in the store rather than merging the updated fields
  //
  // refresh here tells somenoe to refetch the App to get the new values so everything is right again.
  // TODO: change scale endpoint to return a full app
  const refresh = true
  return crudUpdate(
    'apps',
    values.id,
    values,
    previousValues,
    basePath,
    redirectTo,
    refresh,
    successCallback,
    failureCallback
  )
}

const EnhancedAppScale = compose<ScaleProps & EnhancedScaleProps, ScaleProps>(
  connect(
    (state, ownProps: ScaleProps) => ({
      initialValues: {
        size: `${ownProps.app.size}`,
        replicas: `${ownProps.app.replicas}`
      }
    }),
    {
      scale: scaleApp_
    }
  ),
  reduxForm({
    form: 'scaleApp'
  })
)(AppScale)

const Setup = (props: { profile: User; app: App }) => {
  const {
    profile: { email, apiKey },
    app: { id }
  } = props
  return (
    <Section>
      <h4>Prepare Your App</h4>
      <div>
        Follow the instructions on{' '}
        <a href="http://gigalixir.readthedocs.io/en/latest/main.html#modifying-an-existing-app-to-run-on-gigalixir">
          how to modify an existing app to run on Gigalixir
        </a>
        .
      </div>
      <div>
        Or if you prefer video, watch{' '}
        <a href="https://gigalixir.readthedocs.io/en/latest/main.html#screencast">
          {' '}
          Deploying with Gigalixir
        </a>
        .
      </div>
      <div>
        If you run into issues, feel free to{' '}
        <a href="mailto:help@gigalixir.com">contact us</a>. Or if you point us
        to your source code, we're happy to do the onboarding for you.
      </div>
      <h4>Deploy</h4>
      <Bash>
        <div>
          git remote add gigalixir https://{email}:{apiKey}
          @git.gigalixir.com/{id}.git
        </div>
        <div>git push gigalixir master</div>
      </Bash>

      <div>
        After a minute, visit{' '}
        <a href={`https://${id}.gigalixirapp.com/`}>
          https://{id}.gigalixirapp.com/
        </a>
      </div>
      <h4>Install the command-line interface</h4>
      <Bash>
        <div>sudo pip install gigalixir --ignore-installed six</div>
        <div>gigalixir --help</div>
        <div>gigalixir login</div>
      </Bash>
      <h4>What's next?</h4>
      <ul>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#how-to-provision-a-free-postgresql-database">
            Create a database
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#logging">
            Tail logs
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#remote-console">
            Remote console
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#remote-observer">
            Remote observer
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#migrations">
            Run migrations
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#hot-upgrade">
            Hot upgrade
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/main.html#rollback">
            Rollback
          </a>
        </li>
        <li>
          <a href="http://gigalixir.readthedocs.io/en/latest/index.html">
            ...and more
          </a>
        </li>
      </ul>
    </Section>
  )
}

interface Props {
  profile: User
  app?: App
  tabs: {
    path: string
    label: string
    element: (
      profile: User,
      app: App,
      classes: Record<keyof typeof styles, string>
    ) => JSX.Element
  }[]
}

interface EnhancedProps {
  match: {
    params: {
      tab: string
    }
  }
  push: (url: string) => void
}

// TODO: I kinda hate that record is optional here, but otherwise, typescript
// forces us to put dummy parameters where this component is used below.
// This is because react-admin injects the record for us by cloning the element.
// I looked at react-admin's TextField component to see how they handle it and they
// just make it optional like this so we copy it.
class SetupOrShowLayout extends React.Component<
  Props & EnhancedProps,
  { open: boolean }
> {
  constructor(props: Props & EnhancedProps) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    const tabName = this.props.tabs[newValue].path
    const { app } = this.props
    if (!app) {
      // can this happen?
    } else {
      this.props.push(`/apps/${app.id}/${tabName}`)
    }
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
    const { profile, app, tabs } = this.props
    if (!profile) {
      // TODO: this doesn't seem like the right way to handle loading states
      // both profile and app start out as undefined and then later get filled in
      // maybe in random order
      return <Loading />
    }
    if (!app) {
      // it's possible that even after loading, app is not found
      return <div>Oops, no record found. Please contact help@gigalixir.com</div>
    }
    return (
      <div>
        <StyledTabs
          value={this.selectedTabIndex()}
          onChange={this.handleTabChange}
        >
          {tabs.map(x => (
            <StyledTab key={x.label} label={x.label} />
          ))}
        </StyledTabs>
        {this.selectedTab().element(profile, app, {})}
      </div>
    )
  }
}

interface AppShowProps {
  id: string
  version: number
  match: {
    params: {
      id: string
    }
  }
}
class AppShow extends React.Component<AppShowProps> {
  public render() {
    const {
      match: {
        params: { id }
      }
    } = this.props
    const tabs = [
      {
        path: 'setup',
        label: 'Setup',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Setup profile={profile} app={app} />
        }
      },
      {
        path: 'dashboard',
        label: 'Dashboard',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return (
            <div>
              <Section>
                <Fields>
                  <Field label="Name">{app.id}</Field>
                  <Field label="Size">{app.size}</Field>
                  <Field label="Replicas">{app.replicas}</Field>
                  <Field label="Cloud">{app.cloud}</Field>
                  <Field label="Region">{app.region}</Field>
                  <Field label="Stack">{app.stack}</Field>
                  <DialogButton>
                    {close => <EnhancedAppScale app={app} close={close} />}
                  </DialogButton>
                </Fields>
              </Section>
              <EnhancedCharts id={id} />
            </div>
          )
        }
      },
      {
        path: 'databases',
        label: 'Databases',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      },
      {
        path: 'activity',
        label: 'Activity',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      },
      {
        path: 'access',
        label: 'Access Permissions',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      },
      {
        path: 'configuration',
        label: 'Configuration',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      },
      {
        path: 'domains',
        label: 'Domains',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      },
      {
        path: 'drains',
        label: 'Log Drains',
        element: (
          profile: User,
          app: App,
          classes: Record<keyof typeof styles, string>
        ) => {
          return <Section><ComingSoon/></Section>
        }
      }
    ]
    return (
      <Page title={id}>
        <div>
          <ShowController resource="profile" id="ignored" basePath="/login">
            {(profileControllerProps: { record: User }) => {
              const profile = profileControllerProps.record
              return (
                <ShowController resource="apps" id={id} basePath="/login">
                  {(controllerProps: { record: App }) => {
                    const app = controllerProps.record
                    return (
                      <EnhancedSetupOrShowLayout
                        app={app}
                        profile={profile}
                        tabs={tabs}
                      />
                    )
                  }}
                </ShowController>
              )
            }}
          </ShowController>
        </div>
      </Page>
    )
  }
}

const EnhancedSetupOrShowLayout = compose<Props & EnhancedProps, Props>(
  withRouter,
  connect(null, {
    push: routerPush
  })
)(SetupOrShowLayout)

export default withStyles(styles)(AppShow)
