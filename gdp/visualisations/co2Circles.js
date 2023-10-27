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
        .join(
            enter => enter
                .append('circle')
                .attr('class', 'co2Circle')
                .attr('id', d => d.Code)
                // .attr('cx', d => getProjection(centroids, d.Code)[0])
                // .attr('cy', d => getProjection(centroids, d.Code)[1])
                .style('fill', d3.schemeReds[7][3])
                .attr('fill-opacity', .7)
        )
        // .join('circle')
        // .attr('cx', d => getProjection(centroids, d.Code)[0])
        // .attr('cy', d => getProjection(centroids, d.Code)[1])
        // .style('fill', d3.schemeReds[7][3])
        // .attr('fill-opacity', .7)
        // .attr('r', d => size(d.Emissions))
        .call(
            circle => {
                // console.log('Circles:',circle);
                // console.log('AFG:',circle.filter('#AFG'));

                return circle
                .transition(transition)
                .filter(d => `#${d.Code}`)

                .attr('cx', d => getProjection(centroids, d.Code)[0])
                .attr('cy', d => getProjection(centroids, d.Code)[1])
                .attr('r', d => size(d.Emissions))
            }
        )
}