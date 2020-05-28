import React, { FunctionComponent } from 'react'
import compose from 'recompose/compose'
import { createStyles, withStyles, WithStyles } from '@material-ui/core/styles'
import { Query } from 'ra-core'
import _ from 'lodash/fp'
import { Invoice } from './api/invoices'
import Loading from './Loading'
import ErrorComponent from './ErrorComponent'

const styles = createStyles({})

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface Props {}

type EnhancedProps = WithStyles<typeof styles>

const Invoices: FunctionComponent<Props & EnhancedProps> = () => {
  return (
    <Query type="GET_LIST" resource="invoices" payload={{}}>
      {({
        data,
        loading,
        error
      }: {
        data: Invoice[]
        loading: boolean
        error: Error
      }): React.ReactElement => {
        if (loading) {
          return <Loading />
        }
        if (error) {
          return <ErrorComponent>{error.message}</ErrorComponent>
        }
        return (
          <ul>
            {_.map(invoice => {
              return (
                <li key={invoice.id}>
                  <a href={invoice.pdf}>{invoice.amountCents}</a>
                </li>
              )
            }, data)}
          </ul>
        )
      }}
    </Query>
  )
}

const EnhancedInvoices = compose<Props & EnhancedProps, Props>(
  withStyles(styles)
)(Invoices)

export default EnhancedInvoices
