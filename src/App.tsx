import { createMuiTheme } from '@material-ui/core/styles'
import React from 'react'
import { Admin, Resource } from 'react-admin'
import { BrowserRouter, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { AppList, AppShow } from './apps'
import authProvider from './authProvider'
import ConnectedSuccessPage from './components/SuccessPage'
import ConfirmationResendPage from './ConfirmationResendPage'
import dataProvider from './dataProvider'
import errorSagas from './errorSagas'
import MyLoginPage from './MyLoginPage'
import NotifyPage from './NotifyPage'
import PasswordResetPage from './PasswordResetPage'
import PasswordSetPage from './PasswordSetPage'
import ProfileShow from './ProfileShow'
import RegisterPage from './RegisterPage'
import TestPage from './TestPage'

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#fff"
    }
  }
})

const customRoutes = [
  <Route path="/apps/:id/:tab?" component={AppShow} />,
  <Route path="/account/:tab?" component={ProfileShow} />,
  <Route exact path="/test" component={TestPage} noLayout />,
  <Route exact path="/register" component={RegisterPage} noLayout />,
  <Route exact path="/notify" component={NotifyPage} noLayout />,
  <Route exact path="/password/reset" component={PasswordResetPage} noLayout />,
  <Route exact path="/password/set" component={PasswordSetPage} noLayout />,
  <Route
    exact
    path="/confirmation/resend"
    component={ConfirmationResendPage}
    noLayout
  />,
  <Route exact path="/success" component={ConnectedSuccessPage} noLayout />
]

const App = () => (
  <BrowserRouter>
    <Admin
      theme={theme}
      customSagas={[errorSagas]}
      customRoutes={customRoutes}
      appLayout={AppLayout}
      loginPage={MyLoginPage}
      authProvider={authProvider}
      dataProvider={dataProvider}
    >
      <Resource name="apps" list={AppList} />
      <Resource name="profile" />

      {/*
        You have to put this here to "register" the resource
        If you don't, then the resource is not added to the redux store
        Even though it is not added, it still re-renders!
        This potentially causes child components to re-mount and re-fetch this resource!
        That is an infinite loop. 
        Still don't 100% understand, but this fixes it.
      */}
      <Resource name="payment_methods" />
    </Admin>
  </BrowserRouter>
)

export default App
