import { pxToInt } from "./utils.js"
import { createNumber, numberAddSuffix, numberChangeValue, numberRemoveSuffix, numberTransparency, setNumberPosition } from "./number.js"
import { imgChangeColour, imgChangeColourRemove, imgFill, imgRemove } from "./images.js"
import { groupGoAway, groupReturn, groupMoveY, groupMoveEl, removeGroup } from "./groups.js"
import { changeCirclesFill, circlesFillingGrouped, clearContainer, containerShow, setUpCirclesGrouped, setUpContainer } from "./circlesFilling.js"
import { colours, energyData, ids, dimensions as dimensionsDefault } from "./constants.js"
import { setUpText } from "./text.js"
import { drawHorizontalLine } from "./lines.js"

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
let dimensions

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

    dimensions = dimensionsDefault(svgHeight)

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
            handleDirection(
                currentDirection,
                () => { },
                () => {
                    clearContainer(group2, ids.nonRenewable)
                    clearContainer(group2, ids.renewable)
                }
            )
            break
        case 5:
            handleDirection(
                currentDirection,
                () => {
                    setUpContainer(
                        group2,
                        dimensions.circlesContainer.nonRenewable.x,
                        dimensions.circlesContainer.nonRenewable.y,
                        dimensions.circlesContainer.nonRenewable.width,
                        dimensions.circlesContainer.nonRenewable.height,
                        ids.nonRenewable,
                        'Non Renewable'
                    )
                    setUpContainer(
                        group2,
                        dimensions.circlesContainer.renewable.x,
                        dimensions.circlesContainer.renewable.y,
                        dimensions.circlesContainer.renewable.width,
                        dimensions.circlesContainer.renewable.height,
                        ids.renewable,
                        'Renewable'
                    )
                    setUpCirclesGrouped(
                        group2,
                        dimensions.circlesContainer.nonRenewable.x,
                        dimensions.circlesContainer.nonRenewable.y,
                        dimensions.circlesContainer.nonRenewable.width,
                        dimensions.circlesContainer.nonRenewable.height,
                        ids.nonRenewable,
                        energyData.fossil, energyData.fossilMax,
                        1
                    )
                    setUpCirclesGrouped(
                        group2,
                        dimensions.circlesContainer.renewable.x,
                        dimensions.circlesContainer.renewable.y,
                        dimensions.circlesContainer.renewable.width,
                        dimensions.circlesContainer.renewable.height,
                        ids.renewable,
                        energyData.renewables, energyData.renewablesMax,
                        1
                    )
                },
                () => { }
            )
            setNumberPosition(numberYear, dimensions.yearNumber.x, dimensions.yearNumber.y)
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
                () => { removeGroup(group2, ids.energiesComparison) }
            )
            break
        case 7:
            handleDirection(
                currentDirection,
                () => {
                    setUpText(
                        group2,
                        ids.energiesComparison,
                        dimensions.comparisonText.x,
                        dimensions.comparisonText.y0,
                        'black',
                        energyData.renewablesPercentage.toFixed(0) + '%',
                        'start'
                    )
                },
                () => { removeGroup(group2, ids.lineEnergiesComparison) }
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
                    groupMoveEl(number, svgCenterWidth, svgCenterWidth - 200, svgCenterHeight, svgHeight * 0.2, currentProgress)
                    numberAddSuffix(number, 'billion t', currentProgress)
                },
                () => {
                    numberRemoveSuffix(number, 1 - currentProgress)
                    groupMoveEl(number, svgCenterWidth - 200, svgCenterWidth, svgHeight * 0.2, svgCenterHeight, 1 - currentProgress)
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
            containerShow(group2, ids.nonRenewable, currentProgress)
            containerShow(group2, ids.renewable, currentProgress)
            numberTransparency(numberYear, currentProgress)
            changeCirclesFill(group2, ids.nonRenewable, colours.nonRenewableEnergy, currentProgress, 0)
            changeCirclesFill(group2, ids.renewable, colours.renewableEnergy, currentProgress, 0)
            break
        case 6:
            circlesFillingGrouped(group2, ids.nonRenewable, currentProgress, 1, colours.nonRenewableEnergy)
            circlesFillingGrouped(group2, ids.renewable, currentProgress, 1, colours.renewableEnergy)
            numberYearActual = numberChangeValue(
                numberYear,
                energyData.years[0],
                numberYearActual,
                energyData.years[energyData.years.length - 1],
                currentProgress,
                d3.format(`.${d3.precisionFixed(1)}f`)
            )
            break
        case 7:
            handleDirection(
                currentDirection,
                () => { groupMoveY(group2, ids.energiesComparison, dimensions.comparisonText.y0, dimensions.comparisonText.y1, currentProgress) },
                () => { groupMoveY(group2, ids.energiesComparison, dimensions.comparisonText.y1, dimensions.comparisonText.y0, 1 - currentProgress) }
            )
            break
        case 8:
            drawHorizontalLine(
                group2,
                ids.lineEnergiesComparison,
                dimensions.lineEnergiesComparison.x0,
                dimensions.lineEnergiesComparison.x1,
                dimensions.lineEnergiesComparison.y,
                colours.renewableEnergy,
                currentProgress
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