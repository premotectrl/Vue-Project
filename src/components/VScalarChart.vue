<template>
    <div style="display: inline-block;">
        <h1>CHARTER</h1>
        <span id="chart-title">{{ title }} {{displayColors[0]}}</span>
        <div style="display: flex; align-items: center;">
            <div id="chart-container">
                <canvas class="donut-chart" width="150" height="150" :id="chartId"></canvas>
            </div>
            <div class="legend-table">
                <table align="left">
                    <tr v-for="(label, index) in labeld">
                        <td><div class="legend-table-color" :style="{'background-color':displayColors[index]}"> icon </div></td>
                        <td class="legend-table-value" :style="{'background-color':displayColors[index]}">{{round(vDataPoints[index])}}%</td>
                        <td class="legend-table-label">{{ label }}</td>
                    </tr>
                </table>
            </div>
        </div>
    </div>
</template>

<script>
    import Chart from 'chart.js';
   import {GUID} from './utils/utils';

    const updateGraph = (chart, data) => {
            Object.assign(chart.config.data.datasets[0].data, data);
            chart.update();
        };

    export default {
        name: "v-scalar-chart",
        props: {
            labels: Array,
            dataPoints: Array,
            colors: Array,
            title: String,
        },
        data() {
            return {
                id: null,
                options: {
                    cutoutPercentage: 70,
                    animation: {
                        animateRotate: false,
                        animateScale: false,
                    },
                    responsive: false,
                    legend: {
                        display: false,
                    },
                    tooltips: {
                        enabled: false,
                    },
                },
                donut: null,
                labeld: [ 'a', 'b', 'c'],
                vDataPoints: [10,30,70],
                displayColors: this.colors ? this.colors : ['#6EC8A0', '#CF2027',
                                                            '#285885', '#9F547D',
                                                            '#FFCD00', '#FF5800'],
            };
        },
        computed: {
            chartId() {
                if (!this.id) {
                    this.id = GUID();
                }
                return this.id;
            }
        },
        methods: {
          round (num) {
            return Math.round(num * 10)/10;
          }
        },
        created(){
            if(this.labels != undefined){
                this.labeld = this.labels;
            }
            if(this.dataPoints != undefined){
                this.vDataPoints = this.dataPoints;
            }
        },
        mounted() {
            const ctx = document.getElementById(this.chartId).getContext('2d');
            const config = {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: this.vDataPoints,
                        backgroundColor: this.displayColors,
                        borderWidth: [0, 0, 0, 0, 0],
                    }],
                },
                options: this.options,
            };
            this.donut = new Chart(ctx, config);
            this.donut.update();
           
        },
        watch: {
            dataPoints: {
                handler: function(data) {
                    updateGraph(this.donut, data);
                },
                deep: true,
            },
        },
    }
</script>

<style lang="scss" scoped>
 
    @import "styles/variables";

    #chart-title {
        display: inline-block;
        margin-bottom: 30px;
        font-family: kuka-bulo-bold;
    }

    #chart-container {
        display: inline-block;
        margin-right: 18px;
    }

    .legend-table {
        display: inline-block;
        height: 100%;
      
        background: #ff5800;
        color: #000;
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