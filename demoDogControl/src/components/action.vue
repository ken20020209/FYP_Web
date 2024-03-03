<template>
    <h1>Action</h1>
    <button v-for="action in Object.keys(actionController.actionList)" v-on:click="actionController.actionList[action]()"> {{action}} </button>
  
  </template>
  <script setup>
  
  const props= defineProps(['controller']);
  const actionController = props.controller.action;
  
  </script>
  