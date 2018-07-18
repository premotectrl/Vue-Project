<template>
    <div style="display: inline-block;"> 
        <button type="button" @click="variate"> Update</button>

       <div v-if="_chartConfig" class="flex-Container KpisContainer secondary-kpis-column">
            <div vif="_chartConfig.showTitle && _chartConfig.title" class="secondary-kpis-column-header">{{_chartConfig.title | translate}}</div>

            <div class="flexChartContainer">
                <div class="flChart">
                    <canvas :class="{'spinChart': !_dataIsValid}" class="donut-chart" width="150" height="150" :id="chartId"></canvas>
                    <!-- <img class="legend-table-color" :src="icon"> -->
                    <div class="chartItem">
                            <img v-if="_chartConfig.icon" :src="_chartConfig.icon" alt="" class="holeIcon">
                            <span v-if="!_chartConfig.icon" class="kpi-summary-value">{{_agvCount}}</span>
                    </div>    
                </div>

                <div class="legend-table">
                    <table align="left">
                        <tr v-for="(state, index) in _states" :key="index">
                            <td class="icon-col">
                                <div> <img class="legend-table-color" :src="state.icon"> </div>
                            </td>
                            <!--<td class="legend-table-value" :style="{'background-color':displayColors[index]}">{{round(vDataPoints[index])}}%</td> -->
                            <td v-if="_chartConfig.showCount == false" class="legend-table-value count-col">{{state.value}}&#37;</td>
                            <td v-if="_chartConfig.showCount == true" class="legend-table-value count-col">{{state.count}}</td>
                            <td class="legend-table-label">{{ state.title }}</td>
                        </tr>
                    </table>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
//import Vue from 'vue'
import Component from  'vue-class-component'
import { Vue, Prop, Watch } from "vue-property-decorator";
import * as Chart from 'chart.js';
import {GUID} from './utils/utils';

    export interface AGVStateCount {
        id: string,
        title: string,
        icon:string,
        color:string,
        value: number,
        count: number
    }
    export interface AGVStateCountGroup {
        title: string;
        icon: string;
        showCount: boolean;
        showTitle: boolean;
        kpis: Map<string, AGVStateCount>;
    }

    @Component
    export default class ScalarChart extends Vue {
        @Prop() chartConfig!: AGVStateCountGroup;
    
        _chartConfig!: AGVStateCountGroup;
        _states!: AGVStateCount[];
        _dataIsValid = false;
        _agvCount = 0;
        ctx!: any;
        chart!: Chart;

        id:string ="";
        icon:string = "assets/Settings_outline_large_orange.svg";
        options = {
                    cutoutPercentage: 70,
                   /* animation: {
                        animateRotate: false,
                        animateScale: false,
                    },*/
                    responsive: false,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    },
                     elements: {
                    arc: {
                        borderWidth: 1
                    }
                }
                }
        //donut!: Chart;
        default_safetyStateConf: AGVStateCountGroup = {
            title: "Default Title",
            showTitle: true,
            icon:"assets/Settings_outline_large_orange.svg",
            showCount: true,
            kpis: new Map()
                .set("-",                    {id: 1,     title: "-",                   icon:"assets/Settings_outline_large_orange.svg",       color: "#676c71", value: 0, samples: 0, count: 0})
                .set("--",                  {id: 4,     title: "--",    icon:"assets/Settings_outline_large_orange.svg",        color: "#676c71", value: 0, samples: 0, count: 0})
                .set("---",                 {id: 2,     title: "---",           icon:"assets/Settings_outline_large_orange.svg",    color: "#676c71", value: 0, samples: 0, count: 0})
                .set("----",                {id: 3,     title: "----",         icon:"assets/Settings_outline_large_orange.svg",  color: "#676c71", value: 0, samples: 0, count: 0})
                .set("-----",               {id: 5,     title: "-----",          icon:"assets/Settings_outline_large_orange.svg",      color: "#676c71", value: 0, samples: 0, count: 0})
        }; 

        vDataPoints =  [10,20,30,20,10];
        displayColors = ["#CF2027","#FF5800","#FFCD00","#6EC8A0","#1B8642"];
        preparedData!: any;
    
       // computed:
        get chartId(): string {
                if (!this.id) {
                    this.id = GUID();
                }
                return this.id;
        }

        // Other methods
          
        round (num:number) {
            return Math.round(num * 10)/10;
        }
     
        created(){
            //this._chartConfig = this.chartConfig;
            if(!this.chartConfig){
                console.log("no config");
                this._chartConfig = this.default_safetyStateConf;
                //return;
            } else{
                 this._chartConfig = this.chartConfig;
            }
            
            this._states = Array.from(this._chartConfig.kpis.values()); 
            this.preparedData = this.prepareData(this._chartConfig);
            this._dataIsValid =  this.preparedData.isValid;
           
        }

        mounted() {
            if(this._chartConfig != undefined){
                this.configureChart(this._chartConfig, this.ctx);
                this.updateGraph(this.chart,  this.preparedData.data, this._dataIsValid)
            }  
        }
        variate(){
            //if the data at component input gets changed by the parent , 
            //we expect chart updates
            this.chartConfig = this._chartConfig;
            this.chartConfig.title = "Vueeee change";
        }
    
        @Watch('chartConfig', {deep:true})
            updater(chartConfig:AGVStateCountGroup){
                this._chartConfig = this.chartConfig;
                let r = this.prepareData(this._chartConfig);
                this._dataIsValid = r.isValid;
                this.updateGraph(this.chart, r.data, this._dataIsValid);
            } 
        
        private prepareData(config: AGVStateCountGroup): {isValid: boolean, data: number[]} {

            this._agvCount = Array.from(config.kpis).map(([k, kpiConf]) => kpiConf.count).reduce((a, b) => a + b, 0);

            let newDat: number[] = Array.from(config.kpis).map(([k, kpiConf]) => kpiConf.value);
            const dataSum = newDat.reduce((a, b) => a + b, 0);

            let isValid = false;
            if (config.showCount) {
                isValid = !isNaN(dataSum) && dataSum != 0;
            }
            else {
                isValid =  !isNaN(dataSum) &&  (Math.abs(dataSum - 100.0) < 0.01);
            }

            return {
        
                isValid: isValid,
                data: [10,20,30,20,10]// newDat
            }
        }

        private configureChart(conf: AGVStateCountGroup, ctx:any,) {
        
            const canvas : any = <HTMLCanvasElement> document.getElementById(this.chartId);
            ctx = canvas.getContext('2d');
            const config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data:[],
                        backgroundColor: this.displayColors
                    }],
                },
                options: this.options,
            };
            this.chart = new Chart(ctx, config);
            this.chart.update();
        }

        public updateGraph(chart:any, data: number[],  isValid:boolean) : void {
            try {
            if (isValid) {
                chart.data.datasets[0].data = data;
                //chart.data.datasets[0].backgroundColor = this.displayColors;
                chart.options.elements.arc.borderWidth = 0;
            } else {
                let a = Array(data.length).fill(0);
                a[0] = 100;
                chart.data.datasets[0].data = a;
                chart.data.datasets[0].backgroundColor = a.map(x => "#676C71");
            }
            chart.update();

        } catch(e){ }
            //Object.assign( chart.config.data.datasets[0].data , data);
            //chart.update();
        }          
    };
