import React from 'react';
import { List, Datagrid, TextField, EditButton, DeleteButton, Edit, SimpleForm, TextInput, Create } from 'react-admin';
import { ImageInput, ImageField } from 'react-admin';

export const ServiceList = (props) => (
    <List {...props}>
        <Datagrid>
            <TextField source="name" />
            <ImageField source="imageUrl" title="name" /> {/* Убедитесь, что imageUrl это правильное поле */}
            <EditButton basePath="/services" />
            <DeleteButton basePath="/services" />
        </Datagrid>
    </List>
);

export default ServiceList;

export const ServiceEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ImageInput source="imageUrl" label="Image" accept="image/*">
                <ImageField source="src" title="title" /> {/* src это правильное поле? */}
            </ImageInput>
        </SimpleForm>
    </Edit>
);

export default ServiceEdit;

const ServiceCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" />
            <ImageInput source="image" label="Image" accept="image/*">
                <ImageField source="src" title="title" />
            </ImageInput>
        </SimpleForm>
    </Create>
);

export default ServiceCreate;
