import React from 'react';
import { Admin, Resource } from 'react-admin';
import authProvider from './authProvider';
import dataProvider from './dataProvider';
import { AppList, AppCreate, AppShow } from './apps'
import customRoutes from './customRoutes';

const App = () => (
    <Admin customRoutes={customRoutes} authProvider={authProvider} dataProvider={dataProvider}>
        <Resource name="apps" show={AppShow} list={AppList} create={AppCreate}/>
    </Admin>
);


export default App;
