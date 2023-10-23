let data = new Map()
const getData = async () =>
    Promise.all([
        d3.json('./data/world.geojson'),
        d3.csv('./data/dataset.csv', d => { data.set(d['Country Code'], +d['2021']) }),
        d3.csv('./data/dataset.csv')
    ])

const width = 600
const height = 500

const projection = d3
    .geoEquirectangular()
    .scale(70)
    .center([0, 20])
    .translate([width / 2, height / 2])
const path = d3
    .geoPath()
    .projection(projection)
const colour = d3
    .scaleThreshold()
    .domain([100000, 1000000])
    .range(d3.schemeBlues[3])

getData().then(dataset => {
    const geo = dataset[0]
    const fullData = dataset[2]

    const years = ['2020', '2021', '2022']



    // Get the extent and split in specified groups ignoring 0 values 
    console.log(d3.extent(((data, columns) => {
        let res = []

        data.forEach(item => {
            columns.forEach(col => {
                res = res.concat(+item[col])

            })
        })

        return res.filter(d => d > 0)
    })(fullData, years)));

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
        .interpolator(d3.interpolateBlues)


    const svg = d3
        .select('#mapChart')
        .attr('width', width)
        .attr('height', height)

    svg
        .selectAll('path')
        .data(geo.features)
        .join('path')
        .attr('d', path)
        .attr('fill', d => colour(data.get(d.id) || 0))
})