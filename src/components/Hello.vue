<template>
    <div>
        <div>
            <div class="greeting">{{name}}{{exclamationMarks}}</div>
            <button @click="decrement">-</button>
            <button @click="increment">+</button>
        </div>
        <svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 210 105" xml:space="preserve">
            <rect x="0.9" y="1.3" width="200" height="100" rx="5" ry="5" :stroke="state.color" />
            <text class="chart-title" x="105" y="30" text-anchor="middle">{{state.title | translate}}</text>
            <text id="num" x="125" y="78" font-size="2.3em" text-anchor="left" :fill="state.color">{{state.count}}</text>
            <g>
                <image :xlink:href="state.icon" x="75" y="50" height="30px" width="30px"></image>
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
        DataObject: [],
    },

    data: function() {
        return {
            enthusiasm: this.initialEnthusiasm,
            defaultStateCount:{
                id: "?",
                title: "Battery.",
                icon:"assets/pose-graph.svg",
                color:"#676c71",
                value: 0,
                count: 0,
            },
            state: this.DataObject
        }
    },
    /*
    data(): DataObject  {
        return{   
            detail: []
        };
    }, */
    methods: {
        increment() { this.enthusiasm++; },
        decrement() {
            if (this.enthusiasm > 1) {
                this.enthusiasm--;
            }
        },
    },
    computed: {
        exclamationMarks(): string {
            return Array(this.enthusiasm + 1).join('!');
        }
    },
    
    mounted(){
        if(this.state == undefined){
            this.state = this.defaultStateCount;
        }
    }
});

//interface DataObject{
 // detail: AGVStateCount[]
//}

interface AGVStateCount {
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