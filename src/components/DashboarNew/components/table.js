import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import DeleteIcon from '@material-ui/icons/Delete';
import FormControl from '@material-ui/core/FormControl';


import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';


import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles({
	tableStyle: {
		borderCollapse: 'collapse',
		width: '100%',
		minWidth: '650px',
		margin: '40px 0 0'
	},
	tableHeadRowStyle: {
		borderBottom: '1px solid #ddd',
	},
	tableRowStyle: {
		borderBottom: '1px solid #ddd',
		'&:hover': {
			backgroundColor: '#eaeaea'
		}
	},
	tableCellStyle: {
		padding: '20px 15px',
	},
	createButtonStyle: {
		float: 'right',
		backgroundColor: '#216dff',
		color: '#fff',
		'&:hover': {
			backgroundColor: '#4380f4',
		}
	},
	deleteButtonStyle: {
		color: '#888',
		fontSize: '12px',
		textTransform: 'none',
		backgroundColor: '#ddd',
		borderRadius: '10px',
		padding: '2px 8px'
	},
	tableHeaderTop: {
			borderBottom: '1px solid #aaa',
	},
	tableHeaderBottom: {
		padding: '20px 0',
		overflow: 'hidden'
	},
	topHeading: {
		color: '#333',
		fontSize: '20px',
		margin: '20px 0',
	},
	topHeading2: {
		color: '#333',
		float: 'left',
		fontSize: '16px',
		margin: '0',
	},
	topHeading3: {
		color: '#333',
		fontSize: '16px',
		margin: '0 0 50px',
	},
	tableHeaderCreate: {
		overflow: 'hidden',
		borderBottom: '1px solid #aaa',
		padding: '20px 0',
	},
	formControl: {
		float: 'left',
		minWidth: '200px',
		margin: '0 5px',
	},
	formControlLabel: {
		display: 'block',
		margin: '0 0 10px'
	},
	formControlField: {
		width: '100%',
	},
	formControlFieldOption: {
		padding: '5px 15px'
	},
	selectHolder: {
		float: 'left',
	},
	selectHolderBottom: {
		overflow: 'hidden'
	},
	customListItem: {
		display: 'block',
		width: '100%'
	}


});

const CustomTableHolder = () => {
	return (
		<div>
			<TableHeader />
			<CustomTable />
		</div>
	);
}




const TableHeader = () => {
	const classes = useStyles();

	return (
		<header>
			<div className={classes.tableHeaderTop}>
				<h1 className={classes.topHeading}>Dashboard</h1>
			</div>
			<div className={classes.tableHeaderBottom}>
				<h2 className={classes.topHeading2}>All Apps</h2>
				<Button variant="contained" className={classes.createButtonStyle}>+ Create</Button>
			</div>

			<div className={classes.tableHeaderCreate}>
				<h2 className={classes.topHeading3}>Create Apps</h2>


				<div className={classes.selectHolderBottom}>
					<div className={classes.selectHolder}>
						<div className={classes.formControl}>
							<label className={classes.formControlLabel}>App Name</label>
							<Select className={classes.formControlField}>
								<option className={classes.formControlFieldOption} value="item1">Item 1</option>
								<option className={classes.formControlFieldOption} value="item2">Item 2</option>
								<option className={classes.formControlFieldOption} value="item3">Item 3</option>
								<option className={classes.formControlFieldOption} value="item4">Item 4</option>
							</Select>
						</div>

						<div className={classes.formControl}>
							<label className={classes.formControlLabel}>Cloud</label>
							<Select className={classes.formControlField}>
								<option className={classes.formControlFieldOption} value="item01">Select</option>
								<option className={classes.formControlFieldOption} value="item02">Google Cloud</option>
								<option className={classes.formControlFieldOption} value="item02">Google Cloud</option>
								<option className={classes.formControlFieldOption} value="item02">Google Cloud</option>
							</Select>
						</div>

						<div className={classes.formControl}>
							<label className={classes.formControlLabel}>Region</label>
							<Select className={classes.formControlField}>
								<option className={classes.formControlFieldOption} value="item11">Select</option>
								<option className={classes.formControlFieldOption} value="item12">2008v-2</option>
								<option className={classes.formControlFieldOption} value="item12">2008v-2</option>
								<option className={classes.formControlFieldOption} value="item12">2008v-2</option>
							</Select>
						</div>
					</div>

					<Button variant="contained" className={classes.createButtonStyle}>+ Save</Button>
				</div>
			</div>
		</header>
	);
}

function createData(name, cloud, region, stack, size, replica) {
	return { name, cloud, region, stack, size, replica };
}

const CustomTableData = [
	createData('Aplha App', 'OCP', 6.0, 24, 4.0, 232, 32),
	createData('Beta App', 'OCP', 9.0, 37, 4.3,  232, 32),
	createData('Aplha App2', 'OCP', 6.0, 24, 4.0, 232, 32),
	createData('Beta App2', 'OCP', 9.0, 37, 4.3,  232, 32),
	createData('Aplha App3', 'OCP', 6.0, 24, 4.0, 232, 32),
	createData('Beta App3', 'OCP', 9.0, 37, 4.3,  232, 32),
	createData('Aplha App4', 'OCP', 6.0, 24, 4.0, 232, 32),
	createData('Beta App4', 'OCP', 9.0, 37, 4.3,  232, 32),
];

const CustomTable = () => {
	const classes = useStyles();
	return (
		<table className={classes.tableStyle}>
			<thead>
				<tr className={classes.tableHeadRowStyle}>
					<th className={classes.tableCellStyle} align="left">App Name</th>
					<th className={classes.tableCellStyle}>Cloud</th>
					<th className={classes.tableCellStyle}>Region</th>
					<th className={classes.tableCellStyle}>Stack</th>
					<th className={classes.tableCellStyle}>Size</th>
					<th className={classes.tableCellStyle}>Replica</th>
					<th className={classes.tableCellStyle}>&nbsp;</th>
				</tr>
			</thead>  
			<tbody>
				{CustomTableData.map(row => (
					<tr key={row.name} className={classes.tableRowStyle}>
						<td className={classes.tableCellStyle}>{row.name}</td>
						<td className={classes.tableCellStyle} align="center">{row.cloud}</td>
						<td className={classes.tableCellStyle} align="center">{row.region}</td>
						<td className={classes.tableCellStyle} align="center">{row.stack}</td>
						<td className={classes.tableCellStyle} align="center"><Badge badgeContent={row.size} color="primary"></Badge></td>
						<td className={classes.tableCellStyle} align="center"><Badge badgeContent={row.replica} color="secondary"></Badge></td>
						<td className={classes.tableCellStyle} align="right">
							<Button size="small" className={classes.deleteButtonStyle}>
								<DeleteIcon style={{ fontSize: 18 }} />Delete
							</Button>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}



export default CustomTableHolder;