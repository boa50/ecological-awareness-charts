const getData = async () =>
    d3.csv('./data/ghg-per-kg-poore.csv', d => {
        return {
            Edible: d.Entity,
            Emissions: +d['GHG emissions per kilogram (Poore & Nemecek, 2018)']
        }
    })

const svgWidth = 600
const svgHeight = 400
const margin = {
    left: 128,
    right: 16,
    top: 22,
    bottom: 8
}
const width = svgWidth - margin.left - margin.right
const height = svgHeight - margin.top - margin.bottom
const barSize = 20
const nElements = 10
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

    chart
        .selectAll('.bars')
        .data(data)
        .join('rect')
        .attr('x', x(0))
        .attr('y', d => y(d.Edible))
        .attr('height', y.bandwidth())
        .attr('width', d => x(d.Emissions))

})