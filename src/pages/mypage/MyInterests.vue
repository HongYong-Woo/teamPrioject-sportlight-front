<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';
import CourseCard from '@/components/course/CourseCard.vue';

const router = useRouter();
const interests = ref([]);
const loading = ref(true);
const error = ref(null);
const { get, patch } = useAPI();

const fetchInterests = async () => {
  try {
    loading.value = true;
    const response = await get('/my/interests');
    interests.value = response.data.data;
  } catch (error) {
    console.error('찜 목록을 불러오지 못했습니다:', error);
    error.value = '찜 목록을 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
};

const toggleInterest = async (courseId) => {
  try {
    const response = await patch(`/my/interests/${courseId}`);
    if (!response.data.data) {
      interests.value = interests.value.filter(item => item.id !== courseId);
    }
  } catch (error) {
    console.error('찜하기 토글 실패:', error);
  }
};

onMounted(fetchInterests);
</script>

<template>
  <div class="interests-container">
    <h1>찜 목록</h1>
    <div v-if="loading" class="loading-state">
      로딩 중...
    </div>

    <div v-else-if="error" class="error-message">
      {{ error }}
    </div>

    <div v-else-if="interests.length === 0" class="empty-state">
      <p>아직 찜한 클래스가 없습니다.</p>
      <button @click="router.push('/courses')" class="browse-btn">
        클래스 둘러보기
      </button>
    </div>

    <div v-else class="courses-grid">
      <CourseCard
        v-for="course in interests"
        :key="course.id"
        v-bind="course"
        @interest-toggle="toggleInterest"
      />
    </div>
  </div>
</template>

<style scoped>
.interests-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.courses-grid {
 display: flex;
 flex-wrap: wrap;
 gap: 2rem;
}

.course-card {
 flex: 0 0 266px;
}

.empty-state,
.loading-state,
.error-message {
  text-align: center;
  padding: 3rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.loading-state {
  color: #666;
}

.error-message {
  color: #dc3545;
}

.browse-btn {
  margin-top: 1rem;
  padding: 0.8rem 1.5rem;
  background: #FF9800;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.browse-btn:hover {
  background: #F57C00;
}

@media (max-width: 768px) {
  .interests-container {
    padding: 1rem;
  }

  .courses-grid {
    grid-template-columns: 1fr;
  }
}
</style>