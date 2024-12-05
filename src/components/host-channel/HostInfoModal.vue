<script setup>
import { ref, watch } from 'vue';
import {useAPI} from "@/axios/useAPI.js";

const { patch } = useAPI();

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  hostInfo: {
    type: Object,
    required: true,
    default: () => ({
      userNickname: '',
      hostBio: '',
      hostFacebook: '',
      hostInsta: '',
      hostTwitter: '',
      hostYoutube: '',
    }),
  },
});

const emit = defineEmits(['close', 'save']);

const nickname = ref(props.hostInfo?.userNickname || '');
const hostBio = ref(props.hostInfo?.hostBio || '');
const hostFacebook = ref(props.hostInfo?.hostFacebook || '');
const hostInsta = ref(props.hostInfo?.hostInsta || '');
const hostTwitter = ref(props.hostInfo?.hostTwitter || '');
const hostYoutube = ref(props.hostInfo?.hostYoutube || '');

const handleSubmit = async () => {
  try {
    const formData = new FormData();

    formData.append('hostBio', hostBio.value || '');
    formData.append('hostInsta', hostInsta.value);
    formData.append('hostFacebook', hostFacebook.value);
    formData.append('hostTwitter', hostTwitter.value);
    formData.append('hostYoutube', hostYoutube.value);

    await patch('/hosts/info', formData, {
      headers: {'Content-Type': 'multipart/form-data'}
    });

    emit('save');
    emit('close');
  } catch (error) {
    console.error('강사 정보 업데이트 실패:', error);
    alert('강사 정보 업데이트에 실패했습니다.');
  }
};

watch(
    () => props.hostInfo,
    (newValue) => {
      if (newValue) {
        nickname.value = newValue.userNickname;
        hostBio.value = newValue.hostBio ? newValue.hostFacebook : "";
        hostFacebook.value = newValue.hostFacebook ? newValue.hostFacebook : null;
        hostInsta.value = newValue.hostInsta ? newValue.hostInsta : null;
        hostTwitter.value = newValue.hostTwitter ? newValue.hostTwitter : null;
        hostYoutube.value = newValue.hostYoutube ? newValue.hostYoutube : null;
      }
    },
    { immediate: true }
);
</script>

<template>
  <div v-if="isOpen" class="modal-overlay">
    <div class="modal-content">
      <div class="title">
        <h2>강사 정보 수정</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <form>
          <div class="form-group">
            <label for="hostBio">소개</label>
            <textarea
                id="hostBio"
                v-model="hostBio"
                rows="3"
                placeholder="강사 소개를 입력해주세요"
            ></textarea>
          </div>
          <div class="form-group">
            <label for="hostKakao">인스타 계정</label>
            <input class="form-control" id="hostKakao" type="text" v-model="hostInsta">
          </div>
          <div class="form-group">
            <label for="hostInsta">페이스북 계정</label>
            <input class="form-control" id="hostInsta" type="text" v-model="hostFacebook">
          </div>
          <div class="form-group">
            <label for="hostBlog">트위터 계정</label>
            <input class="form-control" id="hostBlog" type="text" v-model="hostTwitter">
          </div>
          <div class="form-group">
            <label for="hostYoutube">유튜브</label>
            <input class="form-control" id="hostYoutube" type="text" v-model="hostYoutube">
          </div>
        </form>

        <div class="button-group">
          <button type="button" @click="emit('close')" class="cancel-btn">취소</button>
          <button type="submit" class="save-btn">저장</button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.title {
  font-weight: bold;
  margin-bottom: 10px;
}
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

.preview-container:hover .upload-overlay {
  opacity: 1;
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
