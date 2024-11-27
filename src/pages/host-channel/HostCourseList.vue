<script setup>
import router from "@/routers/index.js";

const moveToCourseRegisterForm = () => {
  router.push({
    name: 'CourseRegisterForm',
  });
}
</script>

<template>
개설 클래스
  <div>
    <button class="btn btn-primary float-end" type="button" @click="moveToCourseRegisterForm">클래스 개설</button>
  </div>
</template>

<style scoped>
</style>
