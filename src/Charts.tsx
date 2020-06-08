import React from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { useQueryWithStore } from 'ra-core'
import Loading from './Loading'
import Chart, { ChartPoint } from './Chart'
import { point } from './api/stats'
import ErrorComponent from './ErrorComponent'

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
      const { x: time } = p
      let { y: value } = p
      if (value !== null) {
        value /= 1000000 // convert to megabytes
      }
      return { x: time, y: value }
    }
  )

const Charts: React.FunctionComponent<ChartsProps> = (
  props
): React.ReactElement => {
  const { classes, id } = props
  const stats = useQueryWithStore({
    type: 'getOne',
    resource: 'stats',
    payload: { id }
  })

  // Note: loading here is not from the redux store so it is
  // safe to use! The problem is Query behind the scenes uses
  // dataProvider which will set the redux loading state even
  // though we do not use it here.
  if (!stats.loaded) {
    return (
      <div className={classes.loading}>
        <Loading />
      </div>
    )
  }
  if (stats.error) {
    return <ErrorComponent>{stats.error.message}</ErrorComponent>
  }
  return (
    <div className={classes.chartSection}>
      <Chart
        data={formatStatsForChart(stats.data.data.cpu)}
        title="CPU (Millicores)"
      />
      <Chart
        data={toMegabytes(formatStatsForChart(stats.data.data.mem))}
        title="Memory (MB)"
      />
    </div>
  )
}

const EnhancedCharts = withStyles(chartStyles)(Charts)

export default EnhancedCharts
