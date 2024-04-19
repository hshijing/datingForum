<template>
  <div>
    <!-- svg通用组件 -->
    <svg>
      <use :xlink:href='`#icon-${svg}`'></use>
    </svg>
  </div>
</template>

<script setup lang="js">
defineProps({
  svg:String,
  
})
</script>

<style>

</style>