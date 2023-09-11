import { width, height } from "./constants.js"

const prepareData = data =>
    Array.from(data)
        .map(d => ({ 'date': new Date(d.date), 'value': d.value }))
        .sort((a, b) => d3.ascending(a.date, b.date))

export const createLineChart = (svg, data, transition) => {
    const prearedData = prepareData(data)

    const x = d3
        .scaleTime()
        .domain(d3.extent(prearedData, d => d.date))
        .range([0, width])
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(prearedData, d => d.value)])
        .range([height, 0])

    const lineGenerator = d3
        .line()
        .x(d => x(d.date))
        .y(d => y(d.value))

    const path = svg
        .append('path')
        .datum(prearedData)
        .style('fill', 'none')
        .attr('stroke-width', 2)
        .attr('stroke', 'steelblue')
        .attr('d', lineGenerator)

    const pathLength = path.node().getTotalLength()

    path
        .attr('stroke-dashoffset', pathLength)
        .attr('stroke-dasharray', pathLength)
        .transition(transition)
        .attr('stroke-dashoffset', 0)
}