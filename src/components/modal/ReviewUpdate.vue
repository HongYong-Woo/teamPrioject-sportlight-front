<script setup>
import { ref, watch } from 'vue';
import { useAPI } from '@/axios/useAPI';
import { formatDateString as DateFormatter } from '@/util/DateFormatter.js'

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  review: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'update']);

const rating = ref(0);
const content = ref('');
const errorMessage = ref('');

watch(() => props.review, (newReview) => {
  if (newReview) {
    rating.value = newReview.rating;
    content.value = newReview.content;
  }
}, { immediate: true });

const handleClose = () => {
  errorMessage.value = '';
  emit('close');
};

const handleSubmit = () => {
  if (!content.value.trim()) {
    errorMessage.value = '리뷰 내용을 입력해주세요';
    return;
  }
  if (rating.value === 0) {
    errorMessage.value = '별점을 선택해주세요';
    return;
  }

  emit('update', {
    id: props.review.id,
    content: content.value.trim(),
    rating: rating.value
  });
};

const handleOverlayClick = (e) => {
  if (e.target === e.currentTarget) {
    handleClose();
  }
};
</script>

<template>
  <Transition name="fade">
    <div v-if="show" class="modal-overlay" @click="handleOverlayClick">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>리뷰 수정</h2>
          <button class="close-btn" @click="handleClose">×</button>
        </div>

        <div class="modal-body">
          <div class="course-info">
            <div class="course-title">{{ review.courseTitle }}</div>
            <div class="review-date">리뷰 작성일: {{ DateFormatter(review.regDate) }}</div>
          </div>

          <div class="rating-section">
            <label>별점</label>
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

          <div class="content-section">
            <label>리뷰 내용</label>
            <textarea 
              v-model="content"
              placeholder="리뷰 내용을 입력해주세요"
              rows="5"
            ></textarea>
          </div>

          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </div>

        <div class="modal-footer">
          <button class="submit-btn" @click="handleSubmit">수정완료</button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 500px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.5rem;
  color: #333;
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0.5rem;
}

.modal-body {
  padding: 1.5rem;
}

.course-info {
  margin-bottom: 1.5rem;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.3rem;
}

.review-date {
  font-size: 0.9rem;
  margin-top: 5px;
  color: #666;
}

.rating-section,
.content-section {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 0.5rem;
  color: #666;
  font-weight: 500;
}

.star-rating {
  display: flex;
  gap: 0.3rem;
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

textarea {
  width: 100%;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
  min-height: 120px;
  font-family: inherit;
}

textarea:focus {
  outline: none;
  border-color: #FF9800;
  box-shadow: 0 0 0 2px rgba(255, 152, 0, 0.1);
}

.modal-footer {
  padding: 1rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.submit-btn {
  padding: 0.8rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn {
  background: #FF9800;
  color: white;
  border: none;
}

.submit-btn:hover {
  background: #F57C00;
}

.error-message {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: -0.5rem;
  margin-bottom: 1rem;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .modal-content {
    width: 95%;
    margin: 1rem;
  }

  .modal-header,
  .modal-body,
  .modal-footer {
    padding: 1rem;
  }

  .star-btn {
    font-size: 1.8rem;
  }
}
</style>