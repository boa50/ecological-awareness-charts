const getData = async () =>
    d3.csv('./data/ghg-per-kg-poore.csv', d => {
        return {
            Edible: d.Entity,
            Emissions: +d['GHG emissions per kilogram (Poore & Nemecek, 2018)']
        }
    })

const svgWidth = 600
const svgHeight = 500
const margin = {
    left: 100,
    right: 22,
    top: 42,
    bottom: 0
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom
const barSize = 20
const nElements = 15
const barPadding = 0.1

getData().then(data => {
    data = d3
        .sort(data, (a, b) => d3.descending(a.Emissions, b.Emissions))
        .filter((_, i) => i < nElements)
    const edibles = [...new Set(data.map((d) => d.Edible))]

    const svg = d3
        .select('#chart')
        .attr('width', svgWidth)
        .attr('height', svgHeight)

    const chart = svg
        .append('g')
        .attr('transform', `translate(${[margin.left, margin.top]})`)

    const x = d3
        .scaleLinear()
        // .domain([0, d3.max(data, d => d.Emissions) * 1.05])
        .domain([0, 100])
        .range([0, width])
    chart
        .append('g')
        .call(
            d3
                .axisTop(x)
                .tickSizeOuter(0)
                .ticks(5)
        )
    chart
        .append('g')
        .append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', -30)
        .attr('text-anchor', 'middle')
        .text('GHG Emissions per Kilogram')

    const y = d3
        .scaleBand()
        .domain(edibles)
        .range([0, height])
        .padding(barPadding)
    const axisLeft = chart
        .append('g')
        .call(
            d3
                .axisLeft(y)
                .tickSizeOuter(0)
        )
    axisLeft.selectAll('.tick line').remove()
    axisLeft.select('.domain').remove()

    const nonVeganColour = d3.schemeGreys[9][2]
    const veganColour = d3.schemeGreens[9][5]

    const colour = d3
        .scaleOrdinal()
        .domain(edibles)
        .range([
            nonVeganColour,
            veganColour,
            nonVeganColour,
            nonVeganColour,
            veganColour,
            nonVeganColour,
            nonVeganColour,
            nonVeganColour,
            nonVeganColour,
            nonVeganColour,
            nonVeganColour,
            veganColour,
            veganColour,
            veganColour,
            veganColour,
        ])

    chart
        .selectAll('.bars')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.Edible))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.Emissions))
        .attr('fill', d => colour(d.Edible))

    chart
        .selectAll('image')
        .data(data)
        .join('image')
        .attr('xlink:href', d => `./img/${d.Edible}.png`)
        .attr('height', 20)
        .attr('y', y.bandwidth() / 10)
        .attr('x', d => x(d.Emissions) + 5)
        .attr('transform', d => `translate(0, ${y(d.Edible)})`)

    chart
        .append('image')
        .attr('xlink:href', './img/lettuce.webp')
        .attr('height', 200)
        .attr('y', height - 250)
        .attr('x', width - 200)
        .style('opacity', 0.5)
})