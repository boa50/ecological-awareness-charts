import { pxToInt } from "./utils.js"
import { createNumber, numberAddSufix, numberChangeValue, numberMove, numberRemoveSufix, setNumberPosition } from "./number.js"

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

    setNumberPosition(number, svgDims.width / 2, svgDims.height / 2)

    d3.select('#outro').style('height', `${stepHeight}px`)

    scroller.resize()
}

const handleDirection = (currentDirection, funcDown, funcUp) => {
    currentDirection === 'down' ? funcDown() : funcUp()
}

const handleStepEnter = (response) => {
    const currentIndex = response.index
    const currentDirection = response.direction

    steps.classed('is-active', (_, i) => i === currentIndex)

    switch (currentIndex) {
        case 0:
            handleDirection(
                currentDirection,
                () => { },
                () => { numberRemoveSufix(number) }
            )
            break
        case 1:
            handleDirection(
                currentDirection,
                () => { numberAddSufix(number, 'billion t') },
                () => { }
            )
            break
        case 2:
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
            break
        case 2:
            handleDirection(
                currentDirection,
                () => { numberMove(number, 100, 100, currentProgress); console.log('wharever'); },
                () => { numberMove(number, svgDims.width / 2, svgDims.height / 2, 1 - currentProgress) }
            )
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