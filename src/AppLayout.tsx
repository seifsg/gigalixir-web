import React from 'react'
import { Link } from 'react-router-dom'
import { withStyles } from '@material-ui/core/styles'
import Layout from './Layout'
import AppBar from './AppBar'
import Sidebar from './Sidebar'
import Menu from './Menu'

const styles = {
  root: {
    flex: 1
  },
  image: {
    width: '90px',
    verticalAlign: 'middle'
  }
}

interface Props {
  classes: {
    root: string
    image: string
  }
}

// TODO: download image?
const Logo = ({ classes }: Props) => (
  <div className={classes.root}>
    <Link to="/">
      <img className={classes.image} alt="Gigalixir" src="/images/logo.png" />
    </Link>
  </div>
)

const EnhancedLogo = withStyles(styles)(Logo)

const MyAppBar = (props: {}) => (
  <AppBar {...props}>
    <EnhancedLogo />
  </AppBar>
)
const MySidebar = (props: {}) => <Sidebar {...props} />
const MyLayout = (props: {}) => (
  <Layout {...props} appBar={MyAppBar} sidebar={MySidebar} menu={Menu} />
)

export default MyLayout
