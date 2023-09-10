import { width, height } from "./constants.js"

export const createLineChart = (svg, data, transition) => {
    // Test data
    const dataset = []
    for (const x of data) {
        if (x.name === 'Brazil') {
            dataset.push(x)
        }
    }

    const x = d3
        .scaleTime()
        .domain(d3.extent(dataset, d => new Date(d.date)))
        .range([0, width])
    const y = d3
        .scaleLinear()
        .domain([0, d3.max(dataset, d => d.value)])
        .range([height, 0])

    const lineGenerator = d3
        .line()
        .x(d => x(new Date(d.date)))
        .y(d => y(d.value))

    const path = svg
        .append('path')
        .datum(dataset)
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