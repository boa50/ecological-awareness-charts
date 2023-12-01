const transitionDuration = 750

export const imageFill = (svg, x0, x1, y0, y1, progress = 1) => {
    const housePath = 'M199.3,65.4V6.1h-32.6v29.4L128.5,0.8L2.3,113.7l20.5,20.5l17.4-15.7V255h62.3v-82h48.4v82h64.8V119.6l15.7,14.6l20.5-20.5 L199.3,65.4z'
    const imgPath = housePath
    // const pathGroup = svg.select('.pathGroup')
    const nRows = 7
    const nItems = 10
    const imgPaddingY = 60
    const imgPaddingX = 125

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
            .style('fill', isLastRow ? 'grey' : 'transparent')

        Array(nItems).fill().map((_, i) => i).forEach(j => {
            pathGroupItems
                .append('path')
                .attr('d', imgPath)
                .attr('transform', `translate(${[j * imgPaddingX, 0]}) scale(0.5)`)
        })
    })

    Array(nRows).fill().map((_, i) => i).toReversed().forEach(i => {
        const pathItemsClass = `pathItems-${i}`
        const pathGroupItems = pathGroup.select(`.${pathItemsClass}`)

        if (i === nRows - 1) {
            pathGroupItems
                .attr('stroke', 'black')
                .transition('imageFillTranslate')
                .duration(transitionDuration)
                .attr('transform', `translate(${[0, i * imgPaddingY]})`)
        } else {
            pathGroupItems
                .transition('imageFillFill')
                .duration(transitionDuration)
                .delay(transitionDuration + transitionDuration * (nRows - i - 2))
                .style('fill', 'grey')
                .attr('stroke', 'black')
        }

    })

    // if (pathGroup.empty()) {
    //     svg
    //         .append('g')
    //         .attr('class', 'pathGroup')
    //         .attr('transform', `translate(${[x0, y0]})`)
    // } else {
    // const pathItemsClass = `pathItems-${Math.floor(progress / 0.1)}`
    // let pathGroupItems = pathGroup.select(`.${pathItemsClass}`)

    // if (pathGroupItems.empty()) {
    //     pathGroupItems = pathGroup
    //         .append('g')
    //         .attr('class', pathItemsClass)
    //         .attr('transform', `translate(${[0, Math.floor(progress / 0.1) * 50]})`)

    //     Array(nItems).fill().map((_, i) => i).forEach(d => {
    //         pathGroupItems
    //             .append('path')
    //             .attr('d', imgPath)
    //             .attr('transform', `translate(${[d * 125, 0]})`)
    //     })

    // }

    // }
}

export const imgRemove = (svg) => {
    svg
        .select('.pathGroup')
        .transition('imgRemove')
        .duration(750)
        .attr('stroke', 'transparent')
        .style('fill', 'red')
        .remove()
}