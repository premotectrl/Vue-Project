<template>
    <div>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 210 105" xml:space="preserve">
            <rect x="0.9" y="1.3" width="200" height="100" rx="5" ry="5" :stroke="DataObject.color" />
            <text class="chart-title" x="105" y="30" text-anchor="middle">{{DataObject.title | translate}}</text>
            <text id="num" x="125" y="78" font-size="2.3em" text-anchor="left" :fill="DataObject.color">{{DataObject.count}}</text>
            <g>
               <image :xlink:href="DataObject.icon" x="75" y="50" height="30px" width="30px"></image>
            </g>
        </svg>
    </div>
</template>

<script lang="ts">
import Vue from "vue";

export default Vue.extend({
    props: {
        name: String, 
        initialEnthusiasm: Number,
        DataObject: {
            type: Object as () => AGVStateCount,
            default : {
                id: "?",
                title: "Unknown",
                icon:"",
                color:"#676c71",
                value: 0,
                count: 0,
            }
        }
    }
});
export interface AGVStateCount {
    id: string,
    title: string,
    icon:string,
    color:string,
    value: number,
    count: number
}
</script>

<style>
.greeting {
    font-size: 20px;
}
   svg {
        width:145pt;
        top:0;
        left:0;
        bottom: 0;
        right:0;
        }
            
        svg rect {
            fill:none;
            stroke-width: 1.5;
        }
            
        .chart-title {
            font-family: kuka-bulo;
            font-size: 13pt;
            fill: #676C71;
        }
        
</style>