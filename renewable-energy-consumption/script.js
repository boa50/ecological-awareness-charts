import { pxToInt } from "./utils.js"
import { createNumber, numberAddSuffix, numberChangeValue, numberMove, numberRemoveSuffix, numberTransparency, setNumberPosition } from "./number.js"
import { imgChangeColour, imgChangeColourRemove, imgFill, imgRemove } from "./images.js"
import { groupGoAway, groupReturn } from "./groups.js"
import { changeCirclesFill, circlesFillingGrouped, clearCircles, clearContainer, containerShow, setUpCirclesGrouped, setUpContainer } from "./circlesFilling.js"
import { colours, energyData } from "./constants.js"

let numberActual = 0
let numberYearActual = energyData.years[0]

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

const number = createNumber(group1)
const numberYear = createNumber(group2)

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

    const circlesContainerDimension = {
        nonRenewable: {
            x: 500,
            y: svgHeight - 825,
            width: 150,
            height: 575
        },
        renewable: {
            x: 1000,
            y: svgHeight - 350,
            width: 150,
            height: 100
        }
    }

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
            handleDirection(
                currentDirection,
                () => { },
                () => {
                    clearContainer(group2, 'nonRenewable')
                    clearContainer(group2, 'renewable')
                    clearCircles(group2, 'nonRenewable')
                    clearCircles(group2, 'renewable')
                }
            )
            break
        case 5:
            handleDirection(
                currentDirection,
                () => {
                    setUpContainer(
                        group2,
                        circlesContainerDimension.nonRenewable.x,
                        circlesContainerDimension.nonRenewable.y,
                        circlesContainerDimension.nonRenewable.width,
                        circlesContainerDimension.nonRenewable.height,
                        'nonRenewable',
                        'Non Renewable'
                    )
                    setUpContainer(
                        group2,
                        circlesContainerDimension.renewable.x,
                        circlesContainerDimension.renewable.y,
                        circlesContainerDimension.renewable.width,
                        circlesContainerDimension.renewable.height,
                        'renewable',
                        'Renewable'
                    )
                    setUpCirclesGrouped(
                        group2,
                        circlesContainerDimension.nonRenewable.x,
                        circlesContainerDimension.nonRenewable.y,
                        circlesContainerDimension.nonRenewable.width,
                        circlesContainerDimension.nonRenewable.height,
                        'nonRenewable',
                        energyData.fossil, energyData.fossilMax,
                        1
                    )
                    setUpCirclesGrouped(
                        group2,
                        circlesContainerDimension.renewable.x,
                        circlesContainerDimension.renewable.y,
                        circlesContainerDimension.renewable.width,
                        circlesContainerDimension.renewable.height,
                        'renewable',
                        energyData.renewables, energyData.renewablesMax,
                        1
                    )
                },
                () => { }
            )
            setNumberPosition(numberYear, 825, 850)
            numberChangeValue(
                numberYear,
                energyData.years[0],
                numberYearActual,
                energyData.years[0],
                1,
                d3.format(`.${d3.precisionFixed(1)}f`)
            )
            break
        case 6:
            handleDirection(
                currentDirection,
                () => { },
                () => { }
            )
            break
        default:
            break
    }
}

let lastIndex = 0
let lastProgress = 0

const handleStepProgress = (response) => {
    const currentIndex = response.index
    const currentProgress = response.progress
    const currentDirection = currentIndex > lastIndex ? 'down' : currentProgress > lastProgress ? 'down' : 'up'

    switch (currentIndex) {
        case 0:
            numberActual = numberChangeValue(number, 0, numberActual, 54.59, currentProgress)
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
                () => { }
            )
            break
        case 5:
            containerShow(group2, 'nonRenewable', currentProgress)
            containerShow(group2, 'renewable', currentProgress)
            numberTransparency(numberYear, currentProgress)
            changeCirclesFill(group2, 'nonRenewable', colours.nonRenewableEnergy, currentProgress, 0)
            changeCirclesFill(group2, 'renewable', colours.renewableEnergy, currentProgress, 0)
            break
        case 6:
            circlesFillingGrouped(group2, 'nonRenewable', currentProgress, 1, colours.nonRenewableEnergy)
            circlesFillingGrouped(group2, 'renewable', currentProgress, 1, colours.renewableEnergy)
            numberYearActual = numberChangeValue(
                numberYear,
                energyData.years[0],
                numberYearActual,
                energyData.years[energyData.years.length - 1],
                currentProgress,
                d3.format(`.${d3.precisionFixed(1)}f`)
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
        .onStepProgress(handleStepProgress)

    window.addEventListener('resize', handleResize())
}

init()