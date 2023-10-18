import { barSize, n, margin, flagWidth } from "./constants.js"
import { getRank, y, getImgUrl } from "./aux.js"

export const images = (svg, prev, next) => {
    let image = svg
        .append('g')
        .selectAll('image')

    return ([date, data], transition) => image = image
        .data(data.slice(0, n), d => d.name)
        .join(
            enter => enter
                .append('image')
                .attr('xlink:href', d => getImgUrl(d.name))
                .attr('width', flagWidth)
                .attr('height', barSize / 1.5)
                .attr('preserveAspectRatio', 'none')
                .attr('transform', d => `translate(0, ${y(getRank(prev, d))})`)
                .attr('y', y.bandwidth() / 8)
                .attr('x', margin.left - flagWidth - 4),
            update => update,
            exit => exit
                .transition(transition)
                .remove()
                .attr('transform', d => `translate(0, ${y(getRank(next, d))})`)
        )
        .call(
            bar => bar
                .transition(transition)
                .attr('transform', d => `translate(0, ${y(d.rank)})`)
        )
}