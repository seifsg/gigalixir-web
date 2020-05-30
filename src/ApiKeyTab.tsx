/*
Author: Seif Sgayer (seif@sghaier.me)
ApiKeyTab.tsx (c) 2020
Desc: description
Created:  2020-05-30T17:11:17.070Z
Modified: 2020-05-30T21:53:22.042Z
*/

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { ReduxState } from 'ra-core'
import Field from './Field'
import Fields from './Fields'

interface ApiKeyTabProps {
  apiKey: string
}
class ApiKeyTab extends PureComponent<ApiKeyTabProps, any> {
  render() {
    const { apiKey } = this.props
    return (
      <Fields>
        <Field label="Api key">
          {apiKey !== undefined ? apiKey : 'No Api Key Found.'}
        </Field>
      </Fields>
    )
  }
}

const mapStateToProps = (state: ReduxState) => ({
  apiKey: state.admin?.resources?.profile?.data?.ignored?.apiKey
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyTab)
