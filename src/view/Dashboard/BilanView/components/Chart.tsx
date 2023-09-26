import { View, Text } from 'react-native'
import React from 'react'
import { windowWidth } from '../../../../functions/functions'
import {
    LineChart,
    BarChart,
    PieChart,
    ProgressChart,
    ContributionGraph,
    StackedBarChart
} from "react-native-chart-kit";

interface ChartProps {
    chart: any
}
const Chart: React.FC<ChartProps> = ({chart}) => {
    return (
        <LineChart
            data={{
                labels: chart.labels,
                datasets: [
                    {
                        data: chart.data
                    }
                ],
                legend: [`Transactions - ${chart.year}`]
            }}
            width={windowWidth - 20} // from react-native
            height={220}
            yAxisLabel=""
            yAxisSuffix=""
            yAxisInterval={1} // optional, defaults to 1
            chartConfig={{
                backgroundColor: "#e26a00",
                backgroundGradientFrom: "#fb8c00",
                backgroundGradientTo: "#ffa726",
                decimalPlaces: 0, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                    borderRadius: 16
                },
                propsForDots: {
                    r: "6",
                    strokeWidth: "2",
                    stroke: "#ffa726"
                }
            }}
            fromZero
            bezier
            style={{
                marginVertical: 8,
                borderRadius: 16
            }}
        />
    )
}

export default Chart;