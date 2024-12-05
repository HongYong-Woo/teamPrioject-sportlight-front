<!-- <script setup>
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
      return '환불 완료';
    default:
      return '알 수 없음';
  }
};

const fetchCourses = async (status = null) => {
  try {
    loading.value = true;
    const response = await get(`/my/courses${status ? `?status=${status}` : ''}`);
    courses.value = response.data.data.map((course) => ({
      ...course,
      formattedStartTime: formatDate(course.startTime),
      formattedEndTime: formatDate(course.endTime),
      canCancel: function () {
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

const formatDate = (date) => {
  if (!date) return '';
  return formatDateString(date);
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

const handleTabChange = (tab) => {
  activeTab.value = tab.id;
  fetchCourses(tab.status);
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
  fetchCourses();
});
</script>

<template>
  <div class="my-courses-container">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="handleTabChange(tab)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">로딩 중입니다. 잠시만 기다려 주세요...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else-if="courses.length === 0" class="empty-state">등록된 클래스가 없습니다.</div>

    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <div class="card-image" @click="router.push(`/courses/${course.courseId}`)">
          <img :src="course.imgUrl || '/default-course.jpg'" :alt="course.title" />
        </div>
        <div class="card-content">
          <div class="info-section">
            <div class="title-status">
              <h3 class="course-title" @click="router.push(`/courses/${course.courseId}`)">
                {{ course.title }}
              </h3>
              <span class="course-status" :class="course.status.toLowerCase()">
                {{ getStatusLabel(course.status) }}
              </span>
            </div>
            <div class="info-item">
              <span class="label">강사:</span>
              <span>{{ course.instructorName }}</span>
            </div>
            <div class="info-item">
              <span class="label">수강 일시:</span>
              <span>{{ formatDate(course.startTime) }}</span>
            </div>
            <div class="info-item">
              <span class="label">종료 일시:</span>
              <span>{{ formatDate(course.endTime) }}</span>
            </div>
          </div>
          <div class="divider"></div>
          <div class="payment-section">
            <div class="info-item">
              <span class="label">인원:</span>
              <span>{{ course.participantNum }}명</span>
            </div>
            <div class="info-item">
              <span class="label">요금:</span>
              <span>{{ course.totalAmount.toLocaleString() }}원</span>
            </div>
            <div class="info-item">
              <span class="label">총 결제 금액:</span>
              <span>{{ course.finalAmount.toLocaleString() }}원</span>
            </div>
            <div class="info-item">
              <span class="label">결제 일자:</span>
              <span>{{ formatDate(course.refundDate) }}</span>
            </div>
            <div class="actions">
              <button v-if="course.status === 'UPCOMING'" @click="openCancelModal(course)" class="cancel-button">
                취소
              </button>
              <button v-if="course.status === 'COMPLETED' && !course.hasReview" @click="openReviewModal(course)" class="review-button">
                리뷰 작성
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <Refund
      v-if="showCancelModal"
      :show="showCancelModal"
      :course="selectedCourse"
      @close="showCancelModal = false"
      @cancel-complete="handleCancelComplete"
    />

    <ReviewRegist
      v-if="showReviewModal"
      :show="showReviewModal"
      :course="selectedCourseForReview"
      @close="showReviewModal = false"
      @submit-review="handleReviewSubmit"
    />
  </div>
</template>
<style scoped>
.my-courses-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-button.active {
  color: #FF9800;
  font-weight: 600;
}

.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-card {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s;
}

.course-card:hover {
  transform: translateY(-4px);
}

.card-image {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding-left: 1rem;
}

.info-section {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.payment-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.divider {
  width: 1px;
  background: #ddd;
  margin: 0 1rem;
}

.title-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.course-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.course-title:hover {
  color: #FF9800;
}

.course-status {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.course-status.upcoming {
  border: 1px solid #FF9800;
  color: #FF9800;
  background: none;
}

.course-status.completed,
.course-status.refunded {
  background-color: #f0f0f0;
  color: #666;
}

.info-item {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.label {
  font-weight: bold;
  color: #555;
}

.amount-row,
.refund-row {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.amount {
  font-weight: bold;
  color: #333;
}

.refund-date {
  font-size: 0.9rem;
  color: #666;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style> -->

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
      return '환불 완료';
    default:
      return '알 수 없음';
  }
};

const fetchCourses = async (status = null) => {
  try {
    loading.value = true;

    const response = await get(`/my/courses${status ? `?status=${status}` : ''}`);

    courses.value = response.data.data
      .filter((course) => !status || course.status === status) // 상태에 맞게 필터링
      .map((course) => ({
        ...course,
        formattedStartTime: formatDate(course.startTime, course.endTime),
        completeDate: course.completeDate ? formatDateString(course.completeDate) : null,
        refundDate: course.refundDate ? formatDateString(course.refundDate) : null,
        canCancel: function () {
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


const formatDate = (start, end = null) => {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : null;

  if (endDate && startDate.toDateString() === endDate.toDateString()) {
    return `${formatDateString(start)} ~ ${formatDateString(end, 'HH:mm')}`;
  }

  return `${formatDateString(start)} ${end ? `~ ${formatDateString(end)}` : ''}`;
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

const handleTabChange = (tab) => {
  activeTab.value = tab.id;
  fetchCourses(tab.status);
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
  fetchCourses();
});
</script>

<template>
  <div class="my-courses-container">
    <div class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        class="tab-button"
        :class="{ active: activeTab === tab.id }"
        @click="handleTabChange(tab)"
      >
        {{ tab.label }}
      </button>
    </div>

    <div v-if="loading" class="loading-state">로딩 중입니다. 잠시만 기다려 주세요...</div>

    <div v-else-if="error" class="error-state">{{ error }}</div>

    <div v-else-if="courses.length === 0" class="empty-state">등록된 클래스가 없습니다.</div>

    <div v-else class="courses-grid">
      <div v-for="course in courses" :key="course.id" class="course-card">
        <!-- 이미지 -->
        <div class="card-image" @click="router.push(`/courses/${course.courseId}`)">
          <img :src="course.imgUrl || '/default-course.jpg'" :alt="course.title" />
        </div>

        <div class="card-content">
          <div class="info-section">
            <div class="title-status">
              <h3 class="course-title" @click="router.push(`/courses/${course.courseId}`)">
                {{ course.title }}
              </h3>
              <span class="course-status" :class="course.status.toLowerCase()">
                {{ getStatusLabel(course.status) }}
              </span>
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

          <div class="payment-section">
            <div class="actions">
              <button
                v-if="course.status === 'UPCOMING'"
                @click="openCancelModal(course)"
                class="cancel-button"
              >
                취소
              </button>
              <button
                v-if="course.status === 'COMPLETED' && !course.hasReview"
                @click="openReviewModal(course)"
                class="review-button"
              >
                리뷰 작성
              </button>
            </div>
            <div class="info-item">
              <span class="label">결제 금액:</span>
              <span>{{ course.finalAmount.toLocaleString() }}원</span>
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

    <Refund
      v-if="showCancelModal"
      :show="showCancelModal"
      :course="selectedCourse"
      @close="showCancelModal = false"
      @cancel-complete="handleCancelComplete"
    />

    <ReviewRegist
      v-if="showReviewModal"
      :show="showReviewModal"
      :course="selectedCourseForReview"
      @close="showReviewModal = false"
      @submit-review="handleReviewSubmit"
    />
  </div>
</template>

<style scoped>
.my-courses-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

.tabs {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 0.5rem;
}

.tab-button {
  padding: 0.8rem 1.5rem;
  background: none;
  border: none;
  font-size: 1rem;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s;
}

.tab-button.active {
  color: #FF9800;
  font-weight: 600;
}

.courses-grid {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.course-card {
  display: flex;
  flex-direction: row;
  padding: 1rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: relative;
}

.card-image {
  width: 200px;
  height: 150px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-content {
  display: flex;
  flex: 1;
  flex-direction: row;
  padding-left: 1rem;
}

.info-section {
  flex: 3;
  display: flex;
  flex-direction: column;
}

.payment-section {
  flex: 2;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.divider {
  width: 1px;
  background: #ddd;
  margin: 0 1rem;
}

.title-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.course-title {
  font-size: 1.4rem;
  font-weight: bold;
  margin: 0;
  cursor: pointer;
  transition: color 0.2s;
}

.course-title:hover {
  color: #FF9800;
}

.course-status {
  font-size: 0.9rem;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
}

.course-status.upcoming {
  border: 1px solid #FF9800;
  color: #FF9800;
  background: none;
}

.course-status.completed,
.course-status.refunded {
  background-color: #f0f0f0;
  color: #666;
}

.info-item {
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.label {
  font-weight: bold;
  color: #555;
}

.actions {
  position: absolute;
  top: 10px;
  right: 10px;
}

.cancel-button,
.review-button {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-button {
  background: #fff;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.cancel-button:hover {
  background: #dc3545;
  color: #fff;
}

.review-button {
  background: #FF9800;
  color: #fff;
  border: none;
}

.review-button:hover {
  background: #F57C00;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 3rem;
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>



