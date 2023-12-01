import { pxToInt } from "./utils.js"
import { createNumber, numberAddSuffix, numberChangeValue, numberMove, numberRemoveSuffix, setNumberPosition } from "./number.js"
import { imageFill, imgRemove } from "./images.js"

let numberStart = 0

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('svg')
const article = scrolly.select('article')
const steps = article.selectAll('.step')

let svgWidth
let svgHeight
let svgCenterWidth
let svgCenterHeight

const number = createNumber(svg)

const scroller = scrollama()

const handleResize = () => {
    const windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight * 0.75)
    steps.style('height', `${stepHeight}px`)

    svgHeight = windowHeight
    const svgMarginTop = (windowHeight - svgHeight) / 2

    svg
        .attr('height', `${svgHeight}px`)
        .style('top', `${svgMarginTop}px`)

    svgWidth = pxToInt(svg.style('width'))
    svgCenterWidth = svgWidth / 2
    svgCenterHeight = svgHeight / 2

    setNumberPosition(number, svgCenterWidth, svgCenterHeight)

    d3.select('#outro').style('height', `${stepHeight}px`)

    scroller.resize()
}

const handleDirection = (currentDirection, funcDown, funcUp) => {
    currentDirection === 'down' ? funcDown() : funcUp()
}

const handleStepEnter = (response) => {
    steps.classed('is-active', (_, i) => i === response.index)
    const currentIndex = response.index
    const currentDirection = response.direction


    switch (currentIndex) {
        case 0:
            break
        case 1:
            handleDirection(
                currentDirection,
                () => { },
                () => { imgRemove(svg) }
            )
            break
        case 2:
            handleDirection(
                currentDirection,
                () => { imageFill(svg, 100, svgWidth, svgHeight * 0.35, svgHeight) },
                () => { }
            )
            break
        default:
            break
    }
}

const handleStepExit = (response) => {
    console.log(response)
}

let lastIndex = 0
let lastProgress = 0

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress
    const currentDirection = currentIndex > lastIndex ? 'down' : currentProgress > lastProgress ? 'down' : 'up'

    switch (currentIndex) {
        case 0:
            numberStart = numberChangeValue(number, numberStart, 54.59, currentProgress)
            break
        case 1:
            handleDirection(
                currentDirection,
                () => {
                    numberMove(number, svgCenterWidth, svgHeight * 0.2, currentProgress)
                    numberAddSuffix(number, 'billion t', currentProgress)
                },
                () => {
                    numberRemoveSuffix(number, 1 - currentProgress)
                    numberMove(number, svgCenterWidth, svgCenterHeight, 1 - currentProgress)
                }
            )
            break
        case 2:
            // imageFill(svg, 100, svgWidth, svgHeight * 0.2, svgHeight, currentProgress)
            // handleDirection(
            //     currentDirection,
            //     () => { numberMove(number, 100, 100, currentProgress) },
            //     () => { numberMove(number, svgCenterWidth, svgCenterHeight, 1 - currentProgress) }
            // )
            break
        default:
            break
    }

    lastIndex = response.index
    lastProgress = response.progress
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