<script setup>
import { ref } from 'vue';
import { formatDateString } from '@/util/DateFormatter.js';

const props = defineProps({
  show: Boolean,
  course: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'submit-review']);
const rating = ref(0);
const content = ref('');
const errorMessage = ref('');
const isProcessing = ref(false);

const handleClose = () => {
  rating.value = 0;
  content.value = '';
  errorMessage.value = '';
  emit('close');
};

const handleSubmit = async () => {
  if (rating.value === 0) {
    errorMessage.value = '별점을 선택해주세요.';
    return;
  }
  if (!content.value.trim()) {
    errorMessage.value = '리뷰 내용을 입력해주세요.';
    return;
  }

  try {
    isProcessing.value = true;
    await emit('submit-review', {
      rating: rating.value,
      content: content.value.trim()
    });
    handleClose();
  } catch (err) {
    errorMessage.value = err.message || '리뷰 작성 중 오류가 발생했습니다.';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div v-if="show" class="modal-overlay" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h2>리뷰 작성</h2>
        <button class="close-btn" @click="handleClose">×</button>
      </div>

      <div class="modal-body">
        <div class="section">
          <h3>클래스 정보</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">클래스명</span>
              <span>{{ course.title }}</span>
            </div>
            <div class="info-item">
              <span class="label">강사명</span>
              <span>{{ course.instructorName }}</span>
            </div>
            <div class="info-item">
              <span class="label">수강 일시</span>
              <span>{{ formatDateString(course.startTime) }}</span>
            </div>
          </div>
        </div>

        <div class="section">
          <h3>리뷰 작성</h3>
          <div class="rating-container">
            <span class="label">별점</span>
            <div class="star-rating">
              <button 
                v-for="i in 5" 
                :key="i"
                type="button"
                class="star-btn"
                :class="{ active: i <= rating }"
                @click="rating = i"
              >★</button>
            </div>
          </div>
          
          <div class="content-container">
            <textarea
              v-model="content"
              placeholder="리뷰 내용을 입력해주세요"
              rows="5"
              :disabled="isProcessing"
            ></textarea>
          </div>
        </div>

        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
      </div>

      <div class="modal-footer">
        <button class="cancel-btn" @click="handleClose" :disabled="isProcessing">
          취소
        </button>
        <button class="submit-btn" @click="handleSubmit" :disabled="isProcessing">
          {{ isProcessing ? '작성중...' : '리뷰 작성' }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* ... Refund.vue와 동일한 기본 모달 스타일 ... */

.star-rating {
  display: flex;
  gap: 0.3rem;
  margin-top: 0.5rem;
}

.star-btn {
  background: none;
  border: none;
  font-size: 2rem;
  color: #ddd;
  cursor: pointer;
  line-height: 1;
  padding: 0;
}

.star-btn.active {
  color: #ffc107;
}

.content-container {
  margin-top: 1rem;
}

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
  min-height: 120px;
}

textarea:focus {
  outline: none;
  border-color: #FF9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.1);
}

.error-message {
  color: #dc3545;
  margin-top: 1rem;
  font-size: 0.9rem;
}
</style>