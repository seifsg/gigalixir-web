import React from 'react'
import qs from 'query-string'
import { connect } from 'react-redux'

export const SuccessPage = (props: {
  location: { search: string }
}) => {
  const { location } = props
  const params = qs.parse(location.search)
  if (typeof params.msg === 'string') {
    return <div>{params.msg}</div>
  }
return <span></span>
}

export default connect(
  null,
  {}
)(SuccessPage)
