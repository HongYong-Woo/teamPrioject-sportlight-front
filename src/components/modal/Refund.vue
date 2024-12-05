<script setup>
import { ref, computed } from 'vue';
import { useAPI } from '@/axios/useAPI';
import { formatDateString as DateFormatter } from '@/util/DateFormatter.js'

const props = defineProps({
  show: Boolean,
  course: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'cancel-complete']);
const { post } = useAPI();
const isProcessing = ref(false);
const error = ref('');

const refundAmount = computed(() => {
  const startDate = new Date(props.course.startTime);
  const now = new Date();
  const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays >= 7) return props.course.finalAmount;
  if (diffDays >= 5) return props.course.finalAmount * 0.75;
  if (diffDays >= 3) return props.course.finalAmount * 0.5;
  if (diffDays >= 1) return props.course.finalAmount * 0.25;
  return 0;
});

const cancellationFee = computed(() => {
  return props.course.finalAmount - refundAmount.value;
});

const handleCancel = async () => {
  if (!confirm('정말로 결제를 취소하시겠습니까?')) return;
  
  try {
    isProcessing.value = true;
    await post(`/my/courses/${props.course.id}/cancel`, {
      cancelAmount: refundAmount.value,
      cancelReason: "고객 요청으로 인한 취소"
    });
    
    emit('cancel-complete');
  } catch (err) {
    error.value = err.response?.data?.message || '결제 취소 중 오류가 발생했습니다.';
  } finally {
    isProcessing.value = false;
  }
};
</script>

<template>
  <div class="courses-grid">
    <div v-for="course in courses" :key="course.id" class="course-card">
      <div class="card-image" @click="router.push(`/courses/${course.courseId}`)">
        <img :src="course.imgUrl || '/default-course.jpg'" :alt="course.title">
      </div>

      <div class="card-content">
        <div class="class-info">
          <h3 class="course-title" @click="router.push(`/courses/${course.courseId}`)">
            {{ course.title }}
          </h3>
          <div class="info-row">
            <span class="label">강사</span>
            <span>{{ course.instructorName }}</span>
          </div>
          <div class="info-row">
            <span class="label">시작 일시</span>
            <span>{{ formatDate(course.startTime) }}</span>
          </div>
          <div class="info-row">
            <span class="label">종료 일시</span>
            <span>{{ formatDate(course.endTime) }}</span>
          </div>
        </div>

        <div class="payment-info">
          <div class="course-status" :class="course.status.toLowerCase()">
            {{ course.status === 'UPCOMING' ? '수강 예정' :
               course.status === 'COMPLETED' ? '수강 완료' : '환불 완료' }}
          </div>

          <div class="info-row">
            <span class="label">결제 금액</span>
            <span class="price">{{ course.finalAmount.toLocaleString() }}원</span>
          </div>

          <template v-if="course.status === 'REFUNDED'">
            <div class="info-row refund">
              <span class="label">환불 금액</span>
              <span class="price">{{ course.refundAmount.toLocaleString() }}원</span>
            </div>
            <div class="info-row">
              <span class="label">환불 일시</span>
              <span>{{ formatDate(course.refundDate) }}</span>
            </div>
          </template>

          <div class="actions">
            <template v-if="course.status === 'UPCOMING'">
              <button class="cancel-button" @click="openCancelModal(course)">
                수강 취소
              </button>
            </template>
            <template v-else-if="course.status === 'COMPLETED' && !course.hasReview">
              <button class="review-button" @click="goToReviewPage(course.courseId)">
                리뷰 작성
              </button>
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.course-card {
  display: grid;
  grid-template-columns: 300px 1fr;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-image {
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  padding: 1.5rem;
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 2rem;
}

.class-info {
  flex: 1;
}

.info-row {
  display: grid;
  grid-template-columns: 100px 1fr;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.payment-info {
  min-width: 250px;
  border-left: 1px solid #eee;
  padding-left: 2rem;
}

.course-status {
  margin-bottom: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  display: inline-block;
}

.course-status.upcoming {
  background-color: #e3f2fd;
  color: #1976d2;
}

.course-status.completed {
  background-color: #e8f5e9;
  color: #388e3c;
}

.course-status.refunded {
  background-color: #ffebee;
  color: #d32f2f;
}

.price {
  font-weight: bold;
  font-size: 1.1rem;
}

.actions {
  margin-top: 1rem;
  display: flex;
  justify-content: flex-end;
}

/* ... 기존 버튼 스타일 유지 ... */

@media (max-width: 768px) {
  .course-card {
    grid-template-columns: 1fr;
  }
  
  .card-content {
    grid-template-columns: 1fr;
  }
  
  .payment-info {
    border-left: none;
    border-top: 1px solid #eee;
    padding-left: 0;
    padding-top: 1rem;
    margin-top: 1rem;
  }
}
</style>