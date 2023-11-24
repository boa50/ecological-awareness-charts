export const circlesFilling = (svg, width, height, x0, y0) => {

    const circleRadius = 2
    const circlePadding = 0.8
    const circleLength = (circleRadius * 2) + circlePadding

    let nColumns = Math.floor(width / circleLength)
    nColumns = (((nColumns * circleLength) + circlePadding) > width) ? nColumns - 1 : nColumns
    let nRows = Math.floor(height / circleLength)
    nRows = (((nRows * circleLength) + circlePadding) > height) ? nRows - 1 : nRows
    const nCircles = nRows * nColumns
    const circlesTotal = Array(nCircles).fill().map((_, i) => i)

    const circlesAnimation = async () => {
        for (const n of circlesTotal) {
            const circles = svg
                .selectAll('circle')

            const transition = svg
                .transition()
                .duration(50)

            const data = circlesTotal.toReversed().slice(0, n + 1)

            await circles
                .data(data)
                .join('circle')
                .attr('cx', d => x0 + (circleRadius + circlePadding) + (circleLength * ((d % nColumns))))
                .transition(transition)
                .attr('cy', d => y0 + (circleRadius + circlePadding) + (circleLength * (Math.floor(d / nColumns))))
                .attr('r', circleRadius)
                .style('fill', 'red')
                .end()
        }
    }

    circlesAnimation()
}