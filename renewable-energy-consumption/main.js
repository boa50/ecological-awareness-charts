import { circlesFilling } from "./circlesFilling.js"

const width = 400
const height = 400

// Dimensions
const startX = width / 2
const startY = height / 4
const radius = 20

const bodyHeight = 70
const bodyWidth = radius * 2
const bodyStartX = startX - radius
const bodyStartY = startY + radius

const legHeight = 55
const legWidth = bodyWidth * 0.35
const legLeftStartX = startX - radius
const legRightStartX = startX + radius - legWidth
const legStartY = startY + radius + bodyHeight

const svg = d3
    .select('#chart1')
    .attr('width', width)
    .attr('height', height)

const draw = () => {
    const context = d3.path()

    context.arc(startX, startY, radius, 0, 2 * Math.PI)

    context.rect(bodyStartX, bodyStartY, bodyWidth, bodyHeight)

    context.rect(legLeftStartX, legStartY, legWidth, legHeight)
    context.rect(legRightStartX, legStartY, legWidth, legHeight)

    return context
}


svg
    .append('path')
    .attr('d', draw())
    .style('fill', 'silver')

circlesFilling(svg, bodyWidth, bodyHeight, bodyStartX, bodyStartY)




// svg
//     .append('defs')
//     // .append('clipPath')
//     // .attr('id', 'clpObj')
//     .append('circle')
//     .attr('cx', 50)
//     .attr('cy', 50)
//     .attr('r', 50)
//     .style('fill', '#FF00FF')

// svg
//     .append('rect')
//     .attr('y', 0)
//     .attr('x', 100)
//     .attr('height', 200)
//     .attr('width', 300)
//     .style('fill', '#cccccc')
// // .style('clip-path', 'url(#clpObj)')




// const pth = 'm2,106h28l24,30h72l-44,-133h35l80,132h98c21,0 21,34 0,34l-98,0 -80,134h-35l43,-133h-71l-24,30h-28l15,-47'
// const ptt = svg
//     .append('path')
//     .attr('d', pth)
//     .style('fill', 'transparent')
//     .attr('stroke', '#cccccc')
// 
// ptt
//     .append('circle')
//     .attr('cx', 50)
//     .attr('cy', 50)
//     .attr('r', 30)
//     .style('fill', 'gold')