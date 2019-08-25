import Button from '@material-ui/core/Button';
import { withStyles } from '@material-ui/core/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import React from 'react';
import { crudUpdate, SaveButton, Toolbar, Edit, Loading, NumberInput, Query, Show, SimpleForm, SimpleShowLayout, TextField } from 'react-admin';
import { Stats } from './api/stats';
import { Chart } from './Chart';
import { Route, Link } from 'react-router-dom'
import logger from './logger';
import { App } from './api/apps'
import { connect } from 'react-redux'

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
const number = (message = 'Must be a number') =>
    (value: any) => value && isNaN(Number(value)) ? message : undefined;
const minValue = (min: number, message = 'Too small') =>
    (value: any) => value && value < min ? message : undefined;
const maxValue = (max: number, message = 'Too big') =>
    (value: any) => value && value > max ? message : undefined;

const validateSize = [required(), number(), minValue(0.2, "Must be at least 0.2"), maxValue(16, "Please contact enterprise@gigalixir.com to scale above 16.")];
const validateReplicas = [number(), minValue(0, "Must be non-negative"), maxValue(16, "Please contact enterprise@gigalixir.com to scale above 16.")];

type ScaleProps = {
    id: string,
    basePath: string,
    resource: string,
    onSave: (event: React.KeyboardEvent | React.MouseEvent) => void;
}
const AppScale = (props: ScaleProps) => {
    const { onSave, ...sanitizedProps } = props
    return (
        <Edit title=" " {...sanitizedProps}>
            <SimpleForm redirect={false} toolbar={<AppScaleToolbar onSave={onSave}/>}>
                <NumberInput source="size" validate={validateSize} />
                <NumberInput source="replicas" validate={validateReplicas} />
            </SimpleForm>
        </Edit>

    )
}

const scaleApp = (values: App, basePath: string, redirectTo: string) => {
    logger.debug('scaleApp')
    logger.debug(redirectTo)
    logger.debug(basePath)
    return crudUpdate('apps', values.id, values, undefined, basePath, redirectTo);
}

const AppScaleToolbar_ = (props: any) => {
    const handleClick = () => {
        logger.debug('handleClick')
        const { handleSubmit, basePath, redirect, scaleApp, onSave } = props;

        return handleSubmit((values: App) => {
            logger.debug(JSON.stringify(values))
            logger.debug('handleSubmit')
            onSave()
            scaleApp(values, basePath, redirect)
        });
    }

    return (
        <Toolbar {...props}>
            <SaveButton handleSubmitWithRedirect={handleClick}/>
        </Toolbar>
    )
}
const AppScaleToolbar = connect(
    undefined,
    { scaleApp }
)(AppScaleToolbar_);


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

    // { "classes": { "list": "AppShow_-list-11", "fullList": "AppShow_-fullList-12" }, "basePath": "/apps", "id": "bar", "permissions": null, "match": { "path": "/apps/:id/show", "url": "/apps/bar/show", "isExact": true, "params": { "id": "bar" } }, "location": { "pathname": "/apps/bar/show", "search": "", "hash": "" }, "history": { "length": 29, "action": "POP", "location": { "pathname": "/apps/bar/show", "search": "", "hash": "" } }, "resource": "apps", "options": { }, "hasList": true, "hasEdit": false, "hasShow": true, "hasCreate": true }
    return (
        <React.Fragment>
            <Button onClick={toggleDrawer('right', true)} variant="contained" color="primary">
                Scale
            </Button>

            <Show {...props}>
                <SimpleShowLayout>
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
                <AppScale id={props.id} basePath="/apps" resource="apps" onSave={toggleDrawer('right', false)} />
            </SwipeableDrawer>
        </React.Fragment>
    )
}

export const AppShow = withStyles(styles)(AppShow_)