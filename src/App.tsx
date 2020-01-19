import React from 'react'
import { Admin, Resource } from 'react-admin'
import { BrowserRouter, Route } from 'react-router-dom'

import AppLayout from './layout'
import { AppCreate, AppList, AppShow } from './apps'
import authProvider from './providers/auth'
import dataProvider from './providers/data'
import Profile from './ProfileShow'
import {
  Login,
  Notify,
  PasswordReset,
  PasswordSet,
  ResendPage,
  Register
} from './pages'
import ConnectedSuccess from './components/SuccessPage'
import errorSagas from './errorSagas'

const customRoutes = [
  <Route path="/profile" component={Profile} />,
  <Route exact path="/register" component={Register} noLayout />,
  <Route exact path="/notify" component={Notify} noLayout />,
  <Route exact path="/password/reset" component={PasswordReset} noLayout />,
  <Route exact path="/password/set" component={PasswordSet} noLayout />,
  <Route exact path="/confirmation/resend" component={ResendPage} noLayout />,
  <Route exact path="/success" component={ConnectedSuccess} noLayout />
]

const App = () => (
  <BrowserRouter>
    <Admin
      customSagas={[errorSagas]}
      customRoutes={customRoutes}
      appLayout={AppLayout}
      loginPage={Login}
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <Resource name="apps" show={AppShow} list={AppList} create={AppCreate} />
      <Resource name="profile" />
    </Admin>
  </BrowserRouter>
)

export default App
