import React, { FunctionComponent } from 'react'
import moment from 'moment'
import Alert from '@material-ui/lab/Alert'

const DbLimitedAt: FunctionComponent<{
  limitedAt: Date
}> = ({ limitedAt }) => {
  if (typeof limitedAt === 'undefined' || limitedAt === null) return null
  const limitedAtMoment = moment(limitedAt)
  return (
    <Alert severity="error">
      `This database was limited at ${limitedAtMoment.format('h:mma')} on $
      {limitedAtMoment.format('MM/DD/YYYY')} because it exceeded 10,000 rows`
    </Alert>
  )
}

export default DbLimitedAt
