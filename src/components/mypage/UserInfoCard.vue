<script setup>
import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import defaultImage from '@/assets/default_img.jpg';

const emit = defineEmits(['open-edit-modal']);
const auth = useAuthStore();
const userInfo = computed(() => auth.userInfo || {
  userImage: defaultImage,
  userNickname: '',
  userIntroduce: '',
  loginId: '',
  userName: '',
  userPhone: '',
  userAddress: '',
  userInterests: [],
  marketingAgreement: false,
  personalAgreement: false
});

const userImage = computed(() => userInfo.value.userImage || defaultImage);

const openEditModal = () => {
  emit('open-edit-modal');
};
</script>

<template>
  <div class="user-info-card">
    <div class="info-grid">
      <div class="profile-section">
        <div class="user-image-wrapper">
          <div class="user-image-container">
            <img :src="userImage" alt="Profile" class="user-image" />
          </div>
        </div>
      </div>

      <div class="header-section">
        <h3>내 정보</h3>
        <p class="subtitle">프로필 이미지와 닉네임, 내 소개를 통해 다른 회원님께 자신을 표현해보세요!</p>
        <div class="nickname-group">
          <span class="label">닉네임:</span>
          <div class="underline-value">{{ userInfo?.userNickname || '닉네임 없음' }}</div>
        </div>
      </div>

      <div class="contact-section">
        <div class="info-group">
          <span class="label">이메일:</span>
          <div class="underline-value">{{ userInfo?.loginId }}</div>
        </div>
        <div class="info-group">
          <span class="label">전화번호:</span>
          <div class="underline-value">{{ userInfo?.userPhone }}</div>
        </div>
      </div>

      <div class="introduce-section">
        <span class="label">내 소개:</span>
        <div class="introduce-box">
          {{ userInfo?.userIntroduce || '소개를 입력해주세요' }}
        </div>
      </div>
    </div>

    <button class="edit-btn" @click="openEditModal">
      내 정보 수정하기
    </button>
  </div>
</template>

<style scoped>
.user-info-card {
  background: white;
  border: 1px solid #FF9800;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  height: 100%;
  display: flex;
  flex-direction: column;
}

.info-grid {
  display: grid;
  grid-template-columns: 2fr 5fr;
  grid-template-rows: auto auto;
  gap: 24px;
  flex-grow: 1;
}

.profile-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px 0;
}

.user-image-container {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
}

.user-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border: 1px solid #e0e0e0;
}

.header-section {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.contact-section,
.introduce-section {
  padding-top: 8px;
}

.info-group {
  margin-bottom: 16px;
}

.info-group:last-child {
  margin-bottom: 0;
}

h3 {
  font-size: 20px;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.subtitle {
  color: #666;
  font-size: 14px;
  line-height: 1.5;
  margin: 0;
}

.label {
  display: block;
  color: #666;
  font-size: 14px;
  margin-bottom: 8px;
}

.underline-value {
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
  color: #333;
}

.introduce-box {
  background: #f9f9f9;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  padding: 16px;
  height: calc(100% - 40px);
  margin-top: 8px;
}

.edit-btn {
  width: 140px;
  padding: 8px;
  background: #FFF3E0;
  color: #FF9800;
  border: 1px solid #FF9800;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  display: block;
  margin: 24px auto 0;
  font-size: 14px;
}

.edit-btn:hover {
  background: #FFE0B2;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
  }

  .header-section {
    order: -2;
  }

  .profile-section {
    order: -1;
    padding: 16px 0;
  }

  .contact-section {
    order: 0;
  }

  .introduce-section {
    order: 1;
  }

  .info-group {
    margin-bottom: 12px;
  }

  .introduce-box {
    height: 120px;
  }

  .edit-btn {
    margin-top: 16px;
  }
}
</style>