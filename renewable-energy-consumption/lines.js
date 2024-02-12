export const drawHorizontalLine = (svg, id, x0, x1, y, colour = 'black', progress = 1) => {
    let line = svg.select(`#${id}`).select('line')

    if (line.empty()) {
        line = svg
            .append('g')
            .attr('id', id)
            .append('line')
            .style('stroke', colour)
            .style('stroke-width', 3)
            .style('stroke-dasharray', ('6, 3'))
            .attr('x1', x0)
            .attr('x2', x1)
            .attr('y1', y)
            .attr('y2', y)
    }

    line
        .attr('stroke-opacity', progress)
}