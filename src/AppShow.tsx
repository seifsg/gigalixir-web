import Button from '@material-ui/core/Button'
import { withStyles } from '@material-ui/core/styles'
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer'
import React from 'react'
import {
  crudUpdate,
  Edit,
  Loading,
  NumberInput,
  Query,
  SaveButton,
  ShowController,
  SimpleForm,
  SimpleShowLayout,
  TextField,
  Toolbar
} from 'react-admin'
import { connect } from 'react-redux'
import _ from 'lodash/fp'
import { App } from './api/apps'
import { User } from './api/users'
import { Stats } from './api/stats'
import Chart from './Chart'
import logger from './logger'
import Page from './Page'
import Section from './Section'
import Bash from './Bash'

interface ShowProps {
  id: string
  basePath: string
  resource: string
}
interface ChartsProps {
  id: string
}
interface Error {
  message: string
}
export const Charts: React.FunctionComponent<ChartsProps> = (
  props
): React.ReactElement => {
  const { id } = props
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
          return <Loading />
        }
        if (error) {
          return <div>Error: {error.message}</div>
        }
        return (
          <div>
            <Chart data={data.data.mem} title="Memory (MB)" />
            <Chart data={data.data.cpu} title="CPU (Millicores)" />
          </div>
        )
      }}
    </Query>
  )
}

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

interface ScaleProps {
  id: string
  basePath: string
  resource: string
  onSave: () => void
}
const AppScale = (props: ScaleProps) => {
  const { onSave, ...sanitizedProps } = props
  return (
    <Edit title=" " {...sanitizedProps}>
      <SimpleForm
        redirect={false}
        // AppScaleToolbar gets cloned so all the props here except onSave are really just to make the compiler happy..
        // sucks.
        toolbar={
          <AppScaleToolbar
            onSave={onSave}
            basePath=""
            redirect=""
            handleSubmit={() => {}}
          />
        }
      >
        <NumberInput source="size" validate={validateSize} />
        <NumberInput source="replicas" validate={validateReplicas} />
      </SimpleForm>
    </Edit>
  )
}

const scaleApp_ = (values: App, basePath: string, redirectTo: string) => {
  logger.debug('scaleApp')
  logger.debug(redirectTo)
  logger.debug(basePath)
  return crudUpdate('apps', values.id, values, undefined, basePath, redirectTo)
}

interface AppScaleToolbarProps {
  handleSubmit: (f: (values: App) => void) => void
  basePath: string
  redirect: string
  scaleApp: (values: App, basePath: string, redirect: string) => void
  onSave: () => void
}
const AppScaleToolbar_ = (props: AppScaleToolbarProps) => {
  const handleClick = () => {
    logger.debug('handleClick')
    const { handleSubmit, basePath, redirect, scaleApp, onSave } = props

    return handleSubmit((values: App) => {
      logger.debug(JSON.stringify(values))
      logger.debug('handleSubmit')
      onSave()
      scaleApp(values, basePath, redirect)
    })
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { scaleApp, onSave, ...sanitizedProps } = props

  return (
    <Toolbar {...sanitizedProps}>
      <SaveButton handleSubmitWithRedirect={handleClick} />
    </Toolbar>
  )
}
const AppScaleToolbar = connect(undefined, { scaleApp: scaleApp_ })(
  AppScaleToolbar_
)

const Setup = (props: { profile: User; app: App }) => {
  const {
    profile: { email, apiKey },
    app: { id }
  } = props
  return (
    <Section>
      <div>
        <div>
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
            <a href="mailto:help@gigalixir.com">contact us</a>. Or if you point
            us to your source code, we're happy to do the onboarding for you.
          </div>
        </div>
        <div>
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
            <a target="_blank" href={`https://${id}.gigalixirapp.com/`}>
              https://{id}.gigalixirapp.com/
            </a>
          </div>
        </div>
        <div>
          <h4>Install the command-line interface</h4>
          <Bash>
            <div>sudo pip install gigalixir --ignore-installed six</div>
            <div>gigalixir --help</div>
            <div>gigalixir login</div>
          </Bash>
        </div>
        <div>
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
        </div>
      </div>
    </Section>
  )
}

// TODO: I kinda hate that record is optional here, but otherwise, typescript
// forces us to put dummy parameters where this component is used below.
// This is because react-admin injects the record for us by cloning the element.
// I looked at react-admin's TextField component to see how they handle it and they
// just make it optional like this so we copy it.
class SetupOrShowLayout extends React.Component<
  { profile: User; app?: App },
  { open: boolean }
> {
  constructor(props: { profile: User; app?: App }) {
    super(props)
    this.state = { open: false }
  }

  render() {
    const toggleDrawer = (open: boolean) => (
      event: React.KeyboardEvent | React.MouseEvent
    ) => {
      if (
        event &&
        event.type === 'keydown' &&
        ((event as React.KeyboardEvent).key === 'Tab' ||
          (event as React.KeyboardEvent).key === 'Shift')
      ) {
        return
      }

      this.setState({ open })
    }

    const { profile, app } = this.props
    const { open } = this.state
    if (!profile) {
        // TODO: this doesn't seem like the right way to handle loading states
        // both profile and app start out as undefined and then later get filled in
        // maybe in random order
      return <div>Loading</div>
    }
    if (!app) {
        // it's possible that even after loading, app is not found
      return <div>Oops, no record found. Please contact help@gigalixir.com</div>
    }
    const version = _.get('version', app)
    const id = _.get('id', app)
    if (version === 2) {
      return <Setup profile={profile} app={app} />
    }
    return (
      <SimpleShowLayout {...this.props}>
        <Button
          onClick={toggleDrawer(true)}
          variant="contained"
          color="primary"
        >
          Scale
        </Button>
        <SwipeableDrawer
          anchor="right"
          open={open}
          onClose={toggleDrawer(false)}
          onOpen={toggleDrawer(true)}
        >
          <AppScale
            id={id}
            basePath="/apps"
            resource="apps"
            onSave={() => this.setState({ open: false })}
          />
        </SwipeableDrawer>
        <TextField source="id" />
        <TextField source="size" />
        <TextField source="replicas" />
        <TextField source="version" />
        <Charts id={id} />
      </SimpleShowLayout>
    )
  }
}

const styles = {
}

interface AppShowProps {
  id: string
  version: number
}
class AppShowBase extends React.Component<AppShowProps, { open: boolean }> {
  public constructor(props: AppShowProps) {
    super(props)
    this.state = { open: false }
  }

  public render() {
    const { id } = this.props
    return (
      <Page title={id}>
        <div>
          <ShowController resource="profile" id="ignored" basePath="/login">
            {(profileControllerProps: any) => {
              const profile = profileControllerProps.record
              return (
                <ShowController {...this.props}>
                  {(controllerProps: any) => {
                    const app = controllerProps.record
                    return <SetupOrShowLayout app={app} profile={profile} />
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
export const AppShow = withStyles(styles)(AppShowBase)
