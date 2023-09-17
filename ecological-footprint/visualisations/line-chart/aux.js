import { width, height, margin } from "./constants.js"

export const getScales = data => {
    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([margin.left, width - margin.right])

    const y = d3
        .scaleLinear()
        .domain([1, 2])
        .range([height - margin.bottom, margin.top])

    return { x, y }
}