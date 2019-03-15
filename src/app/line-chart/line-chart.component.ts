import {
  Component, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output,
  ViewChild, ViewEncapsulation
} from '@angular/core';
import * as d3 from 'd3';
import {BehaviorSubject} from 'rxjs/index';

/**
 * interface with various chart point properties
 */
export interface PharosPoint {
  /**
   * optional point name
   */
  name?: string;

  /**
   * optional point label
   */
  label?: string;

  /**
   * optional variable to toggle hovering class
   */
  hovered?: boolean;

  /**
   * point key
   */
  key: number;

  /**
   * point value
   */
  value: number;
}

/**
 *basic config options for a radar chart
 * todo: should extract this for other chart types
 */
export class LineChartOptions {
  /**
   * The margins of the SVG
   */
  margin: any = {top: 20, right: 30, bottom: 20, left: 30};

  /**
   * boolean to switch between line chart and scatterplot
   * @type {boolean}
   */
  line = false;
  /**
   * d3 color scale
   */
  color: any = d3.scaleOrdinal().range(['#23364e']);
  /**
   * show labels
   */
  xAxisScale: 'linear' | 'log' = 'linear';
  yAxisScale: 'linear' | 'log' = 'linear';

  /**
   * merge new option properties with a default option object retrieved from the chart service
   * @param obj
   */
  constructor(obj: any) {
    Object.entries((obj)).forEach((prop) => this[prop[0]] = prop[1]);
  }
}

// todo: https://bl.ocks.org/lorenzopub/6a56e17551d59278631dffd7f65a0cda
// todo: added voronoi plot, not sure about feasibility of multi lines, or the necessity of pan or zoom.

