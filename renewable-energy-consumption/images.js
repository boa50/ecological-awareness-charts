import { colours } from "./constants.js"
import { paths } from "./path.js"
import { getColourTransition, moveAxis, getTranslatePos, progressLimit, colourChange, getGroupOpacity } from "./utils.js"

const nRows = 7
const nItems = 10
const progressStep = 1 / nRows
const imgDefaultColour = colours.standard
const imgChangedColour = colours.nonRenewableEnergy

const isLastRow = i => i === (nRows - 1)

export const imgFill = (svg, x0, x1, y0, y1, progress = 1) => {
    const imgPath = paths.house[0]
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
            const groupPaddingX = (nRows % 2) === 0 ? ((i + 1) % 2) * 50 : (i % 2) * 50

            const pathGroupItems = pathGroup
                .append('g')
                .attr('class', pathItemsClass)
                .attr('transform', `translate(${[groupPaddingX, isLastRow(i) ? y1 : i * imgPaddingY]})`)
                .attr('stroke', 'transparent')
                .style('fill', isLastRow(i) ? imgDefaultColour : 'transparent')

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

        if (isLastRow(i)) {
            const { _, y0 } = getTranslatePos(pathGroupItems)

            pathGroupItems
                .attr('stroke', 'black')
                .attr('stroke-opacity', 1)
                .style('fill', imgDefaultColour)
                .transition('imageFillTranslate')
                .duration(50)
                .attr('transform', `translate(0, ${moveAxis(y0, y0, i * imgPaddingY, rowProgress)})`)
        } else {
            if (pathGroupItems.empty()) return

            const groupOpacity = getGroupOpacity(pathGroupItems)
            const colour = getColourTransition(imgDefaultColour, rowProgress + groupOpacity)

            pathGroupItems
                .transition('imageFillFill')
                .duration(50)
                .style('fill', colour)
                .attr('stroke', 'black')
                .attr('stroke-opacity', rowProgress + groupOpacity)
        }

    })
}


export const imgRemove = (svg, y1, progress = 1) => {
    const pathGroup = svg.select('.pathGroup')

    if (progress === 1) {
        pathGroup
            .transition('imgRemove')
            .duration(50)
            .attr('stroke', 'transparent')
            .style('fill', 'transparent')
            .remove()
    } else {

        Array(nRows).fill().map((_, i) => i).forEach(i => {
            const pathItemsClass = `pathItems-${i}`
            const pathGroupItems = pathGroup.select(`.${pathItemsClass}`)
            const firstProgress = (i / nRows) / 2
            const rowProgress = progressLimit((progress - firstProgress) / progressStep)
            const groupOpacity = getGroupOpacity(pathGroupItems)
            const colour = getColourTransition(imgDefaultColour, groupOpacity - rowProgress)

            if (isLastRow(i)) {
                const { _, y0 } = getTranslatePos(pathGroupItems)

                pathGroupItems
                    .transition('imgRemoveTranslate')
                    .duration(50)
                    .attr('transform', `translate(0, ${moveAxis(y0, y0, y1, rowProgress)})`)
            }

            pathGroupItems
                .transition('imgRemoveFill')
                .duration(50)
                .attr('stroke-opacity', groupOpacity - rowProgress)
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

    const items = svg
        .select('.pathGroup')
        .selectAll('.pathItem')
        .filter((_, i) => paintingCondition(i))

    let imgActualColour = d3.style(items.node(), 'fill') === 'rgba(0, 0, 0, 0)' ? imgDefaultColour : d3.style(items.node(), 'fill')
    imgActualColour = d3.color(imgActualColour).copy({ opacity: 1 })

    items
        .classed('pathItemColourChanged', true)
        .transition('imgChangeColour')
        .duration(50)
        .style('fill', colourChange(imgActualColour, imgChangedColour, progress))

}

export const imgChangeColourRemove = (svg, progress = 1) => {
    const items = svg
        .select('.pathGroup')
        .selectAll('.pathItemColourChanged')

    if (items.empty()) return

    if (progress < 1) {
        items
            .transition('imgChangeColourRemove')
            .duration(50)
            .style('fill', colourChange(d3.style(items.node(), 'fill'), imgDefaultColour, progress))
    } else {
        items
            .classed('pathItemColourChanged', false)
            .transition('imgChangeColourRemove')
            .duration(50)
            .style('fill', null)
    }
}