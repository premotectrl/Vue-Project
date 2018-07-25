<template>
     <div v-if="_gaugeConfig" class="flex-Container">
            <!-- .............stacked version1.................. -->
            <!-- .............guage Pointer.................. -->
            <div class="chartItem" id="gaugeContainer">
                <div >
                    <!--.canvas and CanvasY form the pointer-->
                    <canvas ref="cvsP" id="canvasP" width="chartWidth" height="chartHeight"></canvas>
                    <canvas ref="cvsP2" id="canvasP2" width="chartWidth" height="chartHeight"></canvas>

                    <!--.canvasBck is the backdrop on which we slide.. can be replaced with any graphic -->
                    <canvas ref="cvsB" id="canvasBck" width="chartWidth" height="chartHeight"></canvas>
                    <canvas ref="cvsF" id="canvasF" width="chartWidth" height="chartHeight"></canvas>
                   
                    <!-- ...........Embed Icon.............. -->
                    <img v-if="icon" :src="icon" id="gaugeIcon">

                    <!-- ...........Embed middle Point.............. -->
                    <svg version="1.1" v-if ="_gaugeConfig.showNeedle == true"  id="pointerDot" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 85 35" xml:space="preserve">
                        <circle fill="#676C71" cx="43" cy="1.7" r="1.5" />
                    </svg>
                    
                    <!-- ...........Percentage values and Avg Name.............. -->
                    <svg version="1.1" id="percentageValue" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" viewBox="0 0 85 35" xml:space="preserve">
                        <text class="holeTxt" x="45" y="15"  text-anchor="middle" :fill="color">{{_gaugeLevel}} &#37;</text>
                        <text class="avg-title" x="43" y="35"  font-family="kuka-bulo" text-anchor="middle">{{_gaugeConfig.title}}</text>
                    </svg>

                </div>
            </div>
        </div>
</template>

<script lang="ts">
//import Vue from 'vue'
import Component from  'vue-class-component'
import { Vue, Prop, Watch } from "vue-property-decorator";
import * as Chart from 'chart.js';

