import { width, height } from "./constants.js"

export const ticker = (svg, year) => {
    const base = svg
        .append('text')
        .attr('font-size', 25)
        .attr('x', width - 80)
        .attr('y', height - 25)
        .attr('dy', '0.32em')
        .attr('fill', '#777777')
        .text(year)

    return (newYear, transition) => {
        transition.end().then(() => base.text(newYear))
    }
}