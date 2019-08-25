import React from 'react';
import { Route } from 'react-router-dom';
import { AppShow } from './AppShow'
import logger from './logger';

// try and make /apps/:id/scale the same as /apps/:id/show
// maybe there is a better way? The scale drawer is shown with a <Route> inside AppShow
export default [
    <Route path="/apps/:id/scale" render={
        ({ match }) => {
            // {"path":"/apps/:id/scale","url":"/apps/bar/scale","isExact":true,"params":{"id":"bar"}}
            return (
                <AppShow basePath="/apps" id={match.params.id} resource="apps" />

            )
        }
    } />
]
