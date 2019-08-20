import React from 'react';
import { Line } from 'react-chartjs-2';
import { value, point } from './api/stats'

interface ChartProps {
    title: string,
    data: point[]
}

type chartPoint = {
    x: number,
    y: value
} 
const formatStatsForChart = (data: point[]): chartPoint[] => data.map(formatStatsPointForChart)
const formatStatsPointForChart = (point: point): chartPoint => {
    var [x, y] = point
    if (x === null) {
        throw new Error("data point x can not be null")
    }
    if (y !== null) {
        y /= 1000000 // convert to megabytes
    }
    return {
        x: x,
        y: y
    }
}


export const Chart: React.FunctionComponent<ChartProps> = (props): React.ReactElement => {
    const datasets = {
            datasets: [
            {
                pointRadius: 1,
                data: formatStatsForChart(props.data)
            }
        ]
    }
    const options = {
        title: {
            display: true,
            text: props.title
        },
        legend: {
            display: false
        },
        scales: {
            xAxes: [{
                type: 'time',
            }],
            yAxes: [{
                ticks: {
                    beginAtZero: true
                }
            }]
        }
    }            
    return <Line data={datasets} options={options}/>
};