import React from 'react'
import { MenuItemLink } from 'react-admin'

const SidebarStyle = {
  width: '250px',
  padding: '20px'
} as React.CSSProperties

const SidebarLinkStyle = {
  borderRadius: '7px',
  padding: '15px',
  margin: '0 0 10px',
  '&:hover': {
    background: '#216dff',
    color: '#fff'
  },
  '&:active': {
    background: '#216dff',
    color: '#fff'
  },
  '&:focus': {
    background: '#216dff',
    color: '#fff'
  }
} as React.CSSProperties

const changeBackgroundColor = (e: any, bgColor: any, color: any) => {
  e.currentTarget.style.backgroundColor = bgColor
  e.currentTarget.style.color = color
}

const AppSideBar = () => {
  return (
    <div style={SidebarStyle}>
      {['Apps', 'Profile', 'Setting', 'Gallery'].map(item => (
        <MenuItemLink
          to={`/${item}`}
          style={SidebarLinkStyle}
          primaryText={item}
          onMouseEnter={(e: any) => changeBackgroundColor(e, '#216dff', '#fff')}
          onMouseLeave={(e: any) => changeBackgroundColor(e, '', '#777')}
        />
      ))}
    </div>
  )
}

export default AppSideBar
