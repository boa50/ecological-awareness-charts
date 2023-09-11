import { width, height } from "./constants.js"

export const getScales = data => {
    const x = d3
        .scaleTime()
        .domain(d3.extent(data, d => d.date))
        .range([0, width])

    const y = d3
        .scaleLinear()
        .domain([1, d3.max(data, d => d.value) * 1.2])
        .range([height, 0])

    return { x, y }
}