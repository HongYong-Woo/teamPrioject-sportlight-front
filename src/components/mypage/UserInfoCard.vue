<!-- 구현 중 -->
<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['open-edit-modal']);
const auth = useAuthStore();
const userInfo = computed(() => auth.userInfo);

const openEditModal = () => {
  emit('open-edit-modal');
};
</script>

<template>
  <div class="user-info-card">
    <div class="user-image">
      <img :src="userInfo?.userImage || '/default-profile.png'" alt="Profile" />
    </div>
    <div class="user-details">
      <h3 class="nickname">{{ userInfo?.userNickname || '닉네임 없음' }}</h3>
      <p class="introduce">{{ userInfo?.userIntroduce || '소개 없음' }}</p>
      <div class="user-info">
        <p><strong>아이디:</strong> {{ userInfo?.loginId }}</p>
        <p><strong>내 소개:</strong> {{ userInfo?.userIntroduce }}</p>
        <p><strong>이름:</strong> {{ userInfo?.userName }}</p>
        <p><strong>전화번호:</strong> {{ userInfo?.userPhone }}</p>
        <p><strong>마케팅 동의:</strong> {{ userInfo?.marketingAgreement ? '동의' : '미동의' }}</p>
        <p><strong>개인정보 동의:</strong> {{ userInfo?.personalAgreement ? '동의' : '미동의' }}</p>
      </div>
    </div>
    <button class="edit-btn" @click="openEditModal">수정</button>
  </div>
</template>

<style scoped>
.user-info-card {
  display: flex;
  align-items: flex-start;
  padding: 1.5rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
}

.user-image img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  margin-right: 2rem;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.user-details {
  flex-grow: 1;
}

.nickname {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.introduce {
  color: #666;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.user-info p {
  margin: 0.5rem 0;
  color: #333;
}

.edit-btn {
  padding: 0.5rem 1rem;
  background-color: #ff9300;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
}

.edit-btn:hover {
  background-color: #e68300;
}
</style>