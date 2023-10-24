let data = new Map()
const getData = async () =>
    Promise.all([
        d3.json('./data/world.geojson'),
        d3.csv('./data/dataset.csv', d => { data.set(d['Country Code'], d) }),
        d3.csv('./data/dataset.csv')
    ])

const width = 600
const height = 500
const minYear = 1960
const maxYear = 2021

const projection = d3
    .geoEquirectangular()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2])
const path = d3
    .geoPath()
    .projection(projection)

const getLastGdp = (countryCode, year) => {
    if (data.get(countryCode)) {
        if(!data.get(countryCode)[year]) {
            return year == minYear ? 0 : getLastGdp(countryCode, year - 1)
        }

        return data.get(countryCode)[year]
    }

    return 0
}

getData().then(dataset => {
    const geo = dataset[0]
    const fullData = dataset[2]
    const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => i + minYear)

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


    const svg = d3
        .select('#mapChart')
        .attr('width', width)
        .attr('height', height)


    const chart = async () => {

        const ticker = svg
            .append('text')
            .attr('font-size', 20)
            .attr('x', width - 126)
            .attr('y', height - 100)
            .attr('dy', '0.32em')
            .text(years[0])

        for (const year of years) {
            const transition = svg
                .transition()
                .duration(250)
                .ease(d3.easeLinear)

            svg
                .selectAll('path')
                .data(geo.features)
                .join('path')
                .transition(transition)
                .attr('d', path)
                .attr('fill', d => colour(getLastGdp(d.id, year)))

            transition.end().then(() => ticker.text(year))

            await transition.end()
        }
    }

    chart()
})