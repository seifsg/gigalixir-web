import React, { Component } from 'react'
import {
  Layout,
  AppBar,
  crudGetOne,
} from 'react-admin'
import { connect } from 'react-redux'
import AccountCircle from '@material-ui/icons/AccountCircle'
import { AppShow, AppHeader, AppSideBar } from './apps'


class MyUserMenuView extends Component<{
  getOne: (
    resource: string,
    id: string,
    basePath: string,
    refresh: boolean
  ) => void
  profile: {} | null
}> {
  public componentDidMount() {
    this.fetchProfile()
  }

  private fetchProfile = () => {
    const { getOne } = this.props
    getOne(
      // The resource
      'profile',
      // The id of the resource item to fetch
      'profile',
      // The base path. Mainly used on failure to fetch the data
      '/login',
      // Whether to refresh the current view. I don't need it here
      false
    )
  }

  public render() {
    return (
      <div>
       </div>
    )
  }
}

const mapStateToProps = (state: {
  admin: { resources: { profile: { data: { profile: {} } } } }
}) => {
  const resource = 'profile'
  const id = 'profile'
  const profileState = state.admin.resources[resource]

  return {
    profile: profileState ? profileState.data[id] : null
  }
}

const MyUserMenu = connect(mapStateToProps, { getOne: crudGetOne })(
  MyUserMenuView
)

const MyAppBar = (props: {}) => <AppBar {...props} userMenu={<MyUserMenu />} />
// const MyLayout = (props: {}) => <Layout {...props} appBar={MyAppBar} />
const MyLayout = (props: {}) => <Layout {...props} title={'test'} appBar={AppHeader} sidebar={AppSideBar} />;

export default MyLayout
