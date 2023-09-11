import { getScales } from "./aux.js"
import { height } from "./constants.js"

export const axis = (svg, data) => {
    const { x, _ } = getScales(data)

    const xAxis = d3
        .axisBottom(x)

    svg
        .append('g')
        .attr('transform', `translate(0,${height})`)
        .call(xAxis)

}