import { pxToInt } from "./utils.js"
import { createNumber, numberChangeValue, numberMove } from "./number.js"

let numberStart = 0

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('svg')
const article = scrolly.select('article')
const steps = article.selectAll('.step')

const svgDims = {
    width: 0,
    height: 0
}

const number = createNumber(svg)

const scroller = scrollama()

const handleResize = () => {
    const windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight * 0.75)
    steps.style('height', `${stepHeight}px`)

    const svgHeight = windowHeight
    const svgMarginTop = (windowHeight - svgHeight) / 2

    svg
        .attr('height', `${svgHeight}px`)
        .style('top', `${svgMarginTop}px`)

    svgDims.width = pxToInt(svg.style('width'))
    svgDims.height = pxToInt(svg.attr('height'))

    number
        .attr('x', svgDims.width / 2)
        .attr('y', svgDims.height / 2)

    d3.select('#outro').style('height', `${stepHeight}px`)

    scroller.resize()
}

const handleStepEnter = (response) => {
    const currentIndex = response.index

    steps.classed('is-active', (_, i) => i === currentIndex)

    switch (currentIndex) {
        case 0:
            numberMove(number, svgDims.width / 2, svgDims.height / 2)
            break
        case 1:
            numberMove(number, 100, 100)
            break
        default:
            break
    }
}

const handleStepExit = (response) => {
    console.log(response)
}

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress

    switch (currentIndex) {
        case 0:
            numberStart = numberChangeValue(number, numberStart, 100, currentProgress)
            break
        case 1:
            break
        default:
            break
    }

    const el = d3.select(response.element)
    el.style('background-color', `rgba(218, 165, 32, ${currentProgress})`)
    el.select('.progress').text(d3.format('.1%')(currentProgress))
}

const init = () => {
    handleResize()

    scroller
        .setup({
            step: '#scrolly article .step',
            // debug: true,
            progress: true,
            offset: 0.5
        })
        .onStepEnter(handleStepEnter)
        // .onStepExit(handleStepExit)
        .onStepProgress(handleStepProgress)

    window.addEventListener('resize', handleResize())
}

init()