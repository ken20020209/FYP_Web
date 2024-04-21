<script setup lang="ts">
const serverSrc = `${import.meta.env.VITE_SERVICE_BASE_URL}/server/status`;
</script>

<template>
  <!-- {{ serverSrc }} -->
  <!-- eslint-disable-next-line vue/no-static-inline-styles -->
  <iframe :src="serverSrc" style="width: 100%; height: 100%; border: none"></iframe>
  <!-- <iframe src="http://www.ken20020209.com:8080" style="width: 100%; height: 100%; border: none"></iframe> -->
</template>
