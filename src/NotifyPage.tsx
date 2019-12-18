import React from 'react'
import { showNotification } from 'react-admin'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import qs from 'query-string'

const NotifyPage = (props: {
  showNotification: (msg: string) => void
  push: (path: string) => void
  location: { search: string }
}) => {
  // eslint-disable-next-line no-shadow
  const { showNotification, push, location } = props
  const params = qs.parse(location.search)
  if (typeof params.msg === 'string') {
    showNotification(params.msg)
  }
  if (typeof params.to === 'string') {
    push(params.to)
  }
  return <div>{params.msg}</div>
}

export default connect(null, {
  showNotification,
  push
})(NotifyPage)
