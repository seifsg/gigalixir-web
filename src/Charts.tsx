import React, { FunctionComponent } from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { Query } from 'react-admin'
import Loading from './Loading'
import Chart, { ChartPoint } from './Chart'
import { point, Stats } from './api/stats'

const chartStyles = createStyles({
  loading: {
    marginTop: 40
  },
  chartSection: {
    display: 'flex',
    // this is paired with the child's padding
    // to produce space between elements
    marginLeft: -20,
    marginRight: -20
  }
})

interface ChartsProps extends WithStyles<typeof chartStyles> {
  id: string
}
interface Error {
  message: string
}
const formatStatsPointForChart = (p: point): ChartPoint => {
  const [x] = p
  const [, y] = p
  if (x === null) {
    throw new Error('data point x can not be null')
  }
  return {
    x,
    y
  }
}
const formatStatsForChart = (data: point[]): ChartPoint[] =>
  data.map(formatStatsPointForChart)

const toMegabytes = (data: ChartPoint[]): ChartPoint[] =>
  data.map(
    (p: ChartPoint): ChartPoint => {
      let { x: time, y: value } = p
      if (value !== null) {
        value /= 1000000 // convert to megabytes
      }
      return { x: time, y: value }
    }
  )

export const Charts: React.FunctionComponent<ChartsProps> = (
  props
): React.ReactElement => {
  const { classes, id } = props
  return (
    <Query type="GET_ONE" resource="stats" payload={{ id }}>
      {({
        data,
        loading,
        error
      }: {
        data: Stats
        loading: boolean
        error: Error
      }): React.ReactElement => {
        // Note: loading here is not from the redux store so it is
        // safe to use! The problem is Query behind the scenes uses
        // dataProvider which will set the redux loading state even
        // though we do not use it here.
        if (loading) {
          return (
            <div className={classes.loading}>
              <Loading />
            </div>
          )
        }
        if (error) {
          return <div>Error: {error.message}</div>
        }
        return (
          <div className={classes.chartSection}>
            <Chart
              data={formatStatsForChart(data.data.cpu)}
              title="CPU (Millicores)"
            />
            <Chart
              data={toMegabytes(formatStatsForChart(data.data.mem))}
              title="Memory (MB)"
            />
          </div>
        )
      }}
    </Query>
  )
}

const EnhancedCharts = withStyles(chartStyles)(Charts)

export default EnhancedCharts
