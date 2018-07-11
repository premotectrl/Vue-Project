
import Hello from './components/Hello.vue';
//import Vue from 'vue'
const Vue = require('vue/dist/vue')
// include vue-custom-element plugin to Vue
//import VueCustomElement from 'vue-custom-element'
const VueCustomElement = require('vue-custom-element/dist/vue-custom-element');
Vue.use(VueCustomElement);

// import and register your component(s)

//const Hello = require('./components/Hello')

Vue.customElement('v-state-count', new Hello().$options);
