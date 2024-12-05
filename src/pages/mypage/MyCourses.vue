<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';
import { formatDateString } from '@/util/DateFormatter.js';
import Refund from '@/components/modal/Refund.vue';
import ReviewRegist from '@/components/modal/ReviewRegist.vue';

const router = useRouter();
const { get, post } = useAPI();
const courses = ref([]);
const loading = ref(true);
const error = ref(null);
const activeTab = ref('upcoming');
const showCancelModal = ref(false);
const selectedCourse = ref(null);
const showReviewModal = ref(false);
const selectedCourseForReview = ref(null);

const tabs = [
  { id: 'upcoming', label: '수강 예정', status: 'UPCOMING' },
  { id: 'completed', label: '수강 완료', status: 'COMPLETED' },
  { id: 'refunded', label: '환불', status: 'REFUNDED' },
  { id: 'all', label: '전체', status: null },
];

const getStatusLabel = (status) => {
  switch (status) {
    case 'UPCOMING':
      return '수강 예정';
    case 'COMPLETED':
      return '수강 완료';
    case 'REFUNDED':
      return '환불';
    default:
      return '알 수 없음';
  }
};

const getStatusClass = (status) => {
  switch (status) {
    case 'UPCOMING':
      return 'status-upcoming';
    case 'COMPLETED':
      return 'status-completed';
    case 'REFUNDED':
      return 'status-refunded';
    default:
      return '';
  }
};

const formatDate = (start, end = null) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  if (endDate && startDate.toDateString() === endDate.toDateString()) {
    return `${formatDateString(start)} ~ ${formatDateString(end, 'HH:mm')}`;
  }
  return `${formatDateString(start)} ${end ? `~ ${formatDateString(end)}` : ''}`;
};

const fetchCourses = async (status = null) => {
  try {
    loading.value = true;
    const response = await get(`/my/courses${status ? `?status=${status}` : ''}`);
    courses.value = response.data.data
      .filter(course => !status || course.status === status)
      .map((course) => ({
        ...course,
        formattedStartTime: formatDate(course.startTime, course.endTime),
        completeDate: course.completeDate ? formatDateString(course.completeDate) : null,
        refundDate: course.refundDate ? formatDateString(course.refundDate) : null,
        canCancel: () => {
          const now = new Date();
          const startTime = new Date(course.startTime);
          return course.status === 'UPCOMING' && startTime > now;
        },
      }));
  } catch (err) {
    console.error('클래스 목록을 불러오지 못했습니다:', err);
    error.value = '클래스 목록을 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
};

const handleCourseClick = async (courseId) => {
  try {
    await router.push(`/courses/${courseId}`);
  } catch (err) {
    console.error('클래스 상세 페이지로 이동 중 오류:', err);
    alert('클래스 상세 정보를 불러올 수 없습니다.');
  }
};

const handleTabChange = (tab) => {
  activeTab.value = tab.id;
  fetchCourses(tab.status);
};

const openCancelModal = (course) => {
  if (!course.canCancel()) {
    alert('취소할 수 없는 클래스입니다.');
    return;
  }
  selectedCourse.value = course;
  showCancelModal.value = true;
};

const handleCancelComplete = async () => {
  showCancelModal.value = false;
  await fetchCourses(activeTab.value !== 'all' ? tabs.find((t) => t.id === activeTab.value).status : null);
};

const openReviewModal = (course) => {
  selectedCourseForReview.value = course;
  showReviewModal.value = true;
};

const handleReviewSubmit = async (reviewData) => {
  try {
    await post(`/my/courses/${selectedCourseForReview.value.courseId}/review`, reviewData);
    showReviewModal.value = false;
    await fetchCourses(activeTab.value !== 'all' ? tabs.find((t) => t.id === activeTab.value).status : null);
  } catch (err) {
    throw new Error(err.response?.data?.message || '리뷰 작성에 실패했습니다.');
  }
};

onMounted(() => {
  fetchCourses(tabs[0].status);
});
</script>

<template>
  <div class="my-courses-container">
    <div class="tabs">
      <button v-for="tab in tabs" :key="tab.id" class="tab-button" :class="{ active: activeTab === tab.id }"
        @click="handleTabChange(tab)">
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>로딩 중입니다. 잠시만 기다려 주세요...</p>
    </div>

    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else-if="courses.length === 0" class="empty-state">
      <i class="empty-icon">📚</i>
      <p>등록된 클래스가 없습니다.</p>
    </div>

    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="card-image" @click="handleCourseClick(course.courseId)">
          <img :src="course.imgUrl || '/default-course.jpg'" :alt="course.title" />
          <div class="image-overlay">
            <span>자세히 보기</span>
          </div>
        </div>

        <div class="card-content">
          <div class="info-section">
            <div class="title-section">
              <h1 class="course-title" @click="handleCourseClick(course.courseId)">
                {{ course.title }}
                <div :class="['status-badge', getStatusClass(course.status)]">
                  {{ getStatusLabel(course.status) }}
                </div>
              </h1>
            </div>
            <div class="info-item">
              <span class="label">강사:</span>
              <span>{{ course.instructorName }}</span>
            </div>
            <div class="info-item">
              <span class="label">수강 일정:</span>
              <span>{{ course.formattedStartTime }}</span>
            </div>
          </div>

          <div class="divider"></div>

          <div class="payment-section">
            <div class="payment-header">
              <div class="participant-info">
                <span class="label">참여 인원:</span>
                <span>{{ course.participantNum }}명</span>
              </div>
              <div class="actions">
                <button v-if="course.status === 'UPCOMING'" @click="openCancelModal(course)" class="cancel-button">
                  결제 취소
                </button>
                <button v-if="course.status === 'COMPLETED' && !course.hasReview" @click="openReviewModal(course)"
                  class="review-button">
                  리뷰 작성
                </button>
              </div>
            </div>
            <div class="payment-info">
              <div class="info-item">
                <span class="label">인당 금액:</span>
                <span>{{ course.totalAmount.toLocaleString() }}원</span>
              </div>
              <div v-if="course.completeDate" class="info-item">
                <span class="label">결제 일시:</span>
                <span>{{ course.completeDate }}</span>
              </div>
              <div v-if="course.refundDate" class="info-item">
                <span class="label">환불 일시:</span>
                <span>{{ course.refundDate }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Refund v-if="showCancelModal" :show="showCancelModal" :course="selectedCourse" @close="showCancelModal = false"
      @cancel-complete="handleCancelComplete" />

    <ReviewRegist v-if="showReviewModal" :show="showReviewModal" :course="selectedCourseForReview"
      @close="showReviewModal = false" @submit-review="handleReviewSubmit" />
  </div>
</template>

<style scoped>
.my-courses-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1.5rem;
}

.tabs {
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #eee;
  position: relative;
}

.tab-button {
  padding: 0.8rem 1.2rem;
  background: none;
  border: none;
  font-size: 0.9rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: all 0.3s ease;
  outline: none;
}

.tab-button::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #FF9800;
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.tab-button:hover:not(.active) {
  color: #FF9800;
}

.tab-button.active {
  color: #FF9800;
  font-weight: 600;
}

.tab-button.active::after {
  transform: scaleX(1);
}

.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  animation: fadeIn 0.3s ease;
}

