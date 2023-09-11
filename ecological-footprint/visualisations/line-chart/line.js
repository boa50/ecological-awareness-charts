import { getScales } from "./aux.js"

export const line = (svg, data, transition) => {
    const { x, y } = getScales(data)

    const lineGenerator = d3
        .line()
        .x(d => x(d.date))
        .y(d => y(d.value))

    const path = svg
        .append('path')
        .datum(data)
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