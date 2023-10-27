import { years } from "./constants.js"
import { path, getLastGdp } from "./aux.js"

export const gdpMap = (svg, geo, data, fullData) => {
    const colour = d3
        .scaleSequentialLog()
        .domain(d3.extent(((data, columns) => {
            let res = []

            data.forEach(item => {
                columns.forEach(col => {
                    res = res.concat(+item[col])
                })
            })

            return res.filter(d => d > 0)
        })(fullData, years)))
        .interpolator(d3.interpolateGreens)


    return (year, transition) => {
        svg
            .selectAll('.gdp')
            .data(geo.features)
            .join('path')
            .attr('class', 'gdp')
            .attr('d', path)
            .attr('fill', d => colour(getLastGdp(data, d.id, year > 1960 ? year-1 : year)))
            .transition(transition)
            .attr('fill', d => colour(getLastGdp(data, d.id, year)))
    }

}