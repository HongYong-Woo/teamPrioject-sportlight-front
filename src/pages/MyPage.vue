<!-- 구현 중 -->
<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/auth';
import UserInfoCard from '@/components/mypage/UserInfoCard.vue';
import EditUserInfo from '@/components/mypage/EditUserInfo.vue';

const auth = useAuthStore();
const showEditModal = ref(false);

onMounted(async () => {
  await auth.fetchUserProfile();
});

const openEditModal = () => {
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
};

const handleSave = async () => {
  await auth.fetchUserProfile();
};
</script>

<template>
  <div class="my-page">
    <h1>마이페이지</h1>
    <UserInfoCard @open-edit-modal="openEditModal" />
    <EditUserInfo
      :is-open="showEditModal"
      :user-info="auth.userInfo"
      @close="closeEditModal"
      @save="handleSave"
    />
  </div>
</template>

<style scoped>
.my-page {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

h1 {
  margin-bottom: 2rem;
}
</style>