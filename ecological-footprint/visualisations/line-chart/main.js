import { line } from "./line.js"

const prepareData = data =>
    Array.from(data)
        .map(d => ({ 'date': new Date(d.date), 'value': d.value }))
        .sort((a, b) => d3.ascending(a.date, b.date))

export const createLineChart = (svg, data, transition) => {
    const prearedData = prepareData(data)

    line(svg, prearedData, transition)
}