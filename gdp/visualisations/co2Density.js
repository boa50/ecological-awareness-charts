// import { years } from "./constants.js"
import { getDensityData } from "./aux.js"

export const co2Density = (svg, co2, centroids) => {
    // USED ONLY IF THE LIMITS HAVE CHANGED
    // let limits = []
    // years.forEach(year => {
    //     limits.push(...d3.extent(getDensityData(co2, centroids, year), d => d.value))
    // })
    // limits = d3.extent(limits)
    // console.log(limits)
    // OTHERWISE SET THE LIMITS BY HAND
    const limits = [50000, 4800000]

    const colour = d3
        .scaleLinear()
        .domain(limits)
        .range(d3.schemeYlOrBr[9].slice(4))

    return (year, transition) => {
        svg
            .selectAll('.co2Density')
            .data(getDensityData(co2, centroids, year))
            .join('path')
            .attr('class', 'co2Density')
            .attr('fill-opacity', 0.25)
            .attr('d', d3.geoPath())
            .transition(transition)
            .attr('fill', d => colour(d.value))
    }
}