export const groupFinish = (group, height = 1000) => {
    group
        .transition('groupFinish')
        .duration(3000)
        .attr('transform', `translate(0, -${height * 1.5})`)
}

export const groupReturn = group => {
    group
        .transition('groupReturn')
        .duration(3000)
        .attr('transform', 'translate(0, 0)')
}