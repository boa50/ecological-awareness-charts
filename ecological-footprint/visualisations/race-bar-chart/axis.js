import { margin, width, barSize, n, height, flagWidth } from "./constants.js"
import { x, y } from "./aux.js"

export const axis = svg => {
    const g = svg
        .append('g')
        .attr('transform', `translate(0, ${margin.top})`)

    svg
        .append('g')
        .append('text')
        .classed('axis-label', true)
        .attr('x', -height/2)
        .attr('y', margin.left - flagWidth - 16)
        .attr('text-anchor', 'middle')
        .attr('transform', 'rotate(-90)')
        .text(`TOP ${n} COUNTRIES`)

    const axis = d3
        .axisTop(x)
        .ticks(width / 160)
        .tickSizeOuter(0)
        .tickSizeInner(-barSize * (n + y.padding()))

    return (_, transition) => {
        g.transition(transition).call(axis)
        g.select('.tick:first-of-type text').remove()
        g.selectAll('.tick:not(:first-of-type) line').remove()
        g.select('.domain').remove()
    }
}