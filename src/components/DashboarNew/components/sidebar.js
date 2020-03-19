import React from 'react';
import { MenuItemLink } from 'react-admin';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
	SidebarStyle: {
		width: '250px',
		padding: '20px'
	},
	SidebarLinkStyle: {
		borderRadius: '7px',
		padding: '20px',
		margin: '0 0 10px',
		'&:hover': {
			backgroundColor:'#216dff',
			color: '#fff'
		},
		'&:active': {
			backgroundColor:'#216dff',
			color: '#fff'
		},
		'&:focus': {
			backgroundColor:'#216dff',
			color: '#fff'
		}
	},
});


const MySidebar = () => {
	const classes = useStyles();
	return (
		<div className={classes.SidebarStyle}>
			<MenuItemLink className={classes.SidebarLinkStyle} to="/Dashboard" primaryText="Dashboard" />
			<MenuItemLink className={classes.SidebarLinkStyle} to="/Profile" primaryText="Profile" />
			<MenuItemLink className={classes.SidebarLinkStyle} to="/Setting" primaryText="Setting" />
			<MenuItemLink className={classes.SidebarLinkStyle} to="/Gallery" primaryText="Gallery" />
		</div>
	);
}


export default MySidebar;