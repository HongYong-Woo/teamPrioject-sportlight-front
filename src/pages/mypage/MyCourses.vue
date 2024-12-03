<script setup>
import { ref, onMounted } from 'vue';
import { useAPI } from '@/axios/useAPI';
import { useRouter } from 'vue-router';

const router = useRouter();
const { get, post } = useAPI();
const activeTab = ref('전체');
const enrolledClasses = ref([]);
const loading = ref(true);
const error = ref(null);

const tabs = ['수강 예정', '수강 완료', '환불', '전체'];

const STATUS_MAP = {
  '수강 예정': 'RESERVED',
  '수강 완료': 'COMPLETED',
  '환불': 'REFUNDED',
  '전체': null,
};

const fetchEnrolledClasses = async (status = null) => {
  try {
    loading.value = true;
    error.value = null;
    const response = await get(`/my/courses${status ? `?status=${status}` : ''}`);
    enrolledClasses.value = response.data.data;
  } catch (err) {
    console.error('클래스 목록을 불러오지 못했습니다:', err);
    error.value = '클래스 목록을 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
};

const setTab = (tab) => {
  activeTab.value = tab;
  fetchEnrolledClasses(STATUS_MAP[tab]);
};

const cancelClass = async (courseId) => {
  if (!confirm('정말로 이 클래스를 취소하시겠습니까?\n환불 규정에 따라 수수료가 발생할 수 있습니다.')) {
    return;
  }

  try {
    await post(`/my/courses/${courseId}/cancel`);
    await fetchEnrolledClasses(STATUS_MAP[activeTab.value]);
  } catch (error) {
    console.error('클래스 취소 실패:', error);
    alert('클래스 취소 중 오류가 발생했습니다.');
  }
};

const writeReview = (courseId) => {
  router.push(`/mypage/courses/${courseId}/review`);
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

const calculateRefundAmount = (course) => {
  const startDate = new Date(course.startTime);
  const now = new Date();
  const diffDays = Math.ceil((startDate - now) / (1000 * 60 * 60 * 24));

  if (diffDays >= 7) return course.finalAmount;
  if (diffDays >= 5) return course.finalAmount * 0.75;
  if (diffDays >= 3) return course.finalAmount * 0.5;
  if (diffDays >= 1) return course.finalAmount * 0.25;
  return 0;
};

onMounted(() => fetchEnrolledClasses());
</script>

<template>
  <div class="enrolled-classes-container">
    <div class="header">
      <h1>내가 신청한 클래스</h1>
    </div>

    <div class="tabs-container">
      <div class="tabs">
        <button v-for="tab in tabs" :key="tab" 
                :class="['tab-button', { active: activeTab === tab }]"
                @click="setTab(tab)">
          {{ tab }}
        </button>
      </div>
    </div>

    <div v-if="loading" class="loading-state">
      로딩 중...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else>
      <div v-if="enrolledClasses.length === 0" class="empty-state">
        <p>신청한 클래스가 없습니다.</p>
      </div>

      <div v-else class="classes-grid">
        <div v-for="course in enrolledClasses" :key="course.id" 
             class="class-card" :class="course.status.toLowerCase()">
          <div class="class-image">
            <img :src="course.imgUrl || '/default-class.jpg'" :alt="course.title">
          </div>
          
          <div class="class-content">
            <div class="class-main">
              <h3 @click="router.push(`/courses/${course.id}`)" class="class-title">
                {{ course.title }}
              </h3>
              <div class="class-details">
                <p class="instructor">강사: {{ course.instructorName }}</p>
                <p class="schedule">
                  일정: {{ formatDate(course.startTime) }} ~ {{ formatDate(course.endTime) }}
                </p>
                <p class="participants">신청 인원: {{ course.participantNum }}명</p>
                <p class="amount">
                  결제 금액: {{ course.finalAmount.toLocaleString() }}원
                  <span v-if="course.totalAmount !== course.finalAmount" class="discount">
                    ({{ ((1 - course.finalAmount/course.totalAmount) * 100).toFixed(0) }}% 할인)
                  </span>
                </p>
              </div>
            </div>

            <div class="class-actions">
              <div v-if="course.status === 'RESERVED'" class="action-buttons">
                <button class="cancel-button" @click="cancelClass(course.id)">
                  취소하기
                  <span class="refund-info">
                    (예상 환불액: {{ calculateRefundAmount(course).toLocaleString() }}원)
                  </span>
                </button>
              </div>
              <div v-else-if="course.status === 'COMPLETED' && !course.hasReview" 
                   class="action-buttons">
                <button class="review-button" @click="writeReview(course.id)">
                  리뷰 작성
                </button>
              </div>
              <div v-else-if="course.status === 'REFUNDED'" class="refund-info">
                <p>환불 완료: {{ formatDate(course.refundDate) }}</p>
                <p>환불 금액: {{ course.refundAmount.toLocaleString() }}원</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.enrolled-classes-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.header {
  margin-bottom: 2rem;
}

.header h1 {
  font-size: 2rem;
  color: #333;
}

.tabs-container {
  margin-bottom: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.tab-button {
  background: none;
  border: none;
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.tab-button:hover {
  background-color: #f8f9fa;
}

.tab-button.active {
  color: #FF9800;
  font-weight: 600;
  position: relative;
}

.tab-button.active::after {
  content: '';
  position: absolute;
  bottom: -0.5rem;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FF9800;
}

.classes-grid {
  display: grid;
  gap: 1.5rem;
}

.class-card {
  display: flex;
  gap: 1.5rem;
  background: white;
  border-radius: 12px;
  overflow: hidden;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.class-card:hover {
  transform: translateY(-4px);
}

.class-image {
  flex: 0 0 200px;
}

.class-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px;
}

.class-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.class-title {
  font-size: 1.4rem;
  margin-bottom: 1rem;
  color: #333;
  cursor: pointer;
}

.class-title:hover {
  color: #FF9800;
}

.class-details {
  color: #666;
  line-height: 1.6;
}

.discount {
  color: #ff5722;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.cancel-button, 
.review-button {
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-button {
  background-color: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.cancel-button:hover {
  background-color: #dc3545;
  color: white;
}

.review-button {
  background-color: #FF9800;
  color: white;
  border: none;
}

.review-button:hover {
  background-color: #F57C00;
}

.refund-info {
  color: #666;
  font-size: 0.9rem;
}

.loading-state,
.error-message,
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.error-message {
  color: #dc3545;
  background: #ffebee;
  border-radius: 8px;
}

@media (max-width: 768px) {
  .enrolled-classes-container {
    padding: 1rem;
  }

  .class-card {
    flex-direction: column;
  }

  .class-image {
    flex: none;
  }

  .action-buttons {
    flex-direction: column;
  }
}
</style>