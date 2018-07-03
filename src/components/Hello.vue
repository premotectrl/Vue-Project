<template>

  <div id="share-buttons">
     <h1> Am a Vue Component</h1> 
    <a href="#" @click.prevent="share" v-if="facebook">Facebook</a>
    <a href="#" @click.prevent="share" v-if="twitter">Twitter</a>
    <a href="#" @click.prevent="share" v-if="gplus">Google+</a>
  
  </div>

</template>

<script lang = "ts">
//import Vue from 'vue'
const Vue = require('vue')
export default {
  props: {
    facebook: { type: Boolean, default: true },
    twitter: { type: Boolean, default: true },
    gplus: { type: Boolean, default: true }
  },
  methods: {
   /* share ($event) {
      window.alert('Share on ' + $event.target.innerHTML);
    } */
  }
}
</script>

<style scoped>
  #share-buttons a {
    display: inline-block;
    border: 1px solid #ddd;
    padding: 10px 20px;
    margin-right: 10px;
    text-transform: uppercase;
    color: #999;
    text-decoration: none;
    height: 300px;
  }
  #share-buttons a:hover {
    color: #333;
    border-color: #888;
  }
</style>