import React from 'react';
import { SelectInput, Edit, SimpleForm, ReferenceInput, LongTextInput, TextInput } from 'react-admin'

export const PostEdit = props => (
    <Edit {...props}>
        <SimpleForm>
            <ReferenceInput source="userId" reference="users"><SelectInput optionText="name" /></ReferenceInput>
            <TextInput source="title" />
            <LongTextInput source="body" />
        </SimpleForm>
    </Edit>
);
