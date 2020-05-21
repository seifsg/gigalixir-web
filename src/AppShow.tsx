import React from 'react'
import { withRouter } from 'react-router'
import Charts from './Charts'
import { ReduxState } from 'ra-core'
import { push as routerPush } from 'react-router-redux'
import compose from 'recompose/compose'
import { withStyles } from '@material-ui/core/styles'
import { ShowController } from 'react-admin'
import { connect } from 'react-redux'
import _ from 'lodash/fp'
import { CorrectedReduxState } from './CorrectedReduxState'
import AppScaleDialog from './AppScaleDialog'
import { StyledTab, StyledTabs } from './Tabs'
import { App } from './api/apps'
import { User } from './api/users'
import Page from './Page'
import Section from './Section'
import Fields from './Fields'
import Field from './Field'
import Bash from './Bash'
import DialogButton from './DialogButton'
import Loading from './Loading'
import ComingSoon from './ComingSoon'

const styles = {}

interface ShowProps {
  id: string
  basePath: string
  resource: string
}


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
  isLoading: boolean
  profile: User
  app: App
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
      // if tab is not found, or is empty
      if (this.props.app.replicas > 0) {
        // if there are replicas, go to the Dashboard tab
        return 1
      }

      // otheriwse, go to the Setup tab
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
      //
      // do not use isLoading here. it causes an infinite loop.
      // 1. loading component is displayed
      // 2. once everything is loaded, tabs are displayed
      // 3. one tab fetches stats which sets loading=true again
      // 4. Chart is destroyed and we go back to step 1
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
                  <DialogButton label="Scale">
                    {close => <AppScaleDialog app={app} close={close} />}
                  </DialogButton>
                </Fields>
              </Section>
              <Charts id={id} />
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
          return (
            <Section>
              <ComingSoon />
            </Section>
          )
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
                  {(controllerProps: { record: App; isLoading: boolean }) => {
                    const app = controllerProps.record
                    return (
                      <EnhancedSetupOrShowLayout
                        app={app}
                        profile={profile}
                        tabs={tabs}
                        isLoading={controllerProps.isLoading}
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

function mapStateToProps(
  state: ReduxState & CorrectedReduxState,
  props: Props
) {
  return {
    isLoading: state.admin.loading > 0,
    version: state.admin.ui.viewVersion
  }
}

const EnhancedSetupOrShowLayout = compose<Props & EnhancedProps, Props>(
  withRouter,
  connect(mapStateToProps, {
    push: routerPush
  })
)(SetupOrShowLayout)

export default withStyles(styles)(AppShow)
