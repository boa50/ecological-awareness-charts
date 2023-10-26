import { path, getLastGdp } from "./aux.js"

export const gdpMap = (svg, geo, data, fullData, years) => {
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

    svg
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => colour(getLastGdp(data, d.id, years[0])))


    return (year, transition) => {
        svg
            .selectAll('path')
            .data(geo.features)
            .join('path')
            .transition(transition)
            .attr('d', path)
            .attr('fill', d => colour(getLastGdp(data, d.id, year)))
    }

}