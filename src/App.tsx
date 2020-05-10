import { createMuiTheme } from '@material-ui/core/styles'
import React from 'react'
import { Admin, Resource } from 'react-admin'
import { BrowserRouter, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { AppCreate, AppList, AppShow } from './apps'
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

const theme = createMuiTheme({
  palette: {
    background: {
      default: "#fff"
    }
  }
})

const customRoutes = [
  <Route path="/profile" component={ProfileShow} />,
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
      <Resource name="apps" show={AppShow} list={AppList} create={AppCreate} />
      <Resource name="profile" />
    </Admin>
  </BrowserRouter>
)

export default App
