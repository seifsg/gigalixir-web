import React from 'react'
import { Theme, createStyles, withStyles } from '@material-ui/core/styles'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'

interface StyledTabsProps {
  value: number;
  onChange: (event: React.ChangeEvent<{}>, newValue: number) => void;
}

interface StyledTabProps {
  label: string;
}


export const StyledTabs = withStyles({
  indicator: {
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
    "& > div": {
      maxWidth: 80,
      width: "100%",
      height: "1px",
      backgroundColor: "rgba(0,0,0,0.1)"
    }
  }
})((props: StyledTabsProps) => (
  <Tabs {...props} TabIndicatorProps={{ children: <div /> }} />
));

export const StyledTab = withStyles((theme: Theme) =>
  createStyles({
    root: {
      minWidth: 80,
      textTransform: "none",
      color: "#000",
      fontWeight: theme.typography.fontWeightRegular,
      fontSize: theme.typography.pxToRem(15),
      marginRight: theme.spacing.unit,
      "&:focus": {
        opacity: 1
      }
    }
  })
)((props: StyledTabProps) => <Tab disableRipple {...props} />);

