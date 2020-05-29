import _ from 'lodash/fp'
import { ReduxState } from 'ra-core'
import React from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import { push as routerPush } from 'react-router-redux'
import compose from 'recompose/compose'
import { App } from './api/apps'
import { User } from './api/users'
import { CorrectedReduxState } from './CorrectedReduxState'
import Loading from './Loading'
import { StyledTab, StyledTabs } from './Tabs'

const styles = {}

interface Props {
  isLoading: boolean
  version: number
  profile: User
  app: App
  tabs: {
    path: string
    label: string
    element: (
      profile: User,
      app: App,
      classes: Record<keyof typeof styles, string>,
      version: number
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
  public constructor(props: Props & EnhancedProps) {
    super(props)
    this.handleTabChange = this.handleTabChange.bind(this)
  }

  private handleTabChange(event: React.ChangeEvent<{}>, newValue: number) {
    const { tabs, app, push } = this.props
    const tabName = tabs[newValue].path
    if (!app) {
      // can this happen?
    } else {
      push(`/apps/${app.id}/${tabName}`)
    }
  }

  private selectedTab() {
    const { tabs } = this.props
    const index = this.selectedTabIndex()
    return tabs[index]
  }

  private selectedTabIndex() {
    const { match, tabs, app } = this.props
    const index = _.findIndex(tab => {
      return tab.path === match.params.tab
    }, tabs)

    if (index === -1) {
      // if tab is not found, or is empty
      if (app.replicas > 0) {
        // if there are replicas, go to the Dashboard tab
        return 1
      }

      // otheriwse, go to the Setup tab
      return 0
    }

    return index
  }

  public render() {
    const { profile, app, tabs, version } = this.props
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
        {this.selectedTab().element(profile, app, {}, version)}
      </div>
    )
  }
}

function mapStateToProps(state: ReduxState & CorrectedReduxState) {
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

export default EnhancedSetupOrShowLayout
