<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      userImage: '/default-profile.png',
      userNickname: '',
      userIntroduce: '',
      loginId: '',
      userName: '',
      userPhone: '',
      marketingAgreement: false,
      personalAgreement: false,
    }),
  },
});

const emit = defineEmits(['close', 'save']);
const auth = useAuthStore();

const imageFile = ref(null);
const imagePreview = ref(props.userInfo?.userImage || '/default-profile.png');
const nickname = ref(props.userInfo?.userNickname || '');
const introduce = ref(props.userInfo?.userIntroduce || '');
const marketingAgreement = ref(props.userInfo?.marketingAgreement || false);
const personalAgreement = ref(props.userInfo?.personalAgreement || false);

const handleImageChange = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('이미지 크기는 5MB를 초과할 수 없습니다.');
      event.target.value = '';
      return;
    }

    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      event.target.value = '';
      return;
    }

    imageFile.value = file;
    imagePreview.value = URL.createObjectURL(file);
  }
};

const handleSubmit = async () => {
  try {
    const formData = new FormData();

    if (imageFile.value) {
      formData.append('userImage', imageFile.value);
    }

    formData.append('userNickname', nickname.value || '');
    formData.append('userIntroduce', introduce.value || '');
    formData.append('marketingAgreement', marketingAgreement.value || false);
    formData.append('personalAgreement', personalAgreement.value || false);
    
    await auth.updateProfile(formData);

    emit('save');
    emit('close');
  } catch (error) {
    console.error('프로필 업데이트 실패:', error);
    alert('프로필 업데이트에 실패했습니다.');
  }
};

watch(
  () => props.userInfo,
  (newValue) => {
    if (newValue) {
      imagePreview.value = newValue.userImage || '/default-profile.png';
      nickname.value = newValue.userNickname || '';
      introduce.value = newValue.userIntroduce || '';
      marketingAgreement.value = newValue.marketingAgreement || false;
      personalAgreement.value = newValue.personalAgreement || false;
      imageFile.value = null;
    }
  },
  { immediate: true }
);
</script>


<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <h2>프로필 수정</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group image-upload-group">
          <div class="preview-container">
            <img :src="imagePreview" alt="Profile Preview" class="profile-preview" />
            <div class="upload-overlay">
              <label for="image-upload" class="upload-label">
                <span class="upload-icon">📷</span>
                <span class="upload-text">이미지 변경</span>
              </label>
            </div>
          </div>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            @change="handleImageChange"
            class="hidden"
          />
        </div>

        <div class="form-group">
          <label for="nickname">닉네임 *</label>
          <input
            id="nickname"
            v-model="nickname"
            type="text"
            required
            minlength="2"
            maxlength="15"
            placeholder="2-15자 사이로 입력해주세요"
          />
        </div>

        <div class="form-group">
          <label for="introduce">소개</label>
          <textarea
            id="introduce"
            v-model="introduce"
            rows="3"
            placeholder="자기소개를 입력해주세요"
          ></textarea>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="marketingAgreement" />
            <span>마케팅 정보 수신 동의</span>
          </label>
        </div>

        <div class="form-group checkbox-group">
          <label class="checkbox-label">
            <input type="checkbox" v-model="personalAgreement" />
            <span>개인정보 수집 및 이용 동의</span>
          </label>
        </div>

        <div class="button-group">
          <button type="button" @click="emit('close')" class="cancel-btn">취소</button>
          <button type="submit" class="save-btn">저장</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
  width: 90%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
}

.preview-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto 1.5rem;
}

.profile-preview {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0;
  transition: opacity 0.3s;
  cursor: pointer;
}

.preview-container:hover .upload-overlay {
  opacity: 1;
}

.upload-label {
  color: white;
  text-align: center;
  cursor: pointer;
}

.upload-icon {
  display: block;
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.hidden {
  display: none;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.form-group input[type="text"],
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
}

.checkbox-group {
  margin-bottom: 1rem;
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  margin-right: 0.5rem;
}

.button-group {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
}

.save-btn,
.cancel-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
}

.save-btn {
  background-color: #ff9300;
  color: white;
}

.save-btn:hover {
  background-color: #e68300;
}

.cancel-btn {
  background-color: #f0f0f0;
  color: #666;
}

.cancel-btn:hover {
  background-color: #e0e0e0;
}
</style>