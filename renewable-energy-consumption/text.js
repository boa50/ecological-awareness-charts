export const setUpText = (svg, id, x, y, colour = 'transparent', content = '', anchor = 'middle', size = '1rem') => {
    let text = svg.select(`#${id}`)

    if (text.empty()) {
        text = svg
            .append('g')
            .attr('id', id)
            .style('font-size', size)
            .style('text-anchor', anchor)
            .attr('transform', `translate(${[x, y]})`)

        text
            .append('text')
            .attr('alignment-baseline', 'central')
            .style('fill', colour)
            .text(content)
    }
}