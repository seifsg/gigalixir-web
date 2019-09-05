import React from 'react'
import { Line } from 'react-chartjs-2'
import { value, point } from './api/stats'

interface ChartProps {
  title: string
  data: point[]
}

interface ChartPoint {
  x: number
  y: value
}
const formatStatsPointForChart = (p: point): ChartPoint => {
  const [x] = p
  let [, y] = p
  if (x === null) {
    throw new Error('data point x can not be null')
  }
  if (y !== null) {
    y /= 1000000 // convert to megabytes
  }
  return {
    x,
    y,
  }
}
const formatStatsForChart = (data: point[]): ChartPoint[] => data.map(formatStatsPointForChart)

const Chart = (props: ChartProps) => {
  const { data, title } = props
  const datasets = {
    datasets: [
      {
        pointRadius: 1,
        data: formatStatsForChart(data),
      },
    ],
  }
  const options = {
    title: {
      display: true,
      text: title,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          type: 'time',
        },
      ],
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  }
  return <Line data={datasets} options={options} />
}

export default Chart
