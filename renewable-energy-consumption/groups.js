import { moveAxis, getTranslatePos } from "./utils.js"

export const groupGoAway = (group, height = 1000, progress = 1) => {
    group
        .transition('groupGoAway')
        .duration(50)
        .attr('transform', `translate(0, -${moveAxis(0, 0, height * 1.5, progress)})`)
}

export const groupReturn = (group, progress = 1) => {
    const { _, y0 } = getTranslatePos(group)

    group
        .transition('groupReturn')
        .duration(50)
        .attr('transform', `translate(0, ${moveAxis(y0, y0, 0, progress)})`)
}

export const groupMoveEl = (grp, xInit = null, x1 = null, yInit = null, y1 = null, progress = 1) => {
    const { x0, y0 } = getTranslatePos(grp)

    grp
        .attr('transform', `translate(${[
            x1 !== null ? moveAxis(xInit, x0, x1, progress) : x0,
            y1 !== null ? moveAxis(yInit, y0, y1, progress) : y0
        ]})`)
}

export const groupMove = (svg, id, xInit = null, x1 = null, yInit = null, y1 = null, progress = 1) => {
    const grp = svg.select(`#${id}`)
    groupMoveEl(grp, xInit, x1, yInit, y1, progress)
}

export const groupMoveY = (svg, id, yInit, y1, progress = 1) => {
    groupMove(svg, id, null, null, yInit, y1, progress)
}

export const groupMoveX = (svg, id, xInit, x1, progress = 1) => {
    groupMove(svg, id, xInit, x1, null, null, progress)
}