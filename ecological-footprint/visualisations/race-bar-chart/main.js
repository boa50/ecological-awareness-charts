import { x } from "./aux.js"
import { bars } from "./bars.js"
import { labels } from "./labels.js"
import { images } from "./images.js"
import { axis } from "./axis.js"
import { ticker } from "./ticker.js"

export const createBarChart = (svg, data, keyframes, prev, next) => {
    const updateBars = bars(svg, data, prev, next)
    const updateLabels = labels(svg, prev, next)
    const updateImages = images(svg, prev, next)
    const updateAxis = axis(svg)
    const updateTicker = ticker(svg, keyframes)

    return { updateBars, updateLabels, updateImages, updateAxis, updateTicker }
}

export const updateBarChart = (barChartFuncs, keyframe, transition) => {
    const { updateBars, updateLabels, updateImages, updateAxis, updateTicker } = barChartFuncs

    // Extract the top bar’s value
    x.domain([0, keyframe[1][0].value])

    updateBars(keyframe, transition)
    updateLabels(keyframe, transition)
    updateImages(keyframe, transition)
    updateAxis(keyframe, transition)
    updateTicker(keyframe, transition)
}