const formatNumber = d3.format('.2f')

function textTween(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

const getTranslatePos = (g) => {
    const tMatrix = g.node()
        .transform
        .baseVal
        .getItem(0)
        .matrix

    return { x0: tMatrix.e, y0: tMatrix.f }
}

export const createNumber = (svg) => {
    const number = svg
        .append('g')
        .style('font-size', '7rem')
        .style('text-anchor', 'middle')

    number
        .append('text')
        .attr('class', 'el-number')
        .attr('alignment-baseline', 'central')

    return number
}

export const setNumberPosition = (number, x, y) => {
    number
        .attr('transform', `translate(${[x, y]})`)
}

export const numberChangeValue = (number, start = 0, end, progress = 1) => {
    number
        .select('.el-number')
        .transition('numberChangeValue')
        .tween('text', d => textTween(start, end * progress))

    return end * progress
}

export const numberMove = (number, x1, y1, progress = 1) => {
    const { x0, y0 } = getTranslatePos(number)
    const x = x0 < x1 ? (x0 - (x0 - x1) * progress) : (x0 + (x1 - x0) * progress)
    const y = y0 < y1 ? (y0 - (y0 - y1) * progress) : (y0 + (y1 - y0) * progress)

    number
        .transition('numberMove')
        .attr('transform', `translate(${[x, y]})`)
}

export const numberAddSufix = (number, sufix) => {
    number
        .append('text')
        .attr('class', 'el-sufix')
        .attr('x', 400)
        .style('fill', 'transparent')
        .text(`${sufix}`)
        .transition('numberAddSufix')
        .duration(250)
        .style('fill', 'black')
}

export const numberRemoveSufix = (number) => {
    number
        .select('.el-sufix')
        .transition('numberRemoveSufix')
        .style('fill', 'transparent')
        .remove()
}