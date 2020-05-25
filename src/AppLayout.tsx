import React from 'react'
import Layout from './Layout'
import AppBar from './AppBar'
import Sidebar from './Sidebar'
import Menu from './Menu'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    flex: 1
  },
  image: {
    width: "90px",
    verticalAlign: "middle"
  }
}

interface Props {
  classes: {
    root: string,
    image: string
  }
}

// TODO: download image?
const Logo = ({ classes }: Props) => <div className={classes.root}>
  <img className={classes.image} alt="Gigalixir" src="https://gigalixir-home.gigalixirapp.com/images/gigalixir_logo.png"/>
</div>

const EnhancedLogo = withStyles(styles)(Logo)

const MyAppBar = (props: {}) => <AppBar {...props}><EnhancedLogo/></AppBar>
const MySidebar = (props: {}) => <Sidebar {...props}/>
const MyLayout = (props: {}) => <Layout {...props} appBar={MyAppBar} sidebar={MySidebar} menu={Menu}/>

export default MyLayout
