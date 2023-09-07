import { barSize, n } from "./constants.js"
import { getValue, getRank, x, y } from "./aux.js"

const formatNumber = d3.format('.2f')

function textTween(a, b) {
    const i = d3.interpolateNumber(a, b)
    return function (t) {
        this.textContent = formatNumber(i(t))
    }
}

export const labels = (svg, prev, next) => {
    let label = svg
        .append('g')
        .classed('label', true)
        .attr('font-size', barSize / 2.5)
        .selectAll('text')

    return ([date, data], transition) => label = label
        .data(data.slice(0, n), d => d.company)
        .join(
            enter => enter
                .append('text')
                .attr('transform', d => `translate(${[x(getValue(prev, d)), y(getRank(prev, d))]})`)
                .attr('y', y.bandwidth() / 2)
                .attr('x', -6)
                .attr('dy', '-0.25em')
                .text(d => d.company)
                .call(
                    text => text
                        .append('tspan')
                        .attr('x', -6)
                        .attr('dy', '1.15em')
                ),
            update => update,
            exit => exit
                .transition(transition)
                .remove()
                .attr('transform', d => `translate(${[x(getValue(next, d)), y(getRank(next, d))]})`)
                .call(
                    g => g
                        .select('tspan')
                        .tween('text', d => textTween(d.value, getValue(next, d)))
                )
        )
        .call(
            bar => bar
                .transition(transition)
                .attr('transform', d => `translate(${[x(d.value), y(d.rank)]})`)
                .call(
                    g => g
                        .select('tspan')
                        .tween('text', d => textTween(getValue(prev, d), d.value))
                )
        )
}