import {
  createMuiTheme,
  MuiThemeProvider,
  Theme
} from '@material-ui/core/styles'
import React, { Component } from 'react'
import { defaultTheme } from 'react-admin'
import Layout from './LayoutWithoutTheme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
class LayoutWithTheme extends Component<any, any> {
  // eslint-disable-next-line react/static-property-placement
  private static defaultProps = { theme: defaultTheme }

  private theme: Theme = defaultTheme

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public constructor(props: any) {
    super(props)
    this.theme = createMuiTheme(props.theme)
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public componentWillReceiveProps(nextProps: any) {
    const { theme } = this.props
    if (nextProps.theme !== theme) {
      this.theme = createMuiTheme(nextProps.theme)
    }
  }

  public render() {
    const { ...rest } = this.props
    return (
      <MuiThemeProvider theme={this.theme}>
        <Layout {...rest} />
      </MuiThemeProvider>
    )
  }
}

// LayoutWithTheme.propTypes = {
//     theme: PropTypes.object,
// };

// LayoutWithTheme.defaultProps = {
//     theme: defaultTheme,
// };

export default LayoutWithTheme
