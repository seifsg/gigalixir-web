import React, { Component } from 'react'
import { Logout, Layout, AppBar, crudGetOne, UserMenu, MenuItemLink } from 'react-admin'
import { connect } from 'react-redux'
import AccountCircle from '@material-ui/icons/AccountCircle'

class MyUserMenuView extends Component<{
  getOne: (resource: string, id: string, basePath: string, refresh: boolean) => void
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
      '/profile',
      // Whether to refresh the current view. I don't need it here
      false,
    )
  }

  public render() {
    return (
      <UserMenu label="Profile" logout={<Logout/>}>
        <MenuItemLink to="/profile" primaryText="Profile" leftIcon={<AccountCircle />} />
      </UserMenu>
    )
  }
}

const mapStateToProps = (state: { admin: { resources: { profile: { data: { profile: {} } } } } }) => {
  const resource = 'profile'
  const id = 'profile'
  const profileState = state.admin.resources[resource]

  return {
    profile: profileState ? profileState.data[id] : null,
  }
}

const MyUserMenu = connect(
  mapStateToProps,
  { getOne: crudGetOne },
)(MyUserMenuView)

const MyAppBar = (props: {}) => <AppBar {...props} userMenu={<MyUserMenu />} />
const MyLayout = (props: {}) => <Layout {...props} appBar={MyAppBar} />

export default MyLayout
