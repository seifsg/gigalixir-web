// mostly copy and pasted with tweaks to change from login form to
// registration form
import React, {
  Component,
  ComponentType,
  ReactElement,
  HtmlHTMLAttributes
} from "react";
import {
  createMuiTheme,
  withStyles,
  createStyles,
  WithStyles,
  Theme,
  MuiThemeProvider
} from "@material-ui/core/styles";
import Form from "./RegisterForm";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import Avatar from "@material-ui/core/Avatar";
import LockIcon from "@material-ui/icons/Lock";

import { Notification, defaultTheme } from "react-admin";

interface Props {
  form: ReactElement<any>;
  theme: Theme;
}

const styles = (theme: Theme) =>
  createStyles({
    main: {
      display: "flex",
      flexDirection: "column",
      minHeight: "100vh",
      height: "1px",
      alignItems: "center",
      justifyContent: "flex-start",
      backgroundRepeat: "no-repeat",
      backgroundSize: "cover"
    },
    card: {
      minWidth: 300,
      marginTop: "6em"
    },
    avatar: {
      margin: "1em",
      display: "flex",
      justifyContent: "center"
    },
    icon: {}
  });

class Login extends Component<
  Props & WithStyles<typeof styles> & HtmlHTMLAttributes<HTMLDivElement>
> {
  theme = createMuiTheme(this.props.theme);
  containerRef = React.createRef<HTMLDivElement>();

  public render() {
    const { form, classes, className, ...rest } = this.props;

    return (
      <MuiThemeProvider theme={this.theme}>
        <div
          className={classnames(classes.main, className)}
          {...rest}
          ref={this.containerRef}
        >
          <Card className={classes.card}>
            <div className={classes.avatar}>
              <Avatar className={classes.icon}>
                <LockIcon />
              </Avatar>
            </div>
            {form}
          </Card>
          <Notification />
        </div>
      </MuiThemeProvider>
    );
  }
}

const EnhancedLogin = withStyles(styles)(Login) as ComponentType<Props>;

EnhancedLogin.defaultProps = {
  form: <Form />,
  theme: defaultTheme
};

export default EnhancedLogin;
