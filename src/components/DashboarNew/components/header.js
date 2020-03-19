import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Logo from '../images/logo.png';


const useStyles = makeStyles({
	header: {
		textDecoration: 'none',
		borderBottom: '1px solid #aaa',
		padding: '18px 30px 12px',
		margin: '-48px 0 0'
	},
	LogoStyle: {
		width: '130px'
	},
	customList: {
		float: 'right',
		listStyle: 'none',
		padding: 0,
		margin: 0
	},
	customListItem: {
		float: 'left',
		marginLeft: '50px'
	},
	iconStyle: {
		fontSize: '12px'
	},
	profileStyleHolder: {
		cursor: 'pointer'
	},
	profileIcon: {
		backgroundColor: '#08b7a4',
		display: 'inline-block',
		verticalAlign: 'middle',
		fontSize: '14px',
		lineHeight: '40px',
		fontWeight: 'bold',
		textAlign: 'center'
	},
	profileText: {
		color: '#555',
		fontSize: '14px',
		lineHeight: '16px',
		fontWeight: 'bold',
		display: 'inline-block',
		verticalAlign: 'bottom',
		margin: '0 0 12px 10px',
	},
	profileIconStyle: {
		color: '#555',
		fontSize: '20px',
		lineHeight: '16px',
		display: 'inline-block',
		verticalAlign: 'bottom',
	},
	blueColor: {
		backgroundColor: '#216dff'
	},
	helpIconHolder: {
		padding: '0',
		margin: '5px 0 0'
	},
	helpIcon: {
		backgroundColor: '#e0e5fe',
		color: '#000',
		fontSize: '16px',
		height: '30px',
		width: '30px'
	},
});


const MainHeader = () => {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);

	const handleMenu = event => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const classes = useStyles();
	return (
		<header className={classes.header}>
			<a href='Home'><img className={classes.LogoStyle} src={Logo} alt='Logo' /></a>
			<ul className={classes.customList}>
				<li className={classes.customListItem}>
					<a
						href='Home'
						aria-label="account of current user"
						aria-controls="menu-appbar"
						aria-haspopup="true"
						onClick={handleMenu}
						color="inherit"
						className={classes.profileStyleHolder}
					>
						<Avatar className={classes.profileIcon}>OP</Avatar>
						<span className={classes.profileText}>Arshad@gmail.com <ArrowDropDownIcon className={classes.profileIconStyle} /></span>
					</a>
					<Menu
						id="menu-appbar"
						anchorEl={anchorEl}
						anchorOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						keepMounted
						transformOrigin={{
							vertical: 'bottom',
							horizontal: 'right',
						}}
						open={open}
						onClose={handleClose}
					>
						<MenuItem onClick={handleClose}>Profile</MenuItem>
						<MenuItem onClick={handleClose}>My account</MenuItem>
					</Menu>
				</li>
				<li className={classes.customListItem}>
					<IconButton className={classes.helpIconHolder}>
						<Avatar className={classes.helpIcon}>?</Avatar>
					</IconButton>
				</li>
			</ul>
		</header>
	);
}



export default MainHeader;
