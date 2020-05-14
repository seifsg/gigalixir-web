import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import inflection from 'inflection';
import compose from 'recompose/compose';
import { withStyles, createStyles } from '@material-ui/core/styles';
import classnames from 'classnames';
import { getResources, translate, userLogout as userLogoutAction } from 'ra-core';
import DefaultIcon from '@material-ui/icons/ViewList';
import AccountCircle from '@material-ui/icons/AccountCircle'
import ExitIcon from '@material-ui/icons/PowerSettingsNew';

import { MenuItemLink }  from 'react-admin';

const styles = createStyles({
    main: {
        marginTop: '14px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const translatedResourceName = (resource: any, translate: any) =>
    translate(`resources.${resource.name}.name`, {
        smart_count: 2,
        _:
            resource.options && resource.options.label
                ? translate(resource.options.label, {
                      smart_count: 2,
                      _: resource.options.label,
                  })
                : inflection.humanize(inflection.pluralize(resource.name)),
    });

const Menu = ({
    classes,
    className,
    dense,
    hasDashboard,
    onMenuClick,
    open,
    pathname,
    resources,
    translate,
    logout,
    userLogout,
    ...rest
}: // eslint-disable-next-line @typescript-eslint/no-explicit-any
any) => (
    <div className={classnames(classes.main, className)} {...rest}>
        {resources
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .filter((r: any) => r.hasList)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .map((resource: any) => (
                <MenuItemLink
                    key={resource.name}
                    to={`/${resource.name}`}
                    primaryText={translatedResourceName(resource, translate)}
                    leftIcon={
                        resource.icon ? <resource.icon /> : <DefaultIcon />
                    }
                    onClick={onMenuClick}
                    dense={dense}
                />
            ))}
        <MenuItemLink
                    key="account"
                    to="/account"
                    primaryText="My Account"
                    leftIcon={ <AccountCircle /> }
                    onClick={onMenuClick}
                    dense={dense}
                />
        <MenuItemLink
                    key="logout"
                    to="#"
                    primaryText="Logout"
                    leftIcon={ <ExitIcon /> }
                    onClick={userLogout}
                    dense={dense}
                />
    </div>
);

Menu.propTypes = {
    classes: PropTypes.object,
    className: PropTypes.string,
    dense: PropTypes.bool,
    hasDashboard: PropTypes.bool,
    logout: PropTypes.element,
    onMenuClick: PropTypes.func,
    open: PropTypes.bool,
    pathname: PropTypes.string,
    resources: PropTypes.array.isRequired,
    translate: PropTypes.func.isRequired,
};

Menu.defaultProps = {
    onMenuClick: () => null,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const mapStateToProps = ( state: any ) => ({
    open: state.admin.ui.sidebarOpen,
    resources: getResources(state),
    pathname: state.router.location.pathname, // used to force redraw on navigation
});

const mapDispatchToProps = (dispatch: any, { redirectTo }: any) => ({
    userLogout: () => dispatch(userLogoutAction(redirectTo)),
});


const enhance = compose(
    translate,
    connect(
        mapStateToProps,
        mapDispatchToProps,
        // {}, // Avoid connect passing dispatch in props,
        null,
        {
            areStatePropsEqual: (prev, next) =>
                prev.resources.every(
                    (value, index) => value === next.resources[index] // shallow compare resources
                ) &&
                prev.pathname === next.pathname &&
                prev.open === next.open,
        }
    ),
    withStyles(styles)
);

export default enhance(Menu);

