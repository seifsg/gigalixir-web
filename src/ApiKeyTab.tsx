/*
Author: Seif Sgayer (seif@sghaier.me)
ApiKeyTab.tsx (c) 2020
Desc: description
Created:  2020-05-30T17:11:17.070Z
Modified: 2020-05-30T18:21:33.545Z
*/

// import React from 'react'
// import { useSelector } from 'react-redux'

// const ApiKeyTab = () => {
//   const apiKey = useSelector(
//     (state: any) =>
//   )
//   return <div>Api key: {apiKey}</div>
// }

// export default ApiKeyTab

import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import Field from './Field'
import Fields from './Fields'

class ApiKeyTab extends PureComponent<any, any> {
  render() {
    try {
      return (
        <Fields>
          <Field label="Api key">
            {this.props.profile.data.ignored.apiKey}
          </Field>
        </Fields>
      )
    } catch (error) {
      return <div>No Api Key Found.</div>
    }
  }
}

const mapStateToProps = (state: any) => ({
  profile: state.admin.resources.profile
})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(ApiKeyTab)
