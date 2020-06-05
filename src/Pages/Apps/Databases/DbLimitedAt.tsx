import React, { FunctionComponent } from 'react'
import { Alert } from 'antd'
import moment from 'moment'

const DbLimitedAt: FunctionComponent<{
  limitedAt: Date
}> = ({ limitedAt }) => {
  if (typeof limitedAt === 'undefined' || limitedAt === null) return null
  const limitedAtMoment = moment(limitedAt)
  return (
    <Alert
      message="Warning"
      description={`This database was limited at ${limitedAtMoment.format(
        'h:mma'
      )} on ${limitedAtMoment.format(
        'MM/DD/YYYY'
      )} because it exceeded 10,000 rows and is now read-only`}
      type="warning"
      showIcon
    />
  )
}

export default DbLimitedAt
