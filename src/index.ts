import Vue from "vue";
import HelloComponent from "./components/Hello.vue";
import AGVStateCount from  './components/Hello.vue';

config:AGVStateCount;

let v = new Vue({
    el: "#app",
    template: `
    <div>
        Name: <input v-model="name" type="text">
        <hello-component :name="name" :initialEnthusiasm="5" :DataObject="null" />
    </div>
    `,
    data: { 
        name: "World",
        config: {
            id: 1,
            title: "MR.AGV",
            icon: "",
            color:"#ffee21",
            value: 7,
            count: 30,
            power: Number
        } 
    },
    components: {
        HelloComponent
    }
});