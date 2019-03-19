import {
  AfterViewInit, Component, ElementRef, HostListener, Input, OnDestroy, OnInit, ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BehaviorSubject} from "rxjs/index";
import {LineChartOptions, PharosPoint} from "../line-chart/line-chart.component";
import * as d3 from 'd3';

@Component({
  selector: 'app-scatter-plot',
  templateUrl: './scatter-plot.component.html',
  styleUrls: ['./scatter-plot.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ScatterPlotComponent implements OnInit, OnDestroy {
  /**
   * container that holds the radar chart object
   */
  @ViewChild('scatterPlotTarget') chartContainer: ElementRef;

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
      // value = value.sort((a, b) => a.x - b.x);
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

  private focus: any;

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

  getXAxis(): any {
    switch (this._chartOptions.xAxisScale) {
      case 'linear': {
        return d3.scaleLinear()
          .range([0, this.width - this._chartOptions.margin.left]);
      }
      case 'log': {
        return d3.scaleLog()
          .range([0, this.width - this._chartOptions.margin.left]);
      }
    }
  }

  getYAxis(): any {
    switch (this._chartOptions.xAxisScale) {
      case 'linear': {
        return d3.scaleLinear()
          .range([this.height - this._chartOptions.margin.top, 0]);
      }
      case 'log': {
        return d3.scaleLog()
          .range([this.height - this._chartOptions.margin.top, 0]);
      }
    }
  }

  drawChart(): void {
    this.getOptions();
    //////////// Create the container SVG and g /////////////
    const element = this.chartContainer.nativeElement;

    this.width = element.offsetWidth;
    this.height = element.offsetHeight;
    // Remove whatever chart with the same id/class was present before
    d3.select(element).selectAll('svg').remove();

    this.svg = d3.select(element).append('svg')
      .attr('width', this.width + this._chartOptions.margin.left + this._chartOptions.margin.right)
      .attr('height', this.height  + (this._chartOptions.margin.top + this._chartOptions.margin.bottom)*2);

      const chartBody = this.svg.append("g")
        .attr("transform", "translate(" + this._chartOptions.margin.left + "," + this._chartOptions.margin.top + ")");
/*
      .append('g')
      .attr("clip-path", "url(#clip)");
*/

        // Add the X Axis
    chartBody.append('g')
      .attr('class', 'xaxis')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',' + 0 + ')');

    chartBody.append("text")
      .attr("transform",
        "translate(" + (this.width / 2) + " ," + (this.height + this._chartOptions.margin.top + this._chartOptions.margin.bottom) + ")")
      .attr('class', 'axis-label')
      .text(this._chartOptions.xLabel);

    // Add the Y Axis
    chartBody.append('g')
      .attr('class', 'yaxis')
      .attr('transform', 'translate(' + this._chartOptions.margin.left + ',' + 0 +')');

    chartBody.append("text")
      .attr("transform",
        "translate(" + 0 + " ," + (this.height / 2) + "), rotate(-90)")
      .attr('class', 'axis-label')
      .text(this._chartOptions.yLabel);

    chartBody.append('g')
      .attr('class', 'linePointHolder')
      //.attr('transform', 'translate(' + (this._chartOptions.margin.left + this._chartOptions.margin.left) + ',0)')
   //   .attr("clip-path", "url(#clip)");


    // Add the valueline path.
    chartBody.append('path')
      .attr('class', 'timeline')
      .attr('transform', 'translate(' + (this._chartOptions.margin.left + this._chartOptions.margin.left) + ',0)' )


    chartBody.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
    //  .attr('transform', 'translate(' + (this._chartOptions.margin.left + this._chartOptions.margin.left) + ',0)' )
      .attr("width", this.width)
      .attr("height", this.height);

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'line-tooltip')
      .style('opacity', 0);
  }

  updateChart(): void {
    const x = this.getXAxis();
    x.domain(
      this._chartOptions.xdomain ? this._chartOptions.xdomain : this.data.map(d => d.x)
    );

    const y = this.getYAxis();
    y.domain(
      this._chartOptions.ydomain ? this._chartOptions.ydomain : this.data.map(d => d.y)
    );

    const voronoi = d3.voronoi()
      .x((d: PharosPoint) => x(d.x))
      .y((d: PharosPoint) =>  y(d.y))
      .extent([[-this._chartOptions.margin.left, -this._chartOptions.margin.top],
        [this.width + this._chartOptions.margin.right, this.height + this._chartOptions.margin.bottom]]);

    const zoomed = () => {
      gX.call(xAxis.scale(d3.event.transform.rescaleX(x)));
      gY.call(yAxis.scale(d3.event.transform.rescaleY(y)));
      const t = d3.event.transform;
        const xt = t.rescaleX(x);
        const yt = t.rescaleY(y);

      this.svg.select('.linePointHolder').selectAll('.linePoints')
        .data(this.data)
        .enter()
        .append('circle')
        .attr('class', 'linePoints')
        .attr('r', 2)
        .attr('id', d => d.name)
        .attr('cx', d => xt(d.x))
        .attr('cy', d => yt(d.y))
        .style('fill', d => d.color)
        .style('fill-opacity', 0.8)
        .style('pointer-events', 'all')
        .exit();

      const voronoi2 = d3.voronoi()
        .x((d: PharosPoint) => xt(d.x))
        .y((d: PharosPoint) =>  yt(d.y))
        .extent([[-this._chartOptions.margin.left, -this._chartOptions.margin.top],
          [this.width + this._chartOptions.margin.right, this.height + this._chartOptions.margin.bottom]]);

      this.svg.select('.linePointHolder')
        .attr("transform", d3.event.transform)
     //   .attr("clip-path", "url(#clip)")
    }


    const zoom = d3.zoom()
/*      .scaleExtent([.5, 20])
      .extent([[0, 0], [this.width, this.height]])*/
      .scaleExtent([0.75, 15000])
      .translateExtent([[-100000, -100000], [100000, 100000]])
      .on("zoom", zoomed);

    const xAxis = d3.axisBottom(x)
      .ticks(5);

    const yAxis = d3.axisLeft(y)
      .ticks(5);


    const gX = this.svg.select('.xaxis')
      .call(xAxis);

    const gY = this.svg.select(".yaxis")
      .call(yAxis);



    this.svg.select('.linePointHolder').selectAll('.linePoints')
      .data(this.data)
      .enter()
      .append('circle')
      .attr('class', 'linePoints')
      .attr('r', 2)
      .attr('id', d => d.name)
      .attr('cy', d => y(d.y))
      .attr('cx', d => {
        return x(d.x)
      })
      .style('fill', d => d.color)
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
      .on('mouseover', (data) => {
        const d = data.data;
        this.svg.select(`#${d.name}`).enter()
          .attr('r', 8)
          .style('opacity', 1);
        this.tooltip
          .transition()
          .duration(100)
          .style('opacity', .9);
        const span = `<span><strong>Gene:</strong>${d.name}</span><br>
                      <span><strong>Ratio:</strong> ${d.ratio}</span><br>
                      <span *ngIf="d.pvalue"><strong>T-test P Value:</strong> ${d.pvalue}</span><br>
                      <span><strong>hESC_Ln_NSAF:</strong>${d.x}</span><br>
                      <span><strong>hNSC_Ln_NSAF</strong>${d.y}</span>`;
        this.tooltip.html(span)
          .style('left', d3.event.pageX + 'px')
          .style('top', d3.event.pageY + 'px')
          .style('width', 100);
      })
      .on('mouseout', (d) => {
        this.tooltip
          .transition()
          .duration(200)
          .style('opacity', 0);
        this.svg.select(`#${d.data.name}`)
          .attr('r', 2);
      })
      .exit();

    this.svg.select('.linePointHolder').call(zoom);
  }
}
