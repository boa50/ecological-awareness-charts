import { colours } from "./constants.js"
import { getColourTransition, moveAxis, getTranslatePos, progressLimit, colourChange } from "./utils.js"

const nRows = 7
const nItems = 10
const progressStep = 1 / nRows
const imgDefaultColour = colours.standard
const imgChangedColour = colours.nonRenewableEnergy

export const imgFill = (svg, x0, x1, y0, y1, progress = 1) => {
    const housePath = 'M199.3,65.4V6.1h-32.6v29.4L128.5,0.8L2.3,113.7l20.5,20.5l17.4-15.7V255h62.3v-82h48.4v82h64.8V119.6l15.7,14.6l20.5-20.5 L199.3,65.4z'
    const imgPath = housePath
    const pathGroup = svg.select('.pathGroup')
    const imgPaddingY = 60
    const imgPaddingX = 125

    if (pathGroup.empty()) {
        const pathGroup = svg
            .append('g')
            .attr('class', 'pathGroup')
            .attr('transform', `translate(${[x0, y0]})`)

        Array(nRows).fill().map((_, i) => i).forEach(i => {
            const pathItemsClass = `pathItems-${i}`
            const isLastRow = i === (nRows - 1)
            const groupPaddingX = (nRows % 2) === 0 ? ((i + 1) % 2) * 50 : (i % 2) * 50

            const pathGroupItems = pathGroup
                .append('g')
                .attr('class', pathItemsClass)
                .attr('transform', `translate(${[groupPaddingX, isLastRow ? y1 : i * imgPaddingY]})`)
                .attr('stroke', 'transparent')
                .style('fill', isLastRow ? imgDefaultColour : 'transparent')

            Array(nItems).fill().map((_, i) => i).forEach(j => {
                pathGroupItems
                    .append('path')
                    .attr('class', 'pathItem')
                    .attr('d', imgPath)
                    .attr('transform', `translate(${[j * imgPaddingX, 0]}) scale(0.5)`)
            })
        })
    }

    Array(nRows).fill().map((_, i) => i).toReversed().forEach(i => {
        const pathItemsClass = `pathItems-${i}`
        const pathGroupItems = pathGroup.select(`.${pathItemsClass}`)
        const firstProgress = 1 - (i + 1) / nRows
        const rowProgress = progressLimit((progress - firstProgress) / progressStep)

        if (i === nRows - 1) {
            const { _, y0 } = getTranslatePos(pathGroupItems)

            pathGroupItems
                .attr('stroke', 'black')
                .attr('fill', imgDefaultColour)
                .transition('imageFillTranslate')
                .attr('transform', `translate(0, ${moveAxis(y0, i * imgPaddingY, rowProgress)})`)
        } else {
            const colour = getColourTransition(imgDefaultColour, rowProgress)

            pathGroupItems
                .transition('imageFillFill')
                .style('fill', colour)
                .attr('stroke', 'black')
                .attr('stroke-opacity', rowProgress)
        }

    })
}


export const imgRemove = (svg, progress = 1) => {
    const pathGroup = svg.select('.pathGroup')

    if (progress === 1) {
        pathGroup
            .transition('imgRemove')
            .attr('stroke', 'transparent')
            .style('fill', 'transparent')
            .remove()
    } else {

        Array(nRows).fill().map((_, i) => i).forEach(i => {
            const pathItemsClass = `pathItems-${i}`
            const pathGroupItems = pathGroup.select(`.${pathItemsClass}`)
            const firstProgress = (i / nRows) / 2
            const rowProgress = progressLimit((progress - firstProgress) / progressStep)
            const colour = getColourTransition(imgDefaultColour, 1 - rowProgress)

            pathGroupItems
                .transition('imgRemove')
                .attr('stroke-opacity', 1 - rowProgress)
                .style('fill', colour)

        })
    }
}

export const imgChangeColour = (svg, proportion = 0.75, progress = 1) => {
    const itemsPerLine = nItems * proportion
    const itemsRemaining = Math.floor((itemsPerLine - Math.floor(itemsPerLine)) * nRows)
    const lastIdxFullPaint = Math.floor(itemsPerLine) - 1
    const paintingCondition = i => i > nItems * (nRows - itemsRemaining) ?
        i % nItems <= lastIdxFullPaint + 1 :
        i % nItems <= lastIdxFullPaint

    svg
        .select('.pathGroup')
        .selectAll('.pathItem')
        .filter((_, i) => paintingCondition(i))
        .classed('pathItemColourChanged', true)
        .transition('imgChangeColour')
        .style('fill', colourChange(imgDefaultColour, imgChangedColour, progress))
}

export const imgChangeColourRemove = (svg, progress = 1) => {
    const items = svg
        .select('.pathGroup')
        .selectAll('.pathItemColourChanged')

    if (progress < 1) {
        items
            .transition('imgChangeColourRemove')
            .style('fill', colourChange(imgChangedColour, imgDefaultColour, progress))
    } else {
        items
            .style('fill', null)
            .classed('pathItemColourChanged', false)
    }
}