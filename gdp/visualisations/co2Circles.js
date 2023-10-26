import { getProjection } from "./aux.js"

export const co2Circles = (svg, co2, minYear, centroids) => {
    const size = d3
        .scaleLinear()
        .domain(d3.extent(co2, d => +d.Emissions))
        .range([1, 100])

    svg
        .selectAll('.co2Circles')
        .data(co2.filter(d => d.Year == minYear))
        .join('circle')
        .classed('co2Circles', true)
        // .attr('id', d => d.Code)
        .attr('cx', d => getProjection(centroids, d.Code)[0])
        .attr('cy', d => getProjection(centroids, d.Code)[1])
        .style('fill', d3.schemeReds[7][3])
        .attr('fill-opacity', .7)
        .attr('r', d => size(d.Emissions))

    return (year, transition) => {
        svg
            .selectAll('.co2Circles')
            .data(co2.filter(d => d.Year == year))
            .join('circle')
            .classed('co2Circles', true)
            // .attr('id', d => d.Code)
            .attr('cx', d => getProjection(centroids, d.Code)[0])
            .attr('cy', d => getProjection(centroids, d.Code)[1])
            .style('fill', d3.schemeReds[7][3])
            .attr('fill-opacity', .7)
            // .transition(transition)
            .attr('r', d => size(d.Emissions))
    }
}