import React from 'react'
import { Admin, Resource } from 'react-admin'
import { BrowserRouter, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { AppCreate, AppList, AppShow } from './apps'
import authProvider from './authProvider'
import dataProvider from './dataProvider'
import MyLoginPage from './MyLoginPage'
import ProfileShow from './ProfileShow'
import RegisterPage from './RegisterPage'
import NotifyPage from './NotifyPage'
import PasswordResetPage from './PasswordResetPage'
import PasswordSetPage from './PasswordSetPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import errorSagas from './errorSagas'

const customRoutes = [
  <Route path="/profile" component={ProfileShow} />,
  <Route exact path="/register" component={RegisterPage} noLayout />,
  <Route exact path="/notify" component={NotifyPage} noLayout />,
  <Route exact path="/password/reset" component={PasswordResetPage} noLayout />,
  <Route exact path="/password/set" component={PasswordSetPage} noLayout />,
  <Route exact path="/confirmation/resend" component={ConfirmationResendPage} noLayout />
]

const App = () => (
  <BrowserRouter>
    <Admin
      customSagas={[errorSagas]}
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
