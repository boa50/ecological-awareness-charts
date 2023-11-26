const formatNumber = d3.format('.2f')

function textTween(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

export const createNumber = (svg) =>
    svg
        .append('text')
        .style('font-size', '32px')

export const numberChangeValue = (number, start = 0, end, progress = 1) => {
    number
        .transition('numberChangeValue')
        .tween('text', d => textTween(start, end * progress))

    return end * progress
}

export const numberMove = (number, x1, y1, progress = 1) => {
    number
        .transition('numberMove')
        .duration(1000)
        .attr('x', x1 * progress)
        .attr('y', y1 * progress)
}