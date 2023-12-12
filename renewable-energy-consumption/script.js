import { pxToInt } from "./utils.js"
import { createNumber, numberAddSuffix, numberChangeValue, numberMove, numberRemoveSuffix, setNumberPosition } from "./number.js"
import { imgChangeColour, imgChangeColourRemove, imgFill, imgRemove } from "./images.js"
import { groupGoAway, groupReturn } from "./groups.js"
import { circlesFilling, containerShow, setUpCircles, setUpContainer } from "./circlesFilling.js"
import { colours } from "./constants.js"

let numberStart = 0

const scrolly = d3.select('#scrolly')
const svg = scrolly.select('svg')
const article = scrolly.select('article')
const steps = article.selectAll('.step')

const group1 = svg.append('g')
const group2 = svg.append('g')

let svgWidth
let svgHeight
let svgCenterWidth
let svgCenterHeight

// const number = createNumber(svg)
const number = createNumber(group1)

const scroller = scrollama()

const handleResize = () => {
    const windowHeight = window.innerHeight

    const stepHeight = Math.floor(windowHeight)
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
            break
        case 2:
            break
        case 3:
            break
        case 4:
            break
        case 5:
            handleDirection(
                currentDirection,
                () => {
                    setUpContainer(group2, 300, svgHeight - 700, 100, 400, 'nonRenewable')
                    setUpContainer(group2, 700, svgHeight - 500, 100, 200, 'renewable')
                },
                () => { }
            )
            break
        case 6:
            handleDirection(
                currentDirection,
                () => {
                    setUpCircles(group2, 300, svgHeight - 700, 100, 400, 'nonRenewable', true, colours.nonRenewableEnergy)
                    setUpCircles(group2, 700, svgHeight - 500, 100, 200, 'renewable', true, colours.renewableEnergy)
                },
                () => { }
            )
            break
        default:
            break
    }
}

// const handleStepExit = (response) => {
//     console.log(response)
// }

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
                    numberMove(number, svgCenterWidth - 200, svgHeight * 0.2, currentProgress)
                },
                () => {
                    numberRemoveSuffix(number, 1 - currentProgress)
                    numberMove(number, svgCenterWidth, svgCenterHeight, 1 - currentProgress)
                    imgRemove(group1, svgHeight, 1 - currentProgress)
                }
            )
            break
        case 2:
            handleDirection(
                currentDirection,
                () => { imgFill(group1, 100, svgWidth, svgHeight * 0.35, svgHeight, currentProgress) },
                () => { imgChangeColourRemove(group1, 1 - currentProgress) }
            )
            break
        case 3:
            handleDirection(
                currentDirection,
                () => { imgChangeColour(group1, 0.75, currentProgress) },
                () => { groupReturn(group1, 1 - currentProgress) }
            )
            break
        case 4:
            handleDirection(
                currentDirection,
                () => { groupGoAway(group1, svgHeight, currentProgress) },
                () => {
                    containerShow(group2, 'nonRenewable', currentProgress)
                    containerShow(group2, 'renewable', currentProgress)
                }
            )
            break
        case 5:
            handleDirection(
                currentDirection,
                () => {
                    containerShow(group2, 'nonRenewable', currentProgress)
                    containerShow(group2, 'renewable', currentProgress)
                },
                () => { }
            )
            break
        case 6:
            handleDirection(
                currentDirection,
                () => {
                    circlesFilling(group2, 'nonRenewable', currentProgress)
                    circlesFilling(group2, 'renewable', currentProgress)
                },
                () => { }
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