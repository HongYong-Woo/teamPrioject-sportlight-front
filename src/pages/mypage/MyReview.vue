<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';
import ReviewUpdate from '@/components/modal/ReviewUpdate.vue';
import formatRelativeTime from '@/util/relativeTimeFormatter.js';

const router = useRouter();
const { get, patch, remove } = useAPI();
const reviews = ref([]);
const showUpdateModal = ref(false);
const selectedReview = ref(null);

const handleKeydown = (e) => {
  if (e.key === 'Escape' && showUpdateModal.value) {
    showUpdateModal.value = false;
  }
};

const fetchReviews = async () => {
  try {
    const response = await get('/my/reviews');
console.log(response.data);
    console.log(response.data);
    if (response.data && Array.isArray(response.data.data)) {
      reviews.value = response.data.data;
      reviews.value.forEach(review => {
        if (!review.id) {
          console.error('리뷰 ID 없음', review);
        }
      });
    } else {
      console.error('리뷰 목록 데이터 형식 에러', response.data);
    }
  } catch (error) {
    console.error('리뷰 목록 null', error);
  }
};

const openUpdateModal = (review) => {
  selectedReview.value = { ...review };
  showUpdateModal.value = true;
};

const handleUpdate = async (updatedReview) => {
  if (!updatedReview.id) {
    console.error('리뷰 ID가 없습니다!');
    return;
  }
  try {
    await patch(`/my/reviews/${updatedReview.id}`, {
      content: updatedReview.content,
      rating: updatedReview.rating
    });
    await fetchReviews();
    showUpdateModal.value = false;
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
  }
};

const handleDelete = async (reviewId) => {
  if (!reviewId) {
    console.error('리뷰 ID가 없습니다!');
    return;
  }
  if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;
  
  try {
    await remove(`/my/reviews/${reviewId}`);
    await fetchReviews();
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
  }
};


onMounted(() => {
  fetchReviews();
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<template>
  <div class="reviews-container">
    <h1>내가 작성한 리뷰</h1>

    <div v-if="reviews.length === 0" class="empty-state">
      <p>작성한 리뷰가 없습니다.</p>
    </div>

    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-content">
          <div class="review-header">
            <div class="title-section">
              <h3 class="course-title" @click="router.push(`/courses/${review.courseId}`)">
                {{ review.courseTitle }}
              </h3>
              <span class="date">{{ formatRelativeTime(review.regDate) }}</span>
            </div>
            <div class="rating">
              <span v-for="i in 5" :key="i" 
                    class="star" :class="{ filled: i <= review.rating }">
                ★
              </span>
            </div>
          </div>
          
          <p class="content">{{ review.content }}</p>
          
          <div class="review-footer">
            <div class="actions">
              <button class="update-btn" @click="openUpdateModal(review)">
                수정
              </button>
              <button class="delete-btn" @click="handleDelete(review.id)">
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <ReviewUpdate
      v-if="showUpdateModal"
      :show="showUpdateModal"
      :review="selectedReview"
      @close="showUpdateModal = false"
      @update="handleUpdate"
    />
  </div>
</template>

<style scoped>
.reviews-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
  font-size: 2rem;
}

.reviews-grid {
  display: grid;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border-radius: 12px;
  border: #FF9800;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  transition: transform 0.2s ease;
}

.review-card:hover {
  transform: translateY(-2px);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 0.8rem;
}

.course-title {
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
  transition: color 0.2s;
  margin: 0;
}

.course-title:hover {
  color: #FF9800;
}

.date {
  color: #999;
  font-size: 0.85rem;
}

.rating {
  display: flex;
  gap: 2px;
}

.star {
  color: #ddd;
  font-size: 1.2rem;
}

.star.filled {
  color: #ffc107;
}

.content {
  color: #666;
  margin: 1rem 0;
  line-height: 1.6;
  font-size: 1rem;
  white-space: pre-line;
}

.review-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.update-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.update-btn {
  background: white;
  color: #FF9800;
  border: 1px solid #FF9800;
}

.update-btn:hover {
  background: #FF9800;
  color: white;
}

.delete-btn {
  background: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.delete-btn:hover {
  background: #dc3545;
  color: white;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .reviews-container {
    padding: 1rem;
  }
  
  .review-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .title-section {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .rating {
    margin-left: 0;
  }
}
</style>