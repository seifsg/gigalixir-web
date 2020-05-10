import React from 'react';
import PropTypes from 'prop-types';
import Headroom from 'react-headroom';
import { CSSProperties } from 'react';

const defaultStyle: CSSProperties = {
    position: "fixed",
    zIndex: 1300,
};

const HeadroomCustom = ({ children }: any) => (
    <Headroom style={defaultStyle}>{children}</Headroom>
);

HeadroomCustom.propTypes = {
    children: PropTypes.node.isRequired,
};

export default HeadroomCustom;
