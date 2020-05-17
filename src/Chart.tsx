import React from 'react'
import { withStyles, WithStyles, createStyles } from '@material-ui/core/styles'
import { Line } from 'react-chartjs-2'
import { value } from './api/stats'

import Section from './Section'

const styles = createStyles({
  container: {
    flex: 1,
    // this is paired with the parent's negative margin
    // to produce space between elements
    paddingLeft: 20,
    paddingRight: 20,
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
          type: 'time'
        }
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true
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
