
/*import Hello from './components/Hello.vue';
const Vue = require('vue/dist/vue')
const VueCustomElement = require('vue-custom-element/dist/vue-custom-element');
Vue.use(VueCustomElement);
Vue.customElement('v-state-count', new Hello().$options);*/

/****************** */

import ScalarChart from './components/VScalarChart.vue';
const Vue = require('vue/dist/vue')
const VueCustomElement = require('vue-custom-element/dist/vue-custom-element');
Vue.use(VueCustomElement);
Vue.customElement('v-scalar-chart', ScalarChart);