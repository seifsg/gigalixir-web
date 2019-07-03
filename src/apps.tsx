import React from 'react';
import { List, Datagrid, TextField, NumberField, Create, SimpleForm, TextInput } from 'react-admin';

export const AppList = ( props: any ) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <NumberField source="size" />
            <NumberField source="replicas" />
            <TextField source="cloud" />
            <TextField source="region" />
            <TextField source="stack" />
        </Datagrid>
    </List>
);


export const AppCreate = ( props: any ) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <TextInput source="cloud" />
            <TextInput source="region" />
        </SimpleForm>
    </Create>
);