</script>

<style lang="scss" scoped>
 
    @import "styles/variables.scss";

    #chart-title {
        display: inline-block;
        margin-bottom: 30px;
        font-family: kuka-bulo-bold;
    }

    #chart-container {
        display: inline-block;
        margin-right: 18px;
    }

 .flex-Container {
            display: flex;
            flex-direction:column;
            justify-content: left;
          }
        
        .flexChartContainer {
            display: flex;
            width: 285pt;
            flex-direction: row;
            align-items: center;
            justify-content: left;
            padding-left: 20px;
        }
        
        .flChart {
            position: relative; 
            display: block;
            height: 150px;
            width: 150px;
        }

        .chartItem {
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            margin: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
        }
        
        .KpisContainer {
            padding-left: 20px;
            padding-bottom:1%;
        }
        
        .holeIcon {
            width: 20%;
        }

        .secondary-kpis-column-header {
            font-size: 1rem;
            font-family: kuka-bulo-bold;
            color: #676c71;
            margin:10px 0 20px 0;
        }

         .spinChart {
            -webkit-animation-name: spin;
            -webkit-animation-duration: 4000ms;
            -webkit-animation-iteration-count: infinite;
            -webkit-animation-timing-function: linear;
            -moz-animation-name: spin;
            -moz-animation-duration: 4000ms;
            -moz-animation-iteration-count: infinite;
            -moz-animation-timing-function: linear;
            -ms-animation-name: spin;
            -ms-animation-duration: 4000ms;
            -ms-animation-iteration-count: infinite;
            -ms-animation-timing-function: linear;

            animation-name: spin;
            animation-duration: 4000ms;
            animation-iteration-count: infinite;
            animation-timing-function: linear;
        }
        @-ms-keyframes spin {
            from { -ms-transform: rotate(0deg); }
            to { -ms-transform: rotate(360deg); }
        }
        @-moz-keyframes spin {
            from { -moz-transform: rotate(0deg); }
            to { -moz-transform: rotate(360deg); }
        }
        @-webkit-keyframes spin {
            from { -webkit-transform: rotate(0deg); }
            to { -webkit-transform: rotate(360deg); }
        }
        @keyframes spin {
            from {
                transform:rotate(0deg);
            }
            to {
                transform:rotate(360deg);
            }
        }

    .legend-table {
        display: inline-block;
        height: 100%;
        color: $kukaGrayForTypography;
        font-size: $standardFontSize;
        td {
            padding: 1px 4px 1px 4px;
        }
        &-value {
            font-family: kuka-bulo-bold;
        }
        &-color {
            width: 13px;
            height: 13px;
            border-radius: 50%;
            margin-right: 3px;
        }
    }

</style>
