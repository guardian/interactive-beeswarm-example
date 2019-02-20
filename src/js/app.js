import * as d3 from 'd3'
import { beeswarm } from 'd3-beeswarm'
import { $ } from './util'
import palette from './palette'

import income from '../server/income.json'

console.log(income)

const drawChart = () => {

    // In this part of the code we set up the SVG with the right width and height

    const svgEl = $('.ex-svg')

    const width = svgEl.getBoundingClientRect().width
    const height = 500

    const svg = d3.select(svgEl)
        .attr('width', width)
        .attr('height', height)

    // Here we define what scale to use for our chart,
    // ie that the left edge should be 0 and the right edge
    // should be 65,000 (as my income data ranges to about that number)

    const xScale = d3.scaleLinear()
        .domain([ 0, 65000 ])
        .range([ 0, width ])

    // Here the income data is used to calculate the actual beeswarm

    const swarm = beeswarm()
        .data(income.sort((a, b) => b.value - a.value ))
        .distributeOn(d => xScale(d.value))
        .radius(4.5)
        .arrange()

    console.log(swarm)

    // Here we just draw a line in the middle of the chart
    // to anchor everything visually

    const line = svg
        .append('line')
        .attr('x1', 0)
        .attr('x2', width)
        .attr('y1', height/2)
        .attr('y2', height/2)
        .attr('class', 'ex-line')

    // Here we draw the actual dots. The 'swarm' object has
    // an x and y value for each point,
    // and that's used to position the circles.
    // To style London dots red and the rest blue, I access the data
    // I originally passed to the swarm generator, which is now stored under d.datum

    const dots = svg
        .selectAll('.ex-bee')
        .data(swarm)
        .enter()
        .append('circle')
        .attr('cx', d => d.x)
        .attr('cy', d => d.y + height/2)
        .attr('r', 3.5)
        .attr('class', 'ex-bee')
        .attr('fill', d => d.datum.region === 'London' ? palette.newsRed : palette.sportBlue)
        .attr('stroke', d => d.datum.region === 'London' ? palette.newsRed : palette.sportBlue)

}

drawChart()