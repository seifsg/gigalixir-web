import React from 'react';
import { Admin, Resource, ListGuesser } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';

const App = () => (
    <Admin authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="apps" list={ListGuesser} />
    </Admin>
);


export default App;
