import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-d3-color-legend',
  templateUrl: './d3-color-legend.component.html',
  styleUrls: ['./d3-color-legend.component.scss']
})
export class D3ColorLegendComponent implements OnInit {
  @ViewChild('colorScaleTarget') chartContainer: ElementRef;

  constructor() { }

  ngOnInit() {
    const element = this.chartContainer.nativeElement;
    const margin = {top: 0, right: -5, bottom: 0, left: 5};
    const width = element.offsetWidth;
    const height = 20;
    const barHeight = 20;
    const svg = d3.select(element).append('svg')
      .attr('width', '100%')
      .attr('height', '30')
    const defs = svg.append("defs");

    const colorScale = d3.scaleSequential(d3.interpolateGnBu).domain([-50, 0])

    const linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient");

    const axisScale = d3.scaleLinear()
      .domain(colorScale.domain())
      .range([margin.left, width - margin.right])

    const axisBottom = g => g
      .attr("class", `x-axis`)
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(axisScale)
        .ticks(width / 80)
        .tickSize(-barHeight))

    linearGradient.selectAll("stop")
      .data(colorScale.ticks().reverse().map((t, i, n) => {
        return ({ offset: `${100*i/n.length}%`, color: colorScale((t / 2) + 3) })
      }))
      .enter().append("stop")
      .attr("offset", d => d.offset)
      .attr("stop-color", d => d.color);

    svg.append('g')
      .attr("transform", `translate(0,${height - margin.bottom - barHeight})`)
      .append("rect")
      .attr('transform', `translate(${margin.left}, 0)`)
      .attr("width", width - margin.right - margin.left)
      .attr("height", barHeight)
      .style("fill", "url(#linear-gradient)");

    svg.append('g')
      .call(axisBottom);


   /*
    const element = this.chartContainer.nativeElement;

    const width = element.offsetWidth;
    const height = element.offsetHeight;
    //A color scale
    const colorScale = d3.scaleSequential(
      d3.interpolateBrBG
    ).domain([-100, 10]);

    const svg = d3.select(element).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')

    //Append a defs (for definition) element to your SVG
    var defs = svg.append("defs");

   /!* var colorScale = d3.scale.linear()
      .range(["#2c7bb6", "#00a6ca", "#00ccbc", "#90eb9d", "#ffff8c",
        "#f9d057", "#f29e2e", "#e76818", "#d7191c"]);
*!/
//Append a linearGradient element to the defs and give it a unique id
    //Append multiple color stops by using D3's data/enter step
    var linearGradient = defs.append("linearGradient")
      .attr("id", "linear-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%")
      .selectAll("stop")
      .data(colorScale)
      .enter().append("stop")
/!*      .attr("offset", function (d, i) {
        console.log(i);
        return i / (colorScale.length - 1);
      })*!/
      .attr("stop-color", function (d, i) {
        console.log(colorScale(i));
        return colorScale(i);
      });

/!*    //Draw the rectangle and fill with gradient
    svg.append("rect")
      .attr("width", 300)
      .attr("height", 20)
      .style("fill", "url(#linear-gradient)");*!/

    var legendWidth = width * 0.6,
      legendHeight = 10;

    var legendsvg = svg.append("g")
      .attr("class", "legendWrapper")
      .attr("transform", "translate(" + (width / 2 - 10) + "," + (height + 50) + ")");

//Draw the Rectangle
    legendsvg.append("rect")
      .attr("class", "legendRect")
      .attr("x", -legendWidth / 2)
      .attr("y", 10)
      //.attr("rx", legendHeight/2)
      .attr("width", legendWidth)
      .attr("height", legendHeight)
      .style("fill", "url(#linear-gradient)");

//Append title
    legendsvg.append("text")
      .attr("class", "legendTitle")
      .attr("x", 0)
      .attr("y", -2)
      .text("hESC/hNSC NSAF SpC ratio");

//Set scale for x-axis
    var xScale = d3.scaleLinear()
      .range([0, legendWidth])
      .domain([-100, 10]);
    //.domain([d3.min(pt.legendSOM.colorData)/100, d3.max(pt.legendSOM.colorData)/100]);

//Define x-axis
    var xAxis = d3.axisBottom()
      .ticks(5)  //Set rough # of ticks
      //.tickFormat(formatPercent)
      .scale(xScale);

//Set up X axis
    legendsvg.append("g")
      .attr("class", "axis")  //Assign "axis" class
      .attr("transform", "translate(" + (-legendWidth / 2) + "," + (10 + legendHeight) + ")")
      .call(xAxis);
*/
  }
}
