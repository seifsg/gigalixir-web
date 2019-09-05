import React from 'react'
import { Admin, Resource, Login } from 'react-admin'
import authProvider from './authProvider'
import dataProvider from './dataProvider'
import { AppList, AppCreate, AppShow } from './apps'

const MyLoginPage = () => <Login backgroundImage="" />

const App = () => (
  <Admin loginPage={MyLoginPage} authProvider={authProvider} dataProvider={dataProvider}>
    <Resource name="apps" show={AppShow} list={AppList} create={AppCreate} />
  </Admin>
)

export default App
