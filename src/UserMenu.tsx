import React, { Component } from 'react'
import { Logout, crudGetOne, UserMenu, MenuItemLink } from 'react-admin'
import { connect } from 'react-redux'
import AccountCircle from '@material-ui/icons/AccountCircle'

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
      'ignored',
      // The base path. Mainly used on failure to fetch the data
      '/login',
      // Whether to refresh the current view. I don't need it here
      false
    )
  }

  public render() {
    return (
      <UserMenu label="My Account" logout={<Logout />}>
        <MenuItemLink
          to="/account"
          primaryText="My Account"
          leftIcon={<AccountCircle />}
        />
      </UserMenu>
    )
  }
}

const mapStateToProps = (state: {
  admin: { resources: { profile: { data: { ignored: {} } } } }
}) => {
  const resource = 'profile'
  const id = 'ignored'
  const profileState = state.admin.resources[resource]

  return {
    profile: profileState ? profileState.data[id] : null
  }
}
const MyUserMenu = connect(mapStateToProps, { getOne: crudGetOne })(
  MyUserMenuView
)
export default MyUserMenu
