<script setup>
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { faStar, faStar as faRegStar } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref } from "vue";
import { useAPI } from "@/axios/useAPI";

const props = defineProps({
  courseId: {
    type: String,
    required: true,
  },
});

const { get } = useAPI();

const reviews = ref([{}]);

async function fetchReviews(state) {
  try {
    const response = await get(`/courses/${props.courseId}/reviews`);
    state.value = response.data.data;
  } catch (error) {
    console.error('Failed to fetch reviews', error);
  }
}

onMounted(() => {
  fetchReviews(reviews);
})

const getStarIcon = (rating, index) => {
  if (rating >= index) {
    return faStar; // 채워진 별
  } else {
    return faRegStar; // 빈 별
  }
};

const getStarClass = (rating, index) => {
  if (rating >= index || rating + 0.5 >= index) {
    return "star-filled"; // 노란색 별
  } else {
    return "star-empty"; // 회색 별
  }
};

</script>

<template>
  <div class="review-list">
    <div v-for="(review, index) in reviews" :key="index" class="review-item">
      <div class="review-header">
        <img :src="review.imgUrl || 'https://kr.object.ncloudstorage.com/sportlight/static_img/user_profile_icon.jpg'" alt="review-profile" @error="e => e.target.src = 'https://kr.object.ncloudstorage.com/sportlight/static_img/user_profile_icon.jpg'">
        <div class="review-header-detail-container">
          <span class="nickname">{{ review.nickname }}</span>
          <div class="review-header-detail">
            <FontAwesomeIcon v-for="i in 5" :key="i" class="rating" :icon="getStarIcon(review.rating, i)"
              :class="getStarClass(review.rating, i)" />
            <span class="date">{{ new Date(review.regDate).toLocaleDateString() }}</span>
          </div>
        </div>
      </div>
      <p class="content">{{ review.content }}</p>
    </div>
  </div>
</template>

<style scoped>
.review-item {
  padding: 0.5rem 1rem;
  border-bottom: 1px solid #d9d9d9;
}

.review-header {
  display: flex;
}

.review-header img {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 50%;
  margin-right: 0.25rem;
}

.review-header-detail-container {
  display: flex;
  flex-direction: column;
  margin-left: 0.25rem;
  gap: 0.125rem;
}

.nickname {
  font-size: 1rem;
}

.review-header-detail {
  display: flex;
  flex-direction: row;
  align-items: baseline;
}

.review-header-detail .star-filled {
  color: gold;
}

.review-header-detail .star-empty {
  color: lightgray;
}

.content {
  margin-top: 0.5rem;
  color: #333;
}

.date {
  font-size: 0.75rem;
  color: #888;
  margin-left: 0.125rem;
}
</style>
