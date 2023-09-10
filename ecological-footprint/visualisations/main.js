import { prepareData } from "./prepareData.js"
import { width, height, duration } from "./race-bar-chart/constants.js"
import { createBarChart, updateBarChart } from "./race-bar-chart/main.js"
import { createLineChart } from "./line-chart/main.js"

const getData = async () => d3.json('../etl/dataset.json')

getData().then(data => {
    const { keyframes, prev, next } = prepareData(data)

    const chart = async () => {
        const svgBar = d3
            .select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        const svgLine = d3
            .select('body')
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        const barChartFuncs = createBarChart(svgBar, data, keyframes, prev, next)

        const transitionLine = svgLine
            .transition()
            .duration(duration * (keyframes.length))
            .ease(d3.easeLinear)

        createLineChart(svgLine, data, transitionLine)

        for (const keyframe of keyframes) {
            const transition = svgBar
                .transition()
                .duration(duration)
                .ease(d3.easeLinear)

            updateBarChart(barChartFuncs, keyframe, transition)

            await transition.end()
        }
    }

    chart()
})