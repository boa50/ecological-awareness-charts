import { width, height, years, minYear } from "./visualisations/constants.js"
import { gdpMap } from "./visualisations/gdp.js"
import { co2Circles } from "./visualisations/co2Circles.js"
import { ticker } from "./visualisations/ticker.js"

let data = new Map()
let centroids = new Map()
const getData = async () =>
    Promise.all([
        d3.json('./data/world.geojson'),
        d3.csv('./data/dataset.csv', d => { data.set(d['Country Code'], d) }),
        d3.csv('./data/dataset.csv'),
        d3.csv('./data/co2-emissions-filtered.csv'),
        d3.csv('./data/centroids.csv', d => { centroids.set(d.code, [+d.latitude, +d.longitude]) })
    ])

getData().then(dataset => {
    const geo = dataset[0]
    const fullData = dataset[2]
    const co2 = dataset[3]


    const svg = d3
        .select('#mapChart')
        .attr('width', width)
        .attr('height', height)

    const updateGdpMap = gdpMap(svg, geo, data, fullData, years)
    const updateCo2Circles = co2Circles(svg, co2, centroids)
    const updateTicker = ticker(svg, minYear)

    const chart = async () => {
        for (const year of years) {
            const transition = svg
                .transition()
                .duration(250)
                .ease(d3.easeLinear)

            updateGdpMap(year, transition)
            updateCo2Circles(year, transition)
            updateTicker(year, transition)

            await transition.end()
        }
    }

    chart()


    // USED ONLY IF THE LIMITS HAVE CHANGED
    // let limits = []
    // years.forEach(year => {
    //     limits.push(...d3.extent(getDensityData(co2, year), d => d.value))
    // })
    // limits = d3.extent(limits)
    // console.log(limits)
    // OTHERWISE SET THE LIMITS BY HAND
    // let limits = [50000, 4800000]

    // const densityData = getDensityData(co2, 2021)

    // const color = d3.scaleLinear()
    //     .domain(limits)
    //     .range(["yellow", "red"])

    // svg
    //     .insert('g', 'g')
    //     .selectAll('path')
    //     .data(densityData)
    //     .join('path')
    //     .attr('d', d3.geoPath())
    //     .attr('fill', d => color(d.value))
    //     .attr('fill-opacity', 0.1)

})