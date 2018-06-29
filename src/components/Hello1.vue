<template>
    <div>
         <div>
        <div class="greeting">Hello {{name}}{{exclamationMarks}}</div>
        <button @click="decrement">-</button>
        <button @click="increment">+</button>
    </div>
    </div>

</template>

<script lang="ts">
import Vue from "vue";
let con: any = null;
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
                title: "Unknown.",
                icon:"assets/mobile-robotics/battery-unknown.svg",
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