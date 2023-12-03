export const containerDraw = (svg, x0, y0, width, height, containerId = '') => {
    svg
        .append('g')
        .attr('id', containerId)
        .append('rect')
        .attr('x', x0)
        .attr('y', y0)
        .attr('width', width)
        .attr('height', height)
        .attr('stroke', 'transparent')
        .style('fill', 'transparent')
        .transition('containerDraw')
        .duration(1000)
        .attr('stroke', 'black')
}

export const circlesFilling = (svg, x0, y0, width, height, containerId = '', batched = true, circleColour = 'black') => {
    const circleRadius = 7
    const circlePadding = 2
    const circleLength = (circleRadius * 2) + circlePadding

    let nColumns = Math.floor(width / circleLength)
    nColumns = (((nColumns * circleLength) + circlePadding) > width) ? nColumns - 1 : nColumns
    let nRows = Math.floor(height / circleLength)
    nRows = (((nRows * circleLength) + circlePadding) > height) ? nRows - 1 : nRows
    const nCircles = nRows * nColumns
    const circlesTotal = Array(nCircles).fill().map((_, i) => i)
    const batch = batched ? nColumns : 1

    const circlesAnimation = async () => {
        for (let n = 0; n <= nCircles; n += batch) {
            const circles = svg
                .select(`#${containerId}`)
                .selectAll('circle')

            const data = circlesTotal.toReversed().slice(0, n)

            await circles
                .data(data)
                .join('circle')
                .attr('cx', d => x0 + (circleRadius + circlePadding) + (circleLength * ((d % nColumns))))
                .transition('circlesFilling')
                .duration(50)
                .attr('cy', d => y0 + (circleRadius + circlePadding) + (circleLength * (Math.floor(d / nColumns))))
                .attr('r', circleRadius)
                .style('fill', circleColour)
                .end()
        }
    }

    circlesAnimation()
}