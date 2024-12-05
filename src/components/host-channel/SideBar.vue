<template>
  <div class="container">
    <div v-for="category in categories"
         :key="category.id">
      <router-link class="menu-item" :to="category.link">
        <span>{{ category.name }}</span>
        <FontAwesomeIcon :icon="faChevronRight"/>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";

const categories = [
  { id: 1, name: '메인', link: '/hostchannel/main' },
  { id: 2, name: '개설 클래스', link: '/hostchannel/courses' },
  { id: 3, name: '정산 신청', link: '/hostchannel/adjustments/register' },
  { id: 4, name: '정산 내역', link: '/hostchannel/adjustments' },
  { id: 5, name: '결제 내역 관리', link: '/hostchannel/payments' },
];
</script>

<style scoped>

a {
  text-decoration: none;
  color: #333333;
}
.menu-item {
  padding: 15px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.submenu {
  padding: 10px 10px 10px 20px;
  background-color: #f1f1f1;
  font-weight: normal;
  margin-top: 5px;
  border-radius: 5px;
}

.submenu-item {
  padding: 8px;
}

.submenu-item a {
  text-decoration: none;
  color: #333;
}

.container {
  padding-top: 10px;
  padding-bottom: 15px;
}

</style>
