<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAPI } from '@/axios/useAPI';

const router = useRouter();
const { get, patch, remove } = useAPI();
const reviews = ref([]);
const editingReview = ref(null);
const tempContent = ref('');
const tempRating = ref(0);

const fetchReviews = async () => {
  try {
    const response = await get('/my/reviews');
    reviews.value = response.data.data;
  } catch (error) {
    console.error('리뷰 목록을 불러오지 못했습니다:', error);
  }
};

const startEdit = (review) => {
  editingReview.value = review.id;
  tempContent.value = review.content;
  tempRating.value = review.rating;
};

const cancelEdit = () => {
  editingReview.value = null;
  tempContent.value = '';
  tempRating.value = 0;
};

const updateReview = async (reviewId) => {
  try {
    await patch(`/my/reviews/${reviewId}`, {
      content: tempContent.value,
      rating: tempRating.value
    });
    await fetchReviews();
    cancelEdit();
  } catch (error) {
    console.error('리뷰 수정 실패:', error);
  }
};

const deleteReview = async (reviewId) => {
  if (!confirm('정말로 이 리뷰를 삭제하시겠습니까?')) return;
  
  try {
    await remove(`/my/reviews/${reviewId}`);
    reviews.value = reviews.value.filter(review => review.id !== reviewId);
  } catch (error) {
    console.error('리뷰 삭제 실패:', error);
  }
};

onMounted(fetchReviews);
</script>

<template>
  <div class="reviews-container">
    <h1>내가 작성한 리뷰</h1>

    <div v-if="reviews.length === 0" class="empty-state">
      <p>작성한 리뷰가 없습니다.</p>
    </div>

    <div v-else class="reviews-grid">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div v-if="editingReview === review.id" class="edit-mode">
          <div class="rating-input">
            <button v-for="i in 5" :key="i"
                    @click="tempRating = i"
                    :class="['star', { active: i <= tempRating }]">
              ★
            </button>
          </div>
          <textarea v-model="tempContent" rows="4"></textarea>
          <div class="edit-actions">
            <button @click="updateReview(review.id)" class="save-btn">저장</button>
            <button @click="cancelEdit" class="cancel-btn">취소</button>
          </div>
        </div>
        
        <div v-else class="review-content">
          <div class="review-header">
            <h3 class="course-title" @click="router.push(`/courses/${review.courseId}`)">
              {{ review.courseTitle }}
            </h3>
            <div class="rating">
              <span v-for="i in 5" :key="i" 
                    :class="['star', { filled: i <= review.rating }]">
                ★
              </span>
            </div>
          </div>
          
          <p class="content">{{ review.content }}</p>
          <div class="review-footer">
            <span class="date">{{ new Date(review.regDate).toLocaleDateString() }}</span>
            <div class="actions">
              <button @click="startEdit(review)" class="edit-btn">수정</button>
              <button @click="deleteReview(review.id)" class="delete-btn">삭제</button>
            </div>
          </div>
        </div>
      </div>
    </div>
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
}

.reviews-grid {
  display: grid;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.course-title {
  font-size: 1.2rem;
  color: #333;
  cursor: pointer;
}

.course-title:hover {
  color: #FF9800;
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
}

.review-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
}

.date {
  color: #999;
  font-size: 0.9rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: white;
  color: #FF9800;
  border: 1px solid #FF9800;
}

.delete-btn {
  background: white;
  color: #dc3545;
  border: 1px solid #dc3545;
}

.edit-mode {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.rating-input {
  display: flex;
  gap: 4px;
}

.rating-input .star {
  cursor: pointer;
  font-size: 1.5rem;
}

.rating-input .star.active {
  color: #ffc107;
}

textarea {
  width: 100%;
  padding: 0.8rem;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
}

.edit-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.save-btn,
.cancel-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.save-btn {
  background: #FF9800;
  color: white;
  border: none;
}

.cancel-btn {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@media (max-width: 768px) {
  .reviews-container {
    padding: 1rem;
  }

  .review-header {
    flex-direction: column;
    gap: 0.5rem;
  }

  .review-footer {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }
}
</style>