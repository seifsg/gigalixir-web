import React from 'react'
import * as zoom from 'chartjs-plugin-zoom'
// import Hammer from 'hammerjs'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { Line } from 'react-chartjs-2'
import { value } from './api/stats'

import Section from './Section'
const Chartjs = require('react-chartjs-2').Chart
Chartjs.plugins.register(zoom)

const styles = createStyles({
  container: {
    flex: 1,
    // this is paired with the parent's negative margin
    // to produce space between elements
    paddingLeft: 20,
    paddingRight: 20
  }
})

export interface ChartPoint {
  x: number
  y: value
}
interface ChartProps extends WithStyles<typeof styles> {
  title: string
  data: ChartPoint[]
}

const Chart = (props: ChartProps) => {
  const { classes, data, title } = props
  const datasets = {
    datasets: [
      {
        pointRadius: 1,
        data
      }
    ]
  }
  const options = {
    pan: {
      enabled: true,
      mode: 'x'
    },
    zoom: {
      enabled: true,
      mode: 'x'
    },
    title: {
      display: true,
      text: title
    },
    legend: {
      display: false
    },
    scales: {
      xAxes: [
        {
          type: 'time',
          gridLines: {
            display: false
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 6,
            maxRotation: 0
          }
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: false
          },
          gridLines: {
            display: false
          }
        }
      ]
    }
  }

  return (
    <div className={classes.container}>
      <Section>
        <Line height={150} data={datasets} options={options} />
      </Section>
    </div>
  )
}

export default withStyles(styles)(Chart)
