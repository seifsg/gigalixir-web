import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import React from 'react';
import { List, ShowButton, TextField } from "react-admin";
import { Link } from 'react-router-dom';

const cardStyle = {
    width: 300,
    minHeight: 300,
    margin: '0.5em',
    display: 'inline-block',
    verticalAlign: 'top'
};
const AppGrid = ({ ids, data }: { ids: string[], data: any }) => (
    <div style={{ margin: '1em' }}>
        {ids.map(id =>
            <Link to={`/apps/${id}/show`}>
                <Card key={id} style={cardStyle}>
                    <CardHeader
                        title={<TextField record={data[id]} source="id" />}
                    />
                    <CardContent>
                        Replicas: <TextField record={data[id]} source="replicas" />
                        Size: <TextField record={data[id]} source="size" />
                        Cloud: <TextField record={data[id]} source="cloud" />
                        Region: <TextField record={data[id]} source="region" />
                        Stack: <TextField record={data[id]} source="stack" />
                    </CardContent>
                    <CardActions style={{ textAlign: 'right' }}>
                        <ShowButton resource="apps" basePath="/apps" record={data[id]} />
                    </CardActions>
                </Card>
            </Link>
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

export const AppList = (props: ListProps) => (
    <List title="All apps" pagination={null} bulkActions={false} {...props}>
        <AppGrid/>
    </List>
);
