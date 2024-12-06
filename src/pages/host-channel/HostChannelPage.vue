<template>
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
import { useRoute } from "vue-router";

const route = useRoute();


const categories = [
  { id: 1, name: '메인', link: '/hostchannel/main' },
  { id: 2, name: '개설 클래스', link: '/hostchannel/courses' },
  { id: 3, name: '정산 신청', link: '/hostchannel/adjustments/register' },
  { id: 4, name: '정산 내역', link: '/hostchannel/adjustments' },
  { id: 5, name: '결제 내역 관리', link: '/hostchannel/payments' },
];

</script>

<style scoped>
.main-container{
  height: auto;
}
.sidebar {
  width: 25%;
  height: 100%;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  border-radius: 5px;
}
.content {
  width: 75%;
  height: 100%;
  padding: 3%;
}
</style>
