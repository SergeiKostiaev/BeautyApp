import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import { ImageInput, ImageField } from 'react-admin';



export const MasterList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <ImageField source="imageUrl" title="name" />
            <EditButton basePath="/masters" />
            <DeleteButton basePath="/masters" />
        </Datagrid>
    </List>
);

export const MasterEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ImageInput source="imageUrl" label="Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Edit>
);

export const MasterCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ImageInput source="imageUrl" label="Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);
