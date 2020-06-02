import { withStyles } from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import React, { FunctionComponent } from 'react'
import { ShowController } from 'react-admin'
import { App } from './api/apps'
import { User } from './api/users'
import AppScaleDialog from './AppScaleDialog'
import Bash from './Bash'
import Charts from './Charts'
import ComingSoon from './ComingSoon'
import ComingSoonDialog from './ComingSoonDialog'
import DialogButton from './DialogButton'
import Field from './Field'
import Fields from './Fields'
import Page from './Page'
import Permissions from './Permissions'
import Section from './Section'
import SetupOrShowLayout from './SetupOrShowLayout'

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
        <a href="https://gigalixir.readthedocs.io/en/latest/modify-app/index.html#modifying-an-existing-app-to-run-on-gigalixir">
          how to modify an existing app to run on Gigalixir
        </a>
        .
      </div>
      <div>
        Or if you prefer video, watch{' '}
        <a href="https://gigalixir.readthedocs.io/en/latest/intro.html#overview-screencast">
          {' '}
          Deploying with Gigalixir
        </a>
        .
      </div>
      <div>
        If you run into issues, feel free to{' '}
        <a href="mailto:help@gigalixir.com">contact us</a>. Or if you point us
        to your source code, we&apos;re happy to do the onboarding for you.
      </div>
      <h4>Deploy</h4>
      <Bash>
        <div>
          git remote add gigalixir https://{encodeURIComponent(email)}:
          {encodeURIComponent(apiKey)}
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
      <h4>What&apos;s next?</h4>
      <ul>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/database.html#how-to-provision-a-free-postgresql-database">
            Create a database
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/log.html#how-to-tail-logs">
            Tail logs
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/runtime.html#how-to-drop-into-a-remote-console">
            Remote console
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/runtime.html#how-to-launch-a-remote-observer">
            Remote observer
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/database.html#how-to-run-migrations">
            Run migrations
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/deploy.html#how-to-hot-upgrade-an-app">
            Hot upgrade
          </a>
        </li>
        <li>
          <a href="https://gigalixir.readthedocs.io/en/latest/deploy.html#how-to-rollback-an-app">
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

interface AppShowProps {
  id: string
  version: number
  match: {
    params: {
      id: string
    }
  }
}
const AppShow: FunctionComponent<AppShowProps> = ({
  version,
  match: {
    params: { id }
  }
}) => {
  const tabs = [
    {
      path: 'setup',
      label: 'Setup',
      element: (profile: User, app: App) => {
        return <Setup profile={profile} app={app} />
      }
    },
    {
      path: 'dashboard',
      label: 'Dashboard',
      element: (profile: User, app: App) => {
        const spacing = 10
        return (
          <div>
            <Section>
              <div
                style={{
                  display: 'flex',
                  marginLeft: -1 * spacing,
                  marginRight: -1 * spacing
                }}
              >
                <div style={{ paddingLeft: spacing, paddingRight: spacing }}>
                  <DialogButton label="Scale">
                    {close => <AppScaleDialog app={app} close={close} />}
                  </DialogButton>
                </div>
                <div style={{ paddingLeft: spacing, paddingRight: spacing }}>
                  <DialogButton label="Restart" disabled={app.replicas === 0}>
                    {close => <ComingSoonDialog close={close} />}
                  </DialogButton>
                </div>
                <div style={{ paddingLeft: spacing, paddingRight: spacing }}>
                  <DialogButton label="Delete">
                    {close => <ComingSoonDialog close={close} />}
                  </DialogButton>
                </div>
                <div style={{ paddingLeft: spacing, paddingRight: spacing }}>
                  <Button
                    href={`https://${app.id}.gigalixirapp.com/`}
                    variant="raised"
                    color="primary"
                    disabled={app.replicas === 0}
                  >
                    Open
                  </Button>
                </div>
              </div>
              <div style={{ marginTop: 20 }}>
                <Fields>
                  <Field label="Name">{app.id}</Field>
                  <Field label="Size">{app.size}</Field>
                  <Field label="Replicas">{app.replicas}</Field>
                  <Field label="Cloud">{app.cloud}</Field>
                  <Field label="Region">{app.region}</Field>
                  <Field label="Stack">{app.stack}</Field>
                </Fields>
              </div>
            </Section>
            <Charts id={id} />
          </div>
        )
      }
    },
    {
      path: 'databases',
      label: 'Databases',
      element: () => {
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
      element: () => {
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
        classes: Record<keyof typeof styles, string>,
        version_: number
      ) => {
        return (
          <Section>
            <Permissions id={app.id} version={version_} />
          </Section>
        )
      }
    },
    {
      path: 'configuration',
      label: 'Configuration',
      element: () => {
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
      element: () => {
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
      element: () => {
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
                    <SetupOrShowLayout
                      app={app}
                      profile={profile}
                      tabs={tabs}
                      isLoading={controllerProps.isLoading}
                      version={version}
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

export default withStyles(styles)(AppShow)
