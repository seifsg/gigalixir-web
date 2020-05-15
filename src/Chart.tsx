import React from 'react'
import { Line } from 'react-chartjs-2'
import { value } from './api/stats'

export interface ChartPoint {
  x: number
  y: value
}
interface ChartProps {
  title: string
  data: ChartPoint[]
}

const Chart = (props: ChartProps) => {
  const { data, title } = props
  const datasets = {
    datasets: [
      {
        pointRadius: 1,
        data: data
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
  return <Line data={datasets} options={options} />
}

export default Chart
