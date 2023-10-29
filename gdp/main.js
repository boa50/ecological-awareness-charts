import { width, height, years, minYear } from "./visualisations/constants.js"
import { gdpMap } from "./visualisations/gdp.js"
// import { co2Circles } from "./visualisations/co2Circles.js"
import { ticker } from "./visualisations/ticker.js"
import { co2Density } from "./visualisations/co2Density.js"

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

    const updateGdpMap = gdpMap(svg, geo, data, fullData)
    // const updateCo2Circles = co2Circles(svg, co2, centroids)
    const updateCo2Density = co2Density(svg, co2, centroids)
    const updateTicker = ticker(svg, minYear)

    const chart = async () => {
        for (const year of years) {
            const transition = svg
                .transition()
                .duration(250)
                .ease(d3.easeLinear)

            updateGdpMap(year, transition)
            // updateCo2Circles(year, transition)
            updateCo2Density(year, transition)
            updateTicker(year, transition)

            await transition.end()
        }
    }

    chart()
})