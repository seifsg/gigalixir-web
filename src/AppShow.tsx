import React from 'react';
import { Stats } from './api/stats'
import { Chart } from './Chart';
import { Query, Loading } from 'react-admin'
import { TextField, Show, SimpleShowLayout } from 'react-admin'
import { Route } from 'react-router';
import { Drawer } from '@material-ui/core';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


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
const validateReplicas = [number(), minValue(0, "Must be non-negative"), maxValue(16, "Please contact enterprise@gigalixir.com to scale above 16.")];

type ScaleProps = any
const AppScale = (props: ScaleProps) => (
    <div>hello</div>
)

const styles = {
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
};


const AppShow_ = (props: ShowProps) => {
    const [state, setState] = React.useState({
        top: false,
        left: false,
        bottom: false,
        right: false,
    });

    type DrawerSide = 'top' | 'left' | 'bottom' | 'right';
    const toggleDrawer = (side: DrawerSide, open: boolean) => (
        event: React.KeyboardEvent | React.MouseEvent,
    ) => {
        if (
            event &&
            event.type === 'keydown' &&
            ((event as React.KeyboardEvent).key === 'Tab' ||
                (event as React.KeyboardEvent).key === 'Shift')
        ) {
            return;
        }

        setState({ ...state, [side]: open });
    };

    return (
        <React.Fragment>
            <Show {...props}>
                <SimpleShowLayout>
                    <Button onClick={toggleDrawer('right', true)} variant="contained" color="primary">
                        About Page
                </Button>
                    <TextField source="id" />
                    <TextField source="size" />
                    <TextField source="replicas" />
                    <Charts id={props.id} />
                </SimpleShowLayout>
            </Show>
            <SwipeableDrawer
                anchor="right"
                open={state.right}
                onClose={toggleDrawer('right', false)}
                onOpen={toggleDrawer('right', true)}
            >
                hello
            </SwipeableDrawer>

        </React.Fragment>
    )
}

export const AppShow = withStyles(styles)(AppShow_)