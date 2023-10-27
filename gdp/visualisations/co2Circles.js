import { getProjection } from "./aux.js"

export const co2Circles = (svg, co2, centroids) => {
    const size = d3
        .scaleLinear()
        .domain(d3.extent(co2, d => +d.Emissions))
        .range([1, 100])

    let circles = svg
        .selectAll('.co2Circle')

    return (year, transition) => circles = circles
        .data(co2.filter(d => d.Year == year))
        .join('circle')
        .attr('cx', d => getProjection(centroids, d.Code)[0])
        .attr('cy', d => getProjection(centroids, d.Code)[1])
        .style('fill', d3.schemeReds[7][3])
        .attr('fill-opacity', .7)
        .call(
            circle => circle
                .transition(transition)
                .attr('r', d => size(d.Emissions))
        )
}