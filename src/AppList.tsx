import React from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import PersonIcon from '@material-ui/core/Avatar';
import { List, TextField, DateField, ReferenceField, ShowButton } from "react-admin";

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
const AppGrid = ({ ids, data, basePath }: {ids: string[], data: any, basePath: string}) => (
    <div style={{ margin: '1em' }}>
    {ids.map(id =>
        <Card key={id} style={cardStyle}>
            <CardHeader
                title={<TextField record={data[id]} source="id" />}
                // subheader={<TextField record={data[id]} source="replicas" />}
            />
            <CardContent>
                Replicas: <TextField record={data[id]} source="replicas" />
                Size: <TextField record={data[id]} source="size" />
                Cloud: <TextField record={data[id]} source="cloud" />
                Region: <TextField record={data[id]} source="region" />
                Stack: <TextField record={data[id]} source="stack" />
            </CardContent>
            {/* <CardContent>
                <ReferenceField label="Post" resource="app" record={data[id]} source="id" reference="apps" basePath={basePath}>
                    <TextField source="id" />
                </ReferenceField>
            </CardContent> */}
            <CardActions style={{ textAlign: 'right' }}>
                <ShowButton resource="apps" basePath={basePath} record={data[id]} />
            </CardActions>
        </Card>
    )}
    </div>
);
AppGrid.defaultProps = {
    data: {},
    ids: [],
};

// not gonna go thru and do a whole list of stuff from here
// https://marmelab.com/react-admin/List.html#the-list-component
type ListProps = any

// export const AppList: React.FunctionComponent<ListProps> = (props): React.ReactElement => (
//     <List {...props} pagination={null} bulkActions={false}>
//         {/* <SimpleList 
//             primaryText={(record: {id: string}) => record.id}
//             secondaryText={() => "hello"}
//             tertiaryText={() => "there"}
//             /> */}
//         <Datagrid rowClick="show">
//             <TextField source="id" />
//             <NumberField source="size" />
//             <NumberField source="replicas" />
//             <TextField source="cloud" />
//             <TextField source="region" />
//             <TextField source="stack" />
//         </Datagrid>
//     </List>
// );

export const AppList = (props: ListProps) => (
    <List title="All apps" pagination={null} bulkActions={false} {...props}>
        <AppGrid basePath=""/>
    </List>
);
