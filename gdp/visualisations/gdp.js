import { height, years, } from "./constants.js"
import { path, getLastGdp } from "./aux.js"
import { Legend } from "./customLegend.js"

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
        .base(4)
        .interpolator(d3.interpolateGreens)

    Legend(colour, svg, {
        title: "GDP",
        titleColour: "#777777",
        width: 200,
        yPosition: height - 60,
        marginLeft: 16,
        ticks: 5,
        tickSize: 1,
        tickFormat: ".1s",
    })

    return (year, transition) => {
        svg
            .selectAll('.gdp')
            .data(geo.features)
            .join('path')
            .attr('class', 'gdp')
            .attr('d', path)
            .attr('fill', d => colour(getLastGdp(data, d.id, year > 1960 ? year - 1 : year)))
            .transition(transition)
            .attr('fill', d => colour(getLastGdp(data, d.id, year)))
    }
}