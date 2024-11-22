app.vue
<script setup>
import Header from './components/common/Header.vue';
import Footer from './components/common/Footer.vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '@/stores/auth';
import { useUiStore } from '@/stores/ui';
//import Login from '@/components/common/Login.vue';

const auth = useAuthStore();
const route = useRoute();
const ui = useUiStore();

</script>

<template>
  <Header v-if="route.meta.layout !== 'empty'" />
  <main>
    <router-view></router-view>
  <Login v-if="auth.showLoginModal" />
  <div v-if="ui.loading" class="loading-overlay">
      <span>Loading...</span>
  </div>
  </main>
  <Footer v-if="route.meta.layout !== 'empty'" />
</template>

<style scoped>
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
  z-index: 1000;
}
</style>