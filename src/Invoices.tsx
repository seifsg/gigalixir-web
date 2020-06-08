import React, { FunctionComponent } from 'react'
import classnames from 'classnames'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { useQueryWithStore } from 'ra-core'
import _ from 'lodash/fp'
import Loading from './Loading'
import ErrorComponent from './ErrorComponent'
import { formatMoney } from './formatters'

const styles = createStyles({
  table: {
    padding: 0,
    margin: 0
  },
  row: {
    display: 'flex',
    padding: 12,
    fontSize: '0.875rem',
    borderBottom: '1px solid rgba(224, 224, 224, 1)',
    '& div': {
      flex: '1 1 0px'
    }
  },
  header: {
    color: 'rgba(0,0,0,0.5)'
  }
})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

type EnhancedProps = WithStyles<typeof styles>

const Invoices: FunctionComponent<Props & EnhancedProps> = ({ classes }) => {
  const { data, loaded, error } = useQueryWithStore({
    type: 'getList',
    resource: 'invoices',
    payload: {}
  })

  if (!loaded) {
    return <Loading />
  }
  if (error) {
    return <ErrorComponent>{error.message}</ErrorComponent>
  }
  if (data?.length === 0) {
    return <div>No invoices yet</div>
  }
  return (
    <ul className={classes.table}>
      <li className={classnames(classes.row, classes.header)}>
        <div>Date</div>
        <div>Amount</div>
        <div>PDF</div>
      </li>
      {_.map(invoice => {
        if (invoice.pdf) {
          return (
            <li key={invoice.id} className={classes.row}>
              <div>
                {`${invoice.periodStart.getMonth() +
                  1}/${invoice.periodStart.getDate()}/${invoice.periodStart.getFullYear()} - ${invoice.periodEnd.getMonth() +
                  1}/${invoice.periodEnd.getDate()}/${invoice.periodEnd.getFullYear()}`}
              </div>
              <div>{formatMoney(invoice.amountCents)}</div>
              <div>
                {' '}
                <a href={invoice.pdf}>PDF</a>{' '}
              </div>
            </li>
          )
        }
        return null
      }, data)}
    </ul>
  )
}

const EnhancedInvoices = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Invoices)

export default EnhancedInvoices
