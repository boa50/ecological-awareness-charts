import { getScales } from "./aux.js"
import { height, margin } from "./constants.js"

export const axis = (svg, data) => {
    const { x, y } = getScales(data)

    const xAxis = d3
        .axisBottom(x)

    const yAxis = d3
        .axisLeft(y)
        .ticks(6)

    svg
        .append('g')
        .attr('transform', `translate(0,${height - margin.bottom})`)
        .call(xAxis)

    svg
        .append('g')
        .attr('transform', `translate(${margin.left},0)`)
        .call(yAxis)

    svg
        .append('g')
        .append('text')
        .classed('axis-label', true)
        .attr('x', -height/2)
        .attr('y', margin.left - 32)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text('GLOBAL AVERAGE')
}