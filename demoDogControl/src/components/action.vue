<template>
    <h1>Action</h1>
    <button v-for="action in Object.keys(actionController.actionList)" v-on:click="actionController.actionList[action]()"> {{action}} </button>
  
  </template>
  <script setup>
  
  const controller= defineProps(['controller']);
  const actionController = controller.controller.action;
  
  </script>
  