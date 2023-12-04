export const pxToInt = size => +size.replace('px', '')

export const getColourTransition = (colour, progress) => d3.color(colour).copy({ opacity: progress })

const formatNumber = d3.format('.2f')

export function textTweenNumber(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

export const getTranslatePos = g => {
    if (g.node()) {
        const tMatrix = g.node()
            .transform
            .baseVal
            .getItem(0)
            .matrix

        return { x0: tMatrix.e, y0: tMatrix.f }
    }

    return { x0: 0, y0: 0 }
}

export const moveAxis = (a0, a1, progress) =>
    a0 < a1 ? (a0 - (a0 - a1) * progress) : (a0 + (a1 - a0) * progress)

export const progressLimit = value => value > 1 ? 1 : value < 0 ? 0 : value