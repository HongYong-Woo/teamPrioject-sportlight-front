 \<template>
  <div class="main-container row">
    <div class="sidebar col-3">
      <SideBar :categories="categories"></SideBar>
    </div>
    <div class="content col-9">
      <router-view :key="route.fullPath"></router-view>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/host-channel/SideBar.vue";
import {useRoute} from "vue-router";
const route = useRoute()

const categories = [
  { id: 1, name: '신청자 내역', link: `/management/${route.params.id}/applicants`},
  { id: 2, name: '클래스 정보', link: `/management/${route.params.id}/courses`},
  { id: 3, name: '클래스 일정', link: `/management/${route.params.id}/schedules`},
  { id: 4, name: '클래스 문의', link: `/management/${route.params.id}/qnas`},
];


</script>
