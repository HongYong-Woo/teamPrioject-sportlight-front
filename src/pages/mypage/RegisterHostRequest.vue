<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';

const router = useRouter();
const { get, post, patch } = useAPI();

const isEditMode = ref(false);
const hostForm = ref({
  hostBio: '',
  portfolio: '',
  certifications: []
});

const loading = ref(true);
const error = ref('');
const success = ref(false);

onMounted(async () => {
  try {
    const response = await get('/my/host-request');
    const data = response.data.data;
    if (data) {
      hostForm.value = {
        hostBio: data.hostBio || '',
        portfolio: data.portfolio || '',
        certifications: []
      };
      isEditMode.value = true;
    }
  } catch (err) {
    if (err.response?.status !== 404) {
      error.value = '데이터를 불러오는데 실패했습니다.';
    }
  } finally {
    loading.value = false;
  }
});

const handleSubmit = async () => {
  const formData = new FormData();
  formData.append('hostBio', hostForm.value.hostBio || '');
  formData.append('portfolio', hostForm.value.portfolio || '');

  if (hostForm.value.certifications.length > 0) {
    hostForm.value.certifications.forEach(file => {
      formData.append('certification', file);
    });
  }

  try {
    error.value = '';
    const apiCall = isEditMode.value ?
      () => patch('/my/host-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }) :
      () => post('/my/host-request', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

    await apiCall();
    success.value = true;
    setTimeout(() => {
      router.push('/mypage/host-request');
    }, 1500);
  } catch (err) {
    error.value = '요청 처리에 실패했습니다. 다시 시도해주세요.';
    console.error('Error:', err);
  }
};
</script>

<template>
  <div class="register-host-page">
    <div class="header">
      <button class="back-btn" @click="router.go(-1)">
        ←
      </button>
      <h1>{{ isEditMode ? '강사 등록 수정' : '강사 등록 신청' }}</h1>
    </div>

    <div v-if="loading" class="loading-state">
      <p>로딩 중...</p>
    </div>

    <div v-else class="form-container">
      <div v-if="success" class="success-message">
        {{ isEditMode ? '수정이 완료되었습니다!' : '강사 등록 요청이 성공적으로 제출되었습니다!' }}
      </div>

      <form @submit.prevent="handleSubmit" class="host-form">
        <div class="form-group">
          
          <label for="hostBio">강사 소개 *</label>
          <textarea id="hostBio" v-model="hostForm.hostBio" :maxlength="1200" rows="5" required
            placeholder="강사로서의 경험과 전문성을 소개해주세요."></textarea>
          <p class="help-text">
            {{ hostForm.hostBio.length }}/1200자
          </p>
        </div>

        <div class="form-group">
          <label for="portfolio">포트폴리오 링크</label>
          <input id="portfolio" type="text" v-model="hostForm.portfolio" placeholder="포트폴리오 URL을 입력해주세요." />
        </div>

        <div class="form-group">
          <label for="certifications">인증서 파일 *</label>
          <input id="certifications" type="file" multiple
            @change="e => hostForm.certifications = Array.from(e.target.files)" accept=".pdf,.jpg,.jpeg,.png" />
          <p class="help-text">
            * PDF, JPG, JPEG, PNG 파일만 업로드 가능합니다. (최대 5개 파일)
          </p>
        </div>

        <div v-if="error" class="error-message">{{ error }}</div>
        <div class="button-group">
          <button type="submit" class="submit-btn">
            {{ isEditMode ? '수정하기' : '등록하기' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-host-page {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.header {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  gap: 20px;
}

.back-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  color: #666;
  cursor: pointer;
}

.back-btn:hover {
  color: #333;
}

.form-container {
  background: white;
  padding: 24px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
}

.help-text {
  margin-top: 4px;
  font-size: 14px;
  color: #666;
}

.success-message {
  padding: 16px;
  background-color: #d4edda;
  color: #155724;
  border-radius: 4px;
  margin-bottom: 20px;
}

.error-message {
  padding: 16px;
  background-color: #f8d7da;
  color: #721c24;
  border-radius: 4px;
  margin-bottom: 20px;
}

.button-group {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
  justify-content: center;
}

.submit-btn {
  padding: 12px 24px;
  background-color: #FF9800;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
}

.submit-btn:hover {
  background-color: #F57C00;
}

.loading-state {
  text-align: center;
  padding: 40px;
  color: #666;
}
</style>