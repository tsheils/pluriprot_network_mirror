import * as d3 from 'd3';

const COLOR = d3.scaleSequential(
  d3.interpolateBrBG
).domain([-10, 10]);


/*const COLOR = d3.scaleOrdinal(
 // d3.interpolateRainbow
  ["#379982",
  "#914dd1",
  "#799e27",
  "#b34c95",
  "#4f8b44",
  "#6a71ba",
  "#d56721",
  "#bc4b62",
  "#917136",
  "#c24e3a"]
).domain([-100, 100]);*/


/**
 * node object for d3 graph
 */
export class Node implements d3.SimulationNodeDatum {
  //  optional - defining optional implementation properties - required for relevant typing assistance
  index?: number;
  /**
   * x axis value
   * @type {number}
   */
  x = 0;
  /**
   * y axis value
   * @type {number}
   */
  y = 0;
  /**
   * x axis velocity
   * @type {number}
   */
  vx = 0;
  /**
   * y axis velocity
   * @type {number}
   */
  vy = 0;
  /**
   * x axis function
   */
  fx?: number | null;
  /**
   * y axis function
   */
  fy?: number | null;
  /**
   * number of links to each node
   * @type {number}
   */
  linkCount = 0;
  /**id string   */
  uuid: string;
  /**id string   */
  id: string;
  /**
   * array of node labels
   */
  labels?: string[];
  /**
   * node name
   */
  name: string;
  /**
   * node type
   */
  type: string;
  /**
   * pharos link for more details
   */
  uri: string;

  /**
   * Neo4j has their own uuid that will need to be used to track nodes, since some relationships are sepnt with the start
   * and end nodes notated solely by the Neo4j ids, rather than the full node object
   * @param {string} uuid
   * @param data
   */
  constructor(uuid: string, data: any) {
    this.uuid = uuid;
    //  uuid is still saved here
    this.labels = data.labels;
    this.linkCount = 1;
   // this.kgraph = data.properties ? data.properties.kgraph.low : 0;
//  this.created = data.created;
    this.name = data.properties ? data.properties.name : '';
    this.type = data.properties ? data.properties.type : '';
    this.uri = data.properties ? data.properties.uri : '';
  }

  /**
   * returns baseline proportional size number
   * @return {number}
   */
  normal = () => {
    return Math.sqrt(this.linkCount / 50);
  }

  /**
   * return node radius size based on link count
   * @return {number}
   */
  get r() {
    return 50 * this.normal() + 15;
  }

  /**
   * returns font size based on link count
   * todo: not currently used
   * @return {string}
   */
  get fontSize() {
    return (30 * this.normal() + 10) + 'px';
  }
}

/**
 * protein that extends node ovject
 */
export class Protein extends Node {


  degree: number;
  gene: string;
 // canonicalName: string;
  hESC_NSC_Fold_Change: number;
  hESC_NSC_Ratio: number;
  id: string;
  color: string;
//  name: string;
/*  selected: boolean;
  shared_name:string;*/
  /**
   * new protein
   * @param {string} uuid
   * @param data
   */
  constructor(uuid: string, data: any) {
    super(uuid, data);
    this.degree = data.properties.Degree;
    this.labels = data.properties.cytoscape_alias_list;
    this.hESC_NSC_Fold_Change = data.properties.hESC_NSC_Fold_Change;
    this.hESC_NSC_Ratio = data.properties.hESC_NSC_Ratio;
    this.gene = data.properties.Gene.trim();
    this.color = this.hESC_NSC_Fold_Change === -100 ? '#CCCCCC' : COLOR(-this.hESC_NSC_Fold_Change);
  }
}
