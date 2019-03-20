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
    this._data.subscribe(x => {
      if (this.data) {
        // this.drawChart();
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

  drawChart(): void {

  }

  updateChart(): void {
    let zoomed;
    this.getOptions();
    //////////// Create the container SVG and g /////////////
    const element = this.chartContainer.nativeElement;
    const margin = this._chartOptions.margin;
    const width = element.offsetWidth - margin.left - margin.right;
    const height = element.offsetHeight - margin.top - margin.bottom;
    this.height = element.offsetHeight - margin.top - margin.bottom;
    // Remove whatever chart with the same id/class was present before
    d3.select(element).selectAll('svg').remove();

    let x = d3.scaleLinear()
      .range([0, width]);

    /*
        if (this._chartOptions.xAxisScale === 'log') {
        x =  d3.scaleLog()
          .range([0,width])
        }
    */

    let y = d3.scaleLinear()
      .range([height, 0]);

    /*    if (this._chartOptions.yAxisScale === 'log') {
        y =  d3.scaleLog()
          .range([height, 0]);
        }*/

    const voronoi = d3.voronoi()
      .x((d: PharosPoint) => x(d.x))
      .y((d: PharosPoint) => y(d.y))
      .extent([[-margin.left, -margin.top],
        [width + margin.right, height + margin.bottom]]);

    this.tooltip = d3.select('body').append('div')
      .attr('class', 'line-tooltip')
      .style('opacity', 0);

    const svg = d3.select(element)
      .append('svg:svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append("svg:g")
      .attr("id", "group")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(
      this._chartOptions.xdomain ? this._chartOptions.xdomain : this.data.map(d => d.x)
    );

    y.domain(
      this._chartOptions.ydomain ? this._chartOptions.ydomain : this.data.map(d => d.y)
    );


    const xAxis = d3.axisBottom(x)
      .ticks(20);

    const yAxis = d3.axisLeft(y)
      .ticks(20);

    svg.append("text")
      .attr("transform",
        "translate(" + (width / 2) + " ," + (height + margin.top + 20) + ")")
      .attr('class', 'axis-label')
      .text(this._chartOptions.xLabel);

    svg.append("text")
    /*      .attr("transform",
            "translate(" + 0 + " ," + (height / 2) + "), rotate(-90)")*/
      .attr("transform", "rotate(-90)")
      .attr("y", 0 - margin.left / 1.4)
      .attr("x", 0 - (height / 2))
      .attr('class', 'axis-label')
      .text(this._chartOptions.yLabel)

    // Add the X Axis
    const gX = svg.append('g')
      .attr('class', 'xaxis')
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

    // Add the Y Axis
    const gY = svg.append('g')
      .attr('class', 'yaxis')
      .call(yAxis);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x).ticks(0));

    svg.append("g")
      .call(d3.axisLeft(y).ticks(0));


    const chartBody = svg
      .append("g")
      .attr("class", "chartbody")
      .attr("clip-path", "url(#clip)");

    svg.select('.chartbody').selectAll('.linePoints')
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


    /*    // Add the valueline path.
        svg.append('path')
          .attr('class', 'timeline')
          .attr('transform', 'translate(' + (margin.left + margin.right) + ',0)' );*/


    svg.append("defs").append("clipPath")
      .attr("id", "clip")
      .append("rect")
      /* .attr('transform', 'translate(' + (margin.left + margin.left) + ','+
         (margin.top + margin.bottom +')' ))
   *///    .attr("width",width - margin.left - margin.right)
      .attr("width", width)
      //   .attr("height", height - margin.top - margin.bottom);
      .attr("height", height);

    const voronoiGroup = svg
      .append("g")
      .attr("class", "voronoiParent")
      .append("g")
      .attr("class", "voronoi")
      .attr("clip-path", "url(#clip)");

    voronoiGroup.selectAll("path")
      .data(voronoi.polygons(this.data))
      .enter()
      .append('path')
      .attr('class', 'voronoi-path')
       .style('fill', 'none')
       .style('pointer-events', 'all')
      .attr('d', (d) => d ? 'M' + d.join('L') + 'Z' : null)
      .on('mouseover', (data) => {
        console.log("mmmmmmmm")
        const d = data.data;
        svg.select(`#${d.name}`).enter()
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
        svg.select(`#${d.data.name}`)
          .attr('r', 2);
      })
      .exit();

    zoomed = () => {
      console.log("zooooooommmm");
      const t = d3.event.transform;
      const xt = t.rescaleX(x);
      const yt = t.rescaleY(y);
      gX.call(xAxis.scale(xt));
      gY.call(yAxis.scale(yt));

      console.log(svg.select('.chartbody').selectAll('.linePoints'));
      svg.select('.chartbody').selectAll('.linePoints')
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
        .y((d: PharosPoint) => yt(d.y))
        .extent([[-margin.left, -margin.top],
          [width + margin.right, height + margin.bottom]]);

      svg.select('.chartbody')
        .attr("transform", d3.event.transform)
      //    .attr('clip-path', 'url(#circle-clip)')

    };

    const zoom = d3.zoom()
      .scaleExtent([0.75, 1000])
      // .translateExtent([[-100000, -100000], [100000, 100000]])
      .on("zoom", zoomed);


    console.log(svg.select('.voronoiParent'));

    svg.select('.voronoiParent')
      .call(zoom);


  }

}