.course-card {
  display: flex;
  background: #fff;
  border-radius: 12px;
  border: 1px solid #FF9800;
  overflow: hidden;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 12px rgba(0, 0, 0, 0.15);
}

.card-image {
  width: 200px;
  height: 150px;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-overlay span {
  color: white;
  font-size: 0.9rem;
  font-weight: 500;
}

.card-image:hover img {
  transform: scale(1.05);
}

.card-image:hover .image-overlay {
  opacity: 1;
}

.card-content {
  display: flex;
  flex: 1;
  padding: 1.2rem;
}

.info-section {
  flex: 2;
}

.title-section {
  margin-bottom: 1rem;
}

.course-title {
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 1rem;
  color: #363636; 
}

.course-title:hover {
  color: #FF9800;
}

.status-badge {
  display: inline-block;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  transition: all 0.3s ease;
}

.status-upcoming {
  color: #FF9800;
  border: 1px solid #FF9800;
  background-color: transparent;
}

.status-completed {
  color: #666;
  background-color: #f5f5f5;
  border: 1px solid #ddd;
}

.status-refunded {
  color: #dc3545;
  border: 1px solid #dc3545;
  background-color: transparent;
}

.divider {
  width: 1px;
  background: #eee;
  margin: 0 1.5rem;
}

.payment-section {
  flex: 1.2;
  display: flex;
  flex-direction: column;
}

.payment-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.participant-info {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  align-items: center;
}

.participant-info .label {
  color: #666;
  font-weight: 500;
}

.actions {
  display: flex;
  gap: 0.8rem;
}

.cancel-button,
.review-button {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button {
  background-color: transparent;
  border: 1px solid #dc3545;
  color: #dc3545;
}

.cancel-button:hover {
  background-color: #dc3545;
  color: white;
}

.review-button {
  background-color: #FF9800;
  border: none;
  color: white;
}

.review-button:hover {
  background-color: #F57C00;
}

.payment-info {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.info-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
  padding: 0.3rem 0;
  align-items: center;
}

.info-item .label {
  color: #666;
  font-weight: 500;
  min-width: 70px;
}

.total-amount {
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px dashed #eee;
  font-weight: 600;
}

.total-amount span {
  color: #333;
}

.loading-state {
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #f3f3f3;
  border-top: 3px solid #FF9800;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.empty-state {
  text-align: center;
  padding: 3rem 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
  display: block;
}

.empty-state p {
  color: #666;
  font-size: 1rem;
}

.error-state {
  text-align: center;
  padding: 2rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  color: #dc3545;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1024px) {
  .course-card {
    flex-direction: column;
  }

  .card-image {
    width: 100%;
    height: 180px;
  }

  .card-content {
    flex-direction: column;
  }

  .divider {
    width: 100%;
    height: 1px;
    margin: 1rem 0;
  }

  .payment-section {
    margin-top: 1rem;
  }
}

@media (max-width: 768px) {
  .my-courses-container {
    padding: 1rem;
  }

  .tabs {
    gap: 1rem;
  }

  .tab-button {
    padding: 0.8rem 1rem;
    font-size: 0.9rem;
  }

  .course-title {
    font-size: 1.1rem;
  }

  .info-item {
    font-size: 0.85rem;
  }
}

.course-title,
.info-item span {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>




