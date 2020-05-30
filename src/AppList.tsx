import compose from 'recompose/compose'
import { Datagrid, NumberField, TextField } from 'react-admin'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { connect } from 'react-redux'
import { push as routerPush } from 'react-router-redux'
import React from 'react'

import AppCreateDialog from './AppCreateDialog'
import DialogButton, { CloseFunction } from './DialogButton'
import List from './List'
import Page from './Page'
import Section from './Section'

const styles = createStyles({})

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
interface Props {
  id: string
  basePath: string
  resource: string
}

type EnhancedProps = WithStyles<typeof styles>

// setting props properly here is hard because 1) there are a ton of props that react-admin injects for us
// and 2) any props defined here need to be specified below, but we would just be putting dummy values in
// the real values are injected by redux-form, react-admin, etc. need to find a better way to do this.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
class MaybeEmptyDatagrid extends React.Component<any> {
  private static createDialog(close: CloseFunction) {
    return <AppCreateDialog close={close} />
  }

  public render() {
    const { ...sanitizedProps } = this.props
    const { loadedOnce, total, ids } = sanitizedProps

    // if we use isLoading here instead of loadedOnce, then it basically shows
    // the datagrid after hitting the create dialog save button for a split second.
    // that's because isLoading is a global counter that is used anytime
    // there is a request in flight so when an app create action is being dispatched
    // isLoading becomes true and the background behind the modal flips over
    // and shows the list view which is weird. our plan is to basically stop
    // using isLoading i.e. state.admin.loading entirely if possible
    // and start using a specific loading variable for each action or ui
    // element. we didn't dig into exactly how to do that here because
    // loadedOnce seems to take care of our use cases, but we will eventually
    // want to do that. Query and Mutation looked promising, but this section here
    // gets it's data from ListController which is harder to hook into. We will
    // probably need to eject ListController to do this and dispatch out own
    // actions to set loading states for each scenario.
    const shouldShowEmptyView = loadedOnce && (ids.length === 0 || total === 0)

    // just inline the styles here since they aren't really going
    // to be reused much i think and it's a small section so it
    // doesn't clutter things up much. and extracting them is
    // such a hassle right now
    //
    // Obsolete now that we use loadedOnce instead of isLoading, but leaving it
    // here because it's an important lesson to remember.
    // We use display block/none instead of rendering the sections conditionally
    // because we have state that we don't want cleared out. For example, DialogButton
    // holds state about whether the dialog is open. If shouldShowEmptyView toggles
    // for some reason, then the dialog loses it's state and closes. This happens
    // for example, if there is some weird shift in loading state which can happen
    // if we make shouldShowEmptyVIew dependent on isLoading which is a global
    // loading counter that is incremented when the app create save button is clicked.
    // this results in the dialog closing and no errors shown when there is a
    // failure.
    if (shouldShowEmptyView) {
      return (
        <Section>
          <div style={{ textAlign: 'center' }}>
            <div style={{ marginBottom: 20 }}>No apps yet.</div>
            <DialogButton label="Create">
              {MaybeEmptyDatagrid.createDialog}
            </DialogButton>
          </div>
        </Section>
      )
    }
    return (
      <div>
        <DialogButton label="Create">
          {MaybeEmptyDatagrid.createDialog}
        </DialogButton>
        <div style={{ marginTop: 20 }}>
          <Datagrid elevation={0} rowClick="show" {...sanitizedProps}>
            <TextField label="Name" source="id" sortable={false} />
            <NumberField source="size" sortable={false} />
            <NumberField source="replicas" sortable={false} />
            <TextField source="cloud" sortable={false} />
            <TextField source="region" sortable={false} />
            <TextField source="stack" sortable={false} />
          </Datagrid>
        </div>
      </div>
    )
  }
}

// TODO: is it considered bad form to have a connected component inside a connected component?
// actually, is AppList even a connected component? does react-admin do that?
const ConnectedMaybeEmptyDatagrid = connect(null, {
  push: routerPush
})(MaybeEmptyDatagrid)

const AppList = (props: Props & EnhancedProps) => {
  return (
    <Page title="My Apps">
      <List
        filters={null}
        actions={null}
        exporter={false}
        title="My Apps"
        pagination={null}
        bulkActions={false}
        {...props}
      >
        <ConnectedMaybeEmptyDatagrid />
      </List>
    </Page>
  )
}

const EnhancedAppList = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(AppList)

export default EnhancedAppList
