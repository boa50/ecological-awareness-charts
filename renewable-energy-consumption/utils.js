export const pxToInt = size => +size.replace('px', '')

export const getColourTransition = (colour, progress) => d3.color(colour).copy({ opacity: progress })

const formatNumber = d3.format('.2f')

export function textTweenNumber(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

export const getTranslatePos = (g) => {
    const tMatrix = g.node()
        .transform
        .baseVal
        .getItem(0)
        .matrix

    return { x0: tMatrix.e, y0: tMatrix.f }
}