// in src/App.js
import React from 'react';
import { Admin, Resource, Layout } from 'react-admin';
import CustomTableHolder from './components/table';
import MySidebar from './components/sidebar';
import MainHeader from './components/header';
import jsonServerProvider from 'ra-data-json-server';

const dataProvider = jsonServerProvider('https://jsonplaceholder.typicode.com');

const App = () => (
	<Admin layout={MyLayout} dataProvider={dataProvider}>
		<Resource name="Dashboard" list={CustomTableHolder} />
		<Resource name="Profile" list={CustomTableHolder} />
		<Resource name="Item 1" list={CustomTableHolder} />
		<Resource name="Item 2" list={CustomTableHolder} />
		<Resource name="Item 3" list={CustomTableHolder} />
		<Resource name="Item 4" list={CustomTableHolder} />
	</Admin>
);


const MyLayout = (props) => <Layout {...props} appBar={MainHeader} sidebar={MySidebar} />;


export default App;