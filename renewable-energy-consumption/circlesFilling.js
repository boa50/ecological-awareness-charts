import { colourChange, progressLimit } from "./utils.js"

export const setUpContainer = (svg, x0, y0, width, height, containerId = '') => {
    svg
        .append('g')
        .attr('id', containerId)
        .append('rect')
        .attr('x', x0)
        .attr('y', y0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'black')
        .attr('stroke-opacity', 0)
        .style('fill', 'transparent')
}

export const clearContainer = (svg, containerId = '') => {
    svg
        .select(`#${containerId}`)
        .remove()
}

export const containerShow = (svg, containerId = '', progress = 1) => {
    svg
        .select(`#${containerId}`)
        .select('rect')
        .transition('containerShow')
        .attr('stroke-opacity', progress)
}

export const setUpCircles = (svg, x0, y0, width, height, containerId = '', batched = true, circleColour = 'black') => {
    const circleRadius = 5
    const circlePadding = 2
    const circleLength = (circleRadius * 2) + circlePadding

    let nColumns = Math.floor(width / circleLength)
    nColumns = (((nColumns * circleLength) + circlePadding) > width) ? nColumns - 1 : nColumns
    let nRows = Math.floor(height / circleLength)
    nRows = (((nRows * circleLength) + circlePadding) > height) ? nRows - 1 : nRows
    const nCircles = nRows * nColumns
    const circlesTotal = Array(nCircles).fill().map((_, i) => i)
    const batch = batched ? nColumns : 1


    for (let n = 0; n < nCircles; n += batch) {
        const nRow = n / nColumns
        const data = circlesTotal.toReversed().slice(n, n + batch)

        svg
            .select(`#${containerId}`)
            .append('g')
            .attr('id', `${containerId}_g${nRow}`)
            .attr('data-y1', (circleRadius + circlePadding) + (circleLength * nRow))
            .selectAll('myCircle')
            .data(data)
            .join('circle')
            .attr('cx', d => x0 + (circleRadius + circlePadding) + (circleLength * ((d % nColumns))))
            .style('fill', circleColour)
            .attr('r', circleRadius)
            .attr('cy', y0)
    }
}

export const setUpCirclesGrouped = (svg, x0, y0, width, height, containerId = '', values, maxValue, groupsFilled = 0) => {
    const circleRadius = 5.6
    const circlePadding = 2
    const circleLength = (circleRadius * 2) + circlePadding

    let nColumns = Math.floor(width / circleLength)
    nColumns = (((nColumns * circleLength) + circlePadding) > width) ? nColumns - 1 : nColumns
    let nRows = Math.floor(height / circleLength)
    nRows = (((nRows * circleLength) + circlePadding) > height) ? nRows - 1 : nRows
    const nCircles = nRows * nColumns
    const circlesTotal = Array(nCircles).fill().map((_, i) => i)

    const circleValue = maxValue / nCircles
    const groups = values.map(d => Math.round(d / circleValue))

    for (let i = 0; i < groups.length; i++) {
        const data = circlesTotal.toReversed().slice(groups[i - 1], groups[i])

        svg
            .select(`#${containerId}`)
            .append('g')
            .attr('id', `${containerId}_g${i}`)
            .selectAll('myCircle')
            .data(data)
            .join('circle')
            .attr('cx', d => x0 + (circleRadius + circlePadding) + (circleLength * (d % nColumns)))
            .style('fill', 'transparent')
            .attr('r', circleRadius)
            .attr('cy', d => i > (groupsFilled - 1) ? y0 : y0 + (circleRadius + circlePadding) + (circleLength * Math.floor(d / nColumns)))
            .attr('data-y1', d => (circleRadius + circlePadding) + (circleLength * Math.floor(d / nColumns)))
    }
}

export const changeCirclesFill = (svg, containerId, circleColour = 'black', progress = 1, group = -1) => {
    svg
        .select(`#${containerId}`)
        .selectAll(group >= 0 ? `#${containerId}_g${group}` : 'g')
        .selectAll('circle')
        .style('fill', colourChange('transparent', circleColour, progress))
}

export const clearCircles = (svg, containerId = '') => {
    svg
        .select(`#${containerId}`)
        .selectAll('g')
        .remove()
}

export const circlesFilling = (svg, containerId = '', progress = 1) => {
    const groups = svg
        .select(`#${containerId}`)
        .selectAll('g')

    const nRows = groups.size()

    groups.each(function (_, i) {
        const progressStep = 1 / nRows
        const firstProgress = 1 - (i + 1) / nRows
        const rowProgress = progressLimit((progress - firstProgress) / progressStep)

        const group = d3.select(this)
        const y1 = group.attr('data-y1')

        group
            .transition('circlesFilling')
            .attr('transform', `translate(${[0, y1 * rowProgress]})`)
    })
}

export const circlesFillingGrouped = (svg, containerId = '', progress = 1, groupsFilled = 0, circleColour = 'black') => {
    const groups = svg
        .select(`#${containerId}`)
        .selectAll('g')
    const nGroups = groups.size()

    groups.each(function (_, i) {
        if (i > (groupsFilled - 1)) {
            const progressStep = 1 / nGroups
            const firstProgress = 1 - (nGroups - i) / nGroups
            const groupProgress = progressLimit((progress - firstProgress) / progressStep)

            const groupCirlces = d3
                .select(this)
                .selectAll('circle')

            groupCirlces.each(function () {
                const el = d3.select(this)
                const y1 = el.attr('data-y1')

                el
                    .transition('circlesFilling')
                    .duration(50)
                    .attr('transform', `translate(${[0, y1 * groupProgress]})`)
            })

            changeCirclesFill(svg, containerId, circleColour, groupProgress, i)
        }
    })
}