@Component({
  selector: 'pharos-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent  implements OnInit, OnDestroy {
  /**
   * container that holds the radar chart object
   */
  @ViewChild('lineChartTarget') chartContainer: ElementRef;

  /**
   * behavior subject that is used to get and set chart data
   * @type {BehaviorSubject<any>}
   * @private
   */
  private _data: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  /**
   * setter for chart data
   * force sorting when data comes in, then set it and pass it to the setter function
   * @param value
   */
  @Input()
  set data(value: any) {
    if (value) {
      // value = value.sort((a, b) => a.key - b.key);
      this._data.next(value);
    }
  }

  /**
   * getter for chart data
   * @returns {any}
   */
  get data(): any {
    return this._data.value;
  }

  /**
   * options opbject passed from component
   */
  @Input() options?: any;
  /**
   * options for size and layout for the chart
   */
  private _chartOptions: LineChartOptions;

  /**
   * svg object that is drawn, also used to clear the chart on redraw
   */
  private svg: any;

  /**
   * html element that will hold tooltip data
   */
  private tooltip: any;

  /**
   * width of the graph retrieved from the container size
   */
  private width: number;

  /**
   * height of the graph retrieved from the container size
   */
  private height: number;

  /**
   * function to redraw/scale the graph on window resize
   */
  @HostListener('window:resize', ['$event'])
  onResize() {
    this.drawChart();
    this.updateChart();
  }

  constructor() {
  }

  // todo add click event that emits up
  // todo - data change doesnt update the chart, it just redraws it;
  // todo - revamp this to be more in line with es6
  ngOnInit() {
    this.drawChart();
    this._data.subscribe(x => {
      if (this.data) {
            this.updateChart();
      }
    });
  }

  ngOnDestroy(): void {
    const element = this.chartContainer.nativeElement;
    d3.select(element).selectAll('svg').remove();
    d3.select('body').selectAll('.line-tooltip').remove();
  }

  getOptions() {
    // get chart options
      this._chartOptions = new LineChartOptions(this.options ? this.options : {});
  }

  getXAxis(scale: string): any {
  switch (scale) {
    case 'linear': {
     return d3.scalePoint()
        .domain([-16, -4])
        .rangeRound([0, this.width + this._chartOptions.margin.left]);
    }
    case 'log': {
      return d3.scaleLog()
        .domain(this.data.map(d => +d.key))
        .rangeRound([0, this.width + this._chartOptions.margin.left]);
    }
  }
  }

getYAxis(scale: string): any {
  switch (scale) {
    case 'linear': {
      return d3.scaleLinear()
        .domain([-16, -4])
        .rangeRound([this.height, 0]);
    }
    case 'log': {
      return d3.scaleLog()
        .domain(d3.extent(this.data, (d) => d.value)).nice()
        // .domain([0.001, 1])
        .rangeRound([this.height, 0]);
    }
  }
  }

  drawChart(): void {
    this.getOptions();
    //////////// Create the container SVG and g /////////////
    const element = this.chartContainer.nativeElement;

    this.width = element.offsetWidth - this._chartOptions.margin.left - this._chartOptions.margin.right;
    this.height = element.offsetHeight - this._chartOptions.margin.top - this._chartOptions.margin.bottom;
    // Remove whatever chart with the same id/class was present before
    d3.select(element).selectAll('svg').remove();



    this.svg = d3.select(element).append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
      .append('g')
      .attr('class', 'line-container');

        // Add the X Axis
    this.svg.append('g')
      .attr('class', 'xaxis')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',' + this.height + ')');

    // Add the Y Axis
    this.svg.append('g')
      .attr('class', 'yaxis')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',0)');

    this.svg.append('g')
      .attr('class', 'linePointHolder')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',0)');

    // Add the valueline path.
    this.svg.append('path')
      .attr('class', 'timeline')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',0)' )
      .style('filter' , 'url(#glow)');


    // Filter for the outside glow
    const filter = this.svg.append('defs').append('filter').attr('id', 'glow'),
      feGaussianBlur = filter.append('feGaussianBlur').attr('stdDeviation', '2.5').attr('result', 'coloredBlur'),
      feMerge = filter.append('feMerge'),
      feMergeNode_1 = feMerge.append('feMergeNode').attr('in', 'coloredBlur'),
      feMergeNode_2 = feMerge.append('feMergeNode').attr('in', 'SourceGraphic');

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'line-tooltip')
      .style('opacity', 0);
  }

  updateChart(): void {

/*    const x = this.getXAxis(this._chartOptions.xAxisScale);

    const y = this.getYAxis(this._chartOptions.yAxisScale);*/

    const idled = () => {
      idleTimeout = null;
    }

    const brushended = () => {
      const s = d3.event.selection;
      console.log(s);
      if (!s) {
        if (!idleTimeout) return idleTimeout = setTimeout(idled, idleDelay);
        console.log("reset domains")
        x.domain(xScale);
        y.domain(yScale);
      } else {
        console.log("change domains");
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
    //    this.svg.select('.brush').call(brush.move, null);
      }
      //zoom();
    }




    const zoomed = () => {
      console.log('zooming');
// create new scale ojects based on event
      const new_xScale = d3.event.transform.rescaleX(x);
      const new_yScale = d3.event.transform.rescaleY(y);
// update axes
      xaxis.call(x.scale(new_xScale));
      yaxis.call(y.scale(new_yScale));
      points.data(this.data)
        .attr('cx', function(d) {return new_xScale(d.key)})
        .attr('cy', function(d) {return new_yScale(d.value)});
    }

    const zoom = d3.zoom()
      .scaleExtent([.5, 20])
      .extent([[0, 0], [this.width, this.height]])
      .on("zoom", zoomed);


    // const brush = d3.brush().on('end', brushended);
    let idleTimeout;
    const idleDelay = 350;

    const xScale = [-16, -4];
      const yScale = [-16, -4];
      const x = d3.scaleLinear().domain(xScale).range([0, this.width]);
      const y = d3.scaleLinear().domain(yScale).range([this.height, 0]);


    const voronoi = d3.voronoi()
      .x((d: PharosPoint) => x(d.key))
      .y((d: PharosPoint) =>  y(d.value))
      .extent([[-this._chartOptions.margin.left, -this._chartOptions.margin.top],
        [this.width + this._chartOptions.margin.right, this.height + this._chartOptions.margin.bottom]]);

    const line = d3.line()
      .x((d: PharosPoint) => x(+d.key))
      .y((d: PharosPoint) => y(+d.value));

    const xaxis = this.svg.select('.xaxis')
      .call(d3.axisBottom(x)
      .ticks((this.width + 2) / (this.height + 2) * 20));


    this.svg.selectAll('.xaxis text')  // select all the text elements for the xaxis
      .attr('transform', function(d) {
        return 'translate(' + this.getBBox().height * -2 + ',' + this.getBBox().height + ')rotate(-45)';
      });

    const yaxis = this.svg.select('.yaxis')
      .call(d3.axisLeft(y)
        .ticks(4));

/*    const zoom = () => {
      const t = this.svg.transition().duration(750);
      console.log("zooming");
      console.log(this.svg.select(".xaxis"));
      this.svg.select(".xaxis").transition(t).call(d3.axisBottom(x)
        .ticks((this.width + 2) / (this.height + 2) * 20));
      this.svg.select(".yaxis").transition(t).call(d3.axisLeft(y)
        .ticks(4));
      this.svg.selectAll("circle").transition(t)
        .attr("cx", function(d) {return x(d.key); })
        .attr("cy", function(d) { return y(d.value); });
    }*/

    const points = this.svg.select('.linePointHolder').selectAll('.linePoints')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'linePoints')
      .attr('r', 3)
      .attr('cx', d =>  x(d.key))
      .attr('cy', d =>  y(d.value))
      .style('fill', d => (d.color ==='gray' ? 'none' : d.color))
      .style('fill-opacity', 0.8)
      .style('pointer-events', 'all')
      .exit();

    this.svg.select('.linePointHolder').selectAll('.voronoi')
      .data(voronoi.polygons(this.data))
      .enter()
      .append('path')
      .attr('class', 'voronoi')
      .attr('d', (d) => d ? 'M' + d.join('L') + 'Z' : null)
      .style('fill', 'none')
      .style('pointer-events', 'all')
      .on('mouseover', (data, i, circles) => {
        console.log("mouse");
        // console.log(circles);
        // console.log(this.svg.selectAll('.linePoints')[i].nodes());
        // this.svg.selectAll('.linePoints').node()[i].classed('hovered', true);
        const d = data.data;
        this.tooltip
          .transition()
          .duration(200)
          .style('opacity', .9);
        let span = '';
        if (d.label) {
          span = '<span>' + d.label + ': <br>' + d.name + '</span>';
        } else {
          span = '<span>' + d.key + ': <br>' + d.value + '</span>';
        }
        this.tooltip.html(span)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px')
          .style('width', 100);
      })
      .on('mouseout', (d, i, circles) => {
        this.tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
        d3.select(circles[i]).classed('hovered', false);
      })
      .exit();

/*    this.svg.append('g')
      .attr('class', 'brush')
      .call(brush);*/


    this.svg.append("rect")
      .attr("width", this.width)
      .attr("height", this.height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',' + this._chartOptions.margin.top + ')')
      .call(zoom);

    if (this._chartOptions.line) {
  this.svg.select('.timeline')   // change the line
    .datum(this.data)
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke', '#23364e')
    .attr('stroke-width', 2)
    .attr('fill', 'none')
    .attr('d', line)
    .exit();
}
  }
}



