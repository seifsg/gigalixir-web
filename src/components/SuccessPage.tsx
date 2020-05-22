import React, { FunctionComponent } from 'react'
import qs from 'query-string'
import AuthPage from '../AuthPage'

interface Props {
  location: {
    search: string
  }
}
export const SuccessPage: FunctionComponent<Props> = props => {
  const { location } = props
  const params = qs.parse(location.search)
  if (typeof params.msg === 'string') {
    return (
      <AuthPage>
        <div style={{ padding: 40 }}>{params.msg}</div>
      </AuthPage>
    )
  }
  return <span />
}

export default SuccessPage
