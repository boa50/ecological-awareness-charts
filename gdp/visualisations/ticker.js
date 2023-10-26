import { width, height } from "./constants.js"

export const ticker = (svg, year) => {
    const base = svg
        .append('text')
        .attr('font-size', 20)
        .attr('x', width - 126)
        .attr('y', height - 100)
        .attr('dy', '0.32em')
        .text(year)

    return (newYear, transition) => {
        transition.end().then(() => base.text(newYear))
    }
}