<template>
  <div class="main-container">
    <div class="sidebar">
      <SideBar :categories="categories" :submenus="submenus"></SideBar>
    </div>
    <div class="content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import SideBar from "@/components/host-channel/SideBar.vue";

const categories = [
  { id: 1, name: '메인', link: '/hostchannel/main' },
  { id: 2, name: '개설 클래스', link: '/hostchannel/courses' },
  { id: 3, name: '수익금 관리'}
];

const submenus = {
  3: [
    { id: 1, name: '정산 신청', link: '/hostchannel/adjustments/register' },
    { id: 2, name: '정산 내역', link: '/hostchannel/adjustments' },
    { id: 3, name: '결제 내역 관리', link: '/hostchannel/payments' },
  ]
};
</script>

<style scoped>
.main-container{
  height: 1200px;
}
.sidebar {
  width: 25%;
  height: fit-content;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  float: left;
}
.content {
  width: 75%;
  height: 100%;
  padding-left: 3%;
  float: right;
}
</style>
