import React from 'react';
import { Edit, NumberInput, Show, SimpleShowLayout, SelectInput, List, Datagrid, TextField, NumberField, Create, SimpleForm, TextInput } from 'react-admin';
import { Chart } from './Chart';
import { Query, Loading } from 'react-admin'
import logger from './logger';
import { Stats } from './api/stats'

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
type ListProps = any
type ShowProps = any // fill this out?
interface ChartsProps {
    id: string
}
export const Charts: React.FunctionComponent<ChartsProps> = (props): React.ReactElement => (
    <Query type="GET_ONE" resource="stats" payload={{ id: props.id }}>
        {({ data, loading, error }: { data: Stats, loading: boolean, error: any }) => {
            if (loading) { return <Loading />; }
            if (error) { return <div>Error: {error.message}</div>; }
            return <div>
                <Chart data={data.data.mem} title='Memory (MB)' />
                <Chart data={data.data.cpu} title='CPU (Millicores)' />
            </div>
        }}
    </Query>
)

const required = (message = 'Required') =>
    (value: any) => value ? undefined : message;
const maxLength = (max: number, message = 'Too short') =>
    (value: any) => value && value.length > max ? message : undefined;
const number = (message = 'Must be a number') =>
    (value: any) => value && isNaN(Number(value)) ? message : undefined;
const minValue = (min: number, message = 'Too small') =>
    (value: any) => value && value < min ? message : undefined;
const maxValue = (max: number, message = 'Too big') =>
    (value: any) => value && value > max ? message : undefined;

const validateSize = [required(), number(), minValue(0.2, "Must be at least 0.2"), maxValue(16, "Please contact enterprise@gigalixir.com to scale above 16.")];
const validateReplicas = [required(), number(), minValue(0, "Must be non-negative"), maxValue(16, "Please contact enterprise@gigalixir.com to scale above 16.")];

export const AppShow: React.FunctionComponent<ShowProps> = (props): React.ReactElement => (
    <div>
        <Edit {...props}>
            <SimpleForm>
                <NumberInput source="size" validate={validateSize} />
                <NumberInput source="replicas" validate={validateReplicas} />
            </SimpleForm>
        </Edit>
        <Show {...props}>
            <SimpleShowLayout>
                <TextField source="id" />
                <TextField source="size" />
                <TextField source="replicas" />
                <Charts id={props.id} />
            </SimpleShowLayout>
        </Show>
    </div>
);

export const AppList: React.FunctionComponent<ListProps> = (props): React.ReactElement => (
    <List {...props}>
        <Datagrid rowClick="show">
            <TextField source="id" />
            <NumberField source="size" />
            <NumberField source="replicas" />
            <TextField source="cloud" />
            <TextField source="region" />
            <TextField source="stack" />
        </Datagrid>
    </List>
);

const regionChoices = (cloud: string): { defaultValue: string; choices: { id: string; name: string }[] } => {
    if (cloud === "gcp") {
        return {
            defaultValue: 'v2018-us-central1', choices: [
                { id: 'v2018-us-central1', name: 'v2018-us-central1' },
                { id: 'europe-west1', name: 'europe-west1' },
            ]
        }
    } else if (cloud === 'aws') {
        return {
            defaultValue: 'us-east-1', choices: [
                { id: 'us-east-1', name: 'us-east-1' },
                { id: 'us-west-2', name: 'us-west-2' },
            ]
        }
    } else {
        return { defaultValue: '', choices: [] };
    }
}

interface CreateProps {
    title: string;
    actions: React.ReactElement;
    aside: React.ReactElement;
}

export const AppCreate: React.FunctionComponent<CreateProps> = (props): React.ReactElement => {
    const [cloud, setCloud] = React.useState('gcp');
    const regions = regionChoices(cloud);

    return (
        <Create {...props}>
            <SimpleForm>
                <TextInput source="name" label="App Name" />
                <SelectInput source="cloud" defaultValue='gcp' choices={[
                    { id: 'gcp', name: 'Google Cloud Platform' },
                    { id: 'aws', name: 'Amazon Web Services' },
                ]} onChange={(_event: React.FormEvent, key: string): void => setCloud(key)} />
                {cloud !== "" &&
                    <SelectInput source="region" {...regions} />
                }
            </SimpleForm>
        </Create>
    );
}