export interface GaugeConfig {
    title: string;
    defaultIcon: string;
    icons: string[];
    thresholds: number[];
    colors: string[];
    showNeedle: boolean;
}

    @Component
    export default class Gauge extends Vue {
        @Prop()  gaugeConfig!: GaugeConfig;
        @Prop()  gaugeLevel!: number;

        chartWidth = "175";
        chartHeight = "90";
        // Contexts
        ctxP: any;
        ctxP2:any;
        ctxB: any;
        ctxF: any;
        ctx!: any;
        // Charts
        chartP2!: Chart;
        chartP !: Chart;
        chartB!: Chart;
        chartF!: Chart;
        color!: string;
        defConfig: GaugeConfig = {
            title: "Avg Fleet",
            defaultIcon:"assets/Settings_outline_large_orange.svg",
            icons:["./assets/KMP/battery-0-10.svg",
                "./assets/KMP/battery-11-25.svg",
                "assets/mobile-robotics/battery-26-50.svg",
                "assets/mobile-robotics/battery-51-75.svg",
                "assets/mobile-robotics/battery-76-100.svg",
                "assets/mobile-robotics/battery-unknown.svg"],
            thresholds:[10],
            colors: ["#CF2027","#FF5800","#FFCD00","#6EC8A0","#1B8642"],
            showNeedle:false
        }

        //setting up props to local variables
        _gaugeLevel!: number; //= this.round(this.gaugeLevel);
        _gaugeConfig!: GaugeConfig; //= this.gaugeConfig;
        icon!: string; //= this.gaugeConfig.defaultIcon;
        //icon:string = "assets/Settings_outline_large_orange.svg";
        //HTML Canvases
        $refs!: {
            cvsF: HTMLCanvasElement,
            cvsB: HTMLCanvasElement,
            cvsP: HTMLCanvasElement,
            cvsP2: HTMLCanvasElement,
        }
  
        round (num:number) {
            return Math.round(num * 10)/10;
        }
        
        private makeChart(gaugeConfig: GaugeConfig, ctx:any) {
            const configB = {
                type: 'pie',
                data: {
                    labels: ["aaa", "bbb"],
                    datasets: [{
                            data: [70, 20, 30],
                            backgroundColor: ["#E1E2E3", "#D1D3D5", "#A4A7AA"],
                            borderWidth: [0.25, 0.25, 0.25]
                        }]
                },
                options: {
                    rotation: 1 * Math.PI,
                    circumference: 1 * Math.PI,
                    cutoutPercentage: 90,
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips: { enabled: false },
                    //hover: { mode: null },
                    legend: {
                        display: false
                    }
                }
            };
            this.chartB = new Chart(ctx[2], configB);
            //value chart
            this.chartF = new Chart(ctx[3], {
                type: 'pie',
                data: {
                    //labels: ["aaa", "bbb"],
                    datasets: [
                        {
                            data: [this.gaugeLevel, 100 - this.gaugeLevel],
                            backgroundColor:["rgba(196, 93, 105, 1)", "rgba(32, 162, 219, 0)"],
                            borderWidth: [0.5, 0.5],
                        },]
                },
                options: {
                    rotation: 1 * Math.PI,
                    circumference: 1 * Math.PI,
                    cutoutPercentage: 75,
                    responsive: false,
                    maintainAspectRatio: false,
                    tooltips: { enabled: false },
                    legend: {
                        display: false
                    },
                }
            });
            if (gaugeConfig.showNeedle == true) {
                //pointer part 1
                const config1 =  {
                    type: 'pie',
                    data: {
                        //labels: ["low", "high"],
                        datasets: [
                            {
                                data: [70, 0],//this.chartData,
                                backgroundColor: ["rgba(0, 0, 0, 0)", "rgba(255, 254, 230, 0)"],
                                borderColor: ["#676C71", "#676C71"],
                                borderWidth: [0, 0.5],
                            }
                        ]
                    },
                    options: {
                        rotation: 1 * Math.PI,
                        circumference: 1 * Math.PI,
                        responsive: false,
                        maintainAspectRatio: false,
                        tooltips: { enabled: false },
                        //hover: { mode: null },
                        legend: {
                            display: false
                        }
                    }
                }
                this.chartP = new Chart(ctx[0], config1);
                // pointer part 2

            }

            this.chartP2 = new Chart(ctx[1], {
                type: 'pie',
                data: {
                    labels: [],
                    datasets: [
                        {
                            data: [60, 10],//this.chartData,
                            backgroundColor: ["rgba(0, 0, 0, 0)", "rgba(0, 0, 0,0)"],
                            borderColor: ["#fff", "#fff"],
                            borderWidth: [0.5, 0.5],
                        }
                    ]
                },
                options: {
                    responsive: false,
                    rotation: 1 * Math.PI,
                    circumference: 1 * Math.PI,
                    tooltips: { enabled: false },
                    //hover: { mode: null },
                    legend: {
                        display: false
                    }
                }
            });
        }

        // We have three charts driven together to from  a single chart, so its necessary to update all three
    private updateChart(chart:any, newLevel: number, color: boolean) {
        const opositeLevel = Math.abs(100 - newLevel);

        try {
            chart.data.datasets[0].data[0] = newLevel;
            chart.data.datasets[0].data[1] = opositeLevel;

            // TODO: take the ranges from the config
            if (color == true) {
                if (newLevel <= 10) {
                    this.icon = this._gaugeConfig.icons[0];
                    this.color = this._gaugeConfig.colors[0];
                } else if (newLevel >= 11 && newLevel <= 25) {
                    this.icon = this._gaugeConfig.icons[1];
                    this.color = this._gaugeConfig.colors[1];
                } else if (newLevel >= 26 && newLevel <= 50) {
                    this.icon = this._gaugeConfig.icons[2];
                    this.color = this._gaugeConfig.colors[2];
                } else if (newLevel >= 51 && newLevel <= 75) {
                    this.icon = this._gaugeConfig.icons[3];
                    this.color = this._gaugeConfig.colors[3];
                } else if (newLevel >= 76) {
                    this.icon = this._gaugeConfig.icons[4];
                    this.color = this._gaugeConfig.colors[4];
                }

                chart.data.datasets[0].backgroundColor[0] = this.color;
            }
            chart.update();
        } catch (e) {}
    }
        created(){
            this.ctx = [this.ctxP,this.ctxP2,this.ctxB,this.ctxF];
             if(this.gaugeLevel && this.gaugeConfig){
                this._gaugeLevel= this.round(this.gaugeLevel);
                this._gaugeConfig = this.gaugeConfig;
                this.icon = this.gaugeConfig.defaultIcon;
            
             }else{
                this._gaugeLevel =  5;
                this._gaugeConfig = this.defConfig;
                this.icon = "assets/Settings_outline_large_orange.svg";
            }
        }

        mounted() {
            this.ctx[0] =  this.$refs.cvsP.getContext('2d');
            this.ctx[1] = this.$refs.cvsP2.getContext('2d');
            this.ctx[2] = this.$refs.cvsB.getContext('2d');
            this.ctx[3] = this.$refs.cvsF.getContext('2d');   
            if (this._gaugeConfig != null)
            this.makeChart(this._gaugeConfig, this.ctx);    
        }

        @Watch('gaugeLevel')
            updater(gaugeLevel:number){
                this._gaugeLevel = this.round(gaugeLevel);  // integer [0 - 100]
                if (this.chartF && this.chartP2 && this.chartP) {
                    console.log("Entered update");
                    this.updateChart(this.chartF,   this._gaugeLevel,true);
                    this.updateChart(this.chartP2,  this._gaugeLevel,false);
                    this.updateChart(this.chartP,   this._gaugeLevel,false);
                }
            }
        @Watch('gaugeConfig', {deep:true})
            updater2(gaueConfig:GaugeConfig){
               // Object.assign(this._gaugeConfig, this.gaugeConfig);
               this._gaugeConfig =  this.gaugeConfig;
            }
    };
</script>

<style lang="scss" scoped>
 
    @import "styles/variables.scss";
        #gaugeContainer{
                /**adjust gauge size with this**/
                position: relative;
            }

            .flex-Container{
                display: flex;
                flex-direction:column;
                justify-content: center;
            }

            .chartItem{
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

            #canvasP{
                position: absolute;
               /* height: 30%; */
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }

            #canvasBck{
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }
            
            #canvasF{
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                right: 0;
                margin: auto;
            }

            /*********************** icons and text over the canvas*****/
    
            .holeTxt{
                font-size: 12pt;
                font-weight: bold;
                text-align: center;
            }
        

            #gaugeIcon{
                position: absolute;
                top:-4px;
                left: 43%;
                margin: 0;
                width: 18%;
            }

            #pointerDot{
                position: absolute;
                top:94%
            }
            
            #percentageValue{
                position: absolute;
                top:55%;
                font-weight: 300;
            }
            
            .avg-title {
                font-size: 9px;
                fill: #676C71;
            }
            
            
            img {
                border: 3px solid #fff;
                border-radius: 400px;
            }
            body{
                font-family: kuka-bulo;
               /* font-size: 1em; */
            }

</style>
