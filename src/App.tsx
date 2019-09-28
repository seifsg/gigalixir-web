import React from 'react'
import { Admin, Resource } from 'react-admin'
import { BrowserRouter, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { AppCreate, AppList, AppShow } from './apps'
import authProvider from './authProvider'
import dataProvider from './dataProvider'
import MyLoginPage from './MyLoginPage'
import ProfileShow from './ProfileShow'

const customRoutes = [<Route key="profile" path="/profile" component={ProfileShow} />]

const App = () => (
  <BrowserRouter>
    <Admin
      customRoutes={customRoutes}
      appLayout={AppLayout}
      loginPage={MyLoginPage}
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <Resource name="apps" show={AppShow} list={AppList} create={AppCreate} />
      <Resource name="profile" />
    </Admin>
  </BrowserRouter>
)

export default App
