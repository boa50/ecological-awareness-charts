import { barSize, width, margin, n } from "./constants.js"

const formatDate = d3.utcFormat('%Y')

export const ticker = (svg, keyframes) => {
    const now = svg
        .append('text')
        .classed('ticker', true)
        .attr('font-size', barSize * 1.5)
        .attr('x', width - 26)
        .attr('y', margin.top + barSize * (n - 1.5))
        .attr('dy', '0.32em')
        .text(formatDate(keyframes[0][0]))

    return ([date], transition) => {
        transition.end().then(() => now.text(formatDate(date)))
    }
}