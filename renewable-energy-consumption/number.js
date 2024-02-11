import { getTranslatePos, textTweenNumber, moveAxis } from "./utils.js"

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

export const numberChangeValue = (number, initial = 0, actual = 0, end, progress = 1, numberFormat = d3.format('.2f')) => {
    const nextNumber = initial + (end - initial) * progress

    number
        .select('.el-number')
        .transition('numberChangeValue')
        .tween('text', d => textTweenNumber(actual, nextNumber, numberFormat))

    return nextNumber
}

export const numberMove = (number, x1, y1, progress = 1) => {
    const { x0, y0 } = getTranslatePos(number)

    number
        .transition('numberMove')
        .attr('transform', `translate(${[moveAxis(x0, x1, progress), moveAxis(y0, y1, progress)]})`)
}

export const numberAddSuffix = (number, suffix, progress = 1) => {
    if (number.select('.el-suffix').empty()) {
        number
            .append('text')
            .attr('class', 'el-suffix')
            .attr('x', 400)
            .style('fill', 'transparent')
            .text(`${suffix}`)
    } else {
        number
            .select('.el-suffix')
            .transition('numberAddSuffix')
            .style('fill', `rgba(0, 0, 0, ${progress})`)
    }
}

export const numberRemoveSuffix = (number, progress = 1) => {
    const elSuffix = number.select('.el-suffix')

    if (progress === 1) {
        elSuffix
            .transition('numberRemoveSuffix')
            .style('fill', 'transparent')
            .remove()
    } else {
        elSuffix
            .transition('numberRemoveSuffix')
            .style('fill', `rgba(0, 0, 0, ${1 - progress})`)
    }
}

export const numberTransparency = (number, progress = 1) => {
    number
        .style('fill', `rgba(0, 0, 0, ${progress})`)
}