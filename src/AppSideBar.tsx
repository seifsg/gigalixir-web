import React from 'react';
import { MenuItemLink } from 'react-admin';


const SidebarStyle = {
  width: '250px',
  padding: '20px'
} as React.CSSProperties;




const SidebarLinkStyle = {
  borderRadius: '7px',
  padding: '15px',
  margin: '0 0 10px',
  "&:hover": {
    background:'#216dff',
    color: '#fff'
  },
  "&:active": {
    background:'#216dff',
    color: '#fff'
  },
  "&:focus": {
    background:'#216dff',
    color: '#fff'
  }
} as React.CSSProperties;



const AppSideBar = () => {
  return (
    <div style={SidebarStyle}>
      <MenuItemLink style={SidebarLinkStyle} to="/apps" primaryText="Dashboard" />
      <MenuItemLink style={SidebarLinkStyle} to="/Profile" primaryText="Profile" />
      <MenuItemLink style={SidebarLinkStyle} to="/Setting" primaryText="Setting" />
      <MenuItemLink style={SidebarLinkStyle} to="/Gallery" primaryText="Gallery" />
    </div>
  );
}

export default AppSideBar;
