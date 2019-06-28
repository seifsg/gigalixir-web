import React from 'react';
import { List, Datagrid, TextField, ReferenceField, EditButton } from 'react-admin';

export const PostList = ( props: any ) => (
    <List {...props}>
        <Datagrid rowClick="edit">
            <TextField source="id" />
            <ReferenceField source="userId" reference="users"><TextField source="name" /></ReferenceField>
            <TextField source="title" />
            <EditButton/>
        </Datagrid>
    </List>
);
