import { moveAxis, getTranslatePos } from "./utils.js"

export const groupGoAway = (group, height = 1000, progress = 1) => {
    group
        .transition('groupGoAway')
        .attr('transform', `translate(0, -${moveAxis(0, height * 1.5, progress)})`)
}

export const groupReturn = (group, progress = 1) => {
    const { _, y0 } = getTranslatePos(group)

    group
        .transition('groupReturn')
        .attr('transform', `translate(0, ${moveAxis(y0, 0, progress)})`)
}