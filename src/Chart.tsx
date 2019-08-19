import React from 'react';
import { Line } from 'react-chartjs-2';
import { Stats, value, point } from './api/stats'
import { Query, Loading } from 'react-admin'
import logger from './logger';

interface ChartProps {
    id: string
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

const options = {
    title: {
        display: true,
        text: 'Memory (MB)'
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

export const Chart: React.FunctionComponent<ChartProps> = (props): React.ReactElement => (
    <Query type="GET_ONE" resource="stats" payload={{ id: props.id }}>
        {({ data, loading, error }: { data: Stats, loading: boolean, error: any}) => {
            logger.debug("data: " + JSON.stringify(data))
            logger.debug("loading: " + JSON.stringify(loading))
            logger.debug("error: " + JSON.stringify(error))
            if (loading) { return <Loading />; }
            if (error) { return <div>{error.message}</div>; }
            logger.debug(JSON.stringify(data))
            const datasets = {
                    datasets: [
                    {
                        pointRadius: 1,
                        data: formatStatsForChart(data.data.mem)
                    }
                ]
            }
            return <Line data={datasets} options={options}/>
        }}
    </Query>
);