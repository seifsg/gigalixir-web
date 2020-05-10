import React, { CSSProperties } from 'react'
import PropTypes from 'prop-types'
import Headroom from 'react-headroom'

const defaultStyle: CSSProperties = {
  position: 'fixed',
  zIndex: 1300
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const HeadroomCustom = ({ children }: any) => (
  <Headroom style={defaultStyle}>{children}</Headroom>
)

HeadroomCustom.propTypes = {
  children: PropTypes.node.isRequired
}

export default HeadroomCustom
