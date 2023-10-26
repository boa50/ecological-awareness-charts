import { width, height, minYear } from "./constants.js"

const projection = d3
    .geoEquirectangular()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2])

export const path = d3
    .geoPath()
    .projection(projection)

export const getLastGdp = (data, countryCode, year) => {
    if (data.get(countryCode)) {
        if (!data.get(countryCode)[year]) {
            return year == minYear ? 0 : getLastGdp(data, countryCode, year - 1)
        }

        return data.get(countryCode)[year]
    }

    return 0
}

export const getProjection = (centroids, countryCode) => {
    const coordinates = centroids.get(countryCode)

    if (coordinates == undefined) {
        return projection([-1000, -1000])
    }

    return projection([coordinates[1], coordinates[0]])
}

export const getDensityData = (rawData, year) => d3
    .contourDensity()
    .x(d => getProjection(d.Code)[0])
    .y(d => getProjection(d.Code)[1])
    .size([width, height])
    .bandwidth(20)
    .cellSize(1)
    .weight(d => +d.Emissions)
    (rawData.filter(d => d.Year == year))