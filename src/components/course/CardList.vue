<!-- src/components/CardList.vue -->
<script setup>
import { ref, onMounted } from 'vue';
import Card from './CourseCard.vue';
import { useAPI } from '@/axios/useAPI';

const { get } = useAPI();
const cards = ref([]);
const loading = ref(true);

async function fetchCards() {
    try {
        const response = await get('/courses/popular');  // 백엔드에서 데이터 가져오기
        cards.value = response.data;
    } catch (error) {
        console.error("Failed to fetch cards:", error);
    } finally {
        loading.value = false;
    }
}

function handleCardButtonClick(cardId) {
    console.log(`Button clicked on card ID: ${cardId}`);
}

onMounted(fetchCards);
</script>

<template>
    <h2 class="list-title">인기 있는 클래스</h2>
    <p class="list-sub-title">사람들이 많이 찾는 클래스를 둘러보세요!</p>
    <div class="card-list-container">
        <div v-if="loading" class="loading">Loading...</div>
        <div v-else class="card-list">
            <Card v-for="card in cards" :key="card.id" :nickname="card.nickname" :title="card.title"
                :address="card.address" :tuition="card.tuition" :discountRate="card.discountRate" :time="card.time"
                :level="card.level" :category="card.category" :rating="card.rating" :reviewCount="card.reviewCount"
                :image="card.image" @button-click="handleCardButtonClick(card.id)" />
        </div>
    </div>
</template>



<style scoped>
.card-list-container {
    overflow-x: auto;
    padding: 8px;
}

.card-list {
    width: 100vw;
    display: flex;
    gap: 16px;
}

.card-list-container::-webkit-scrollbar {
    display: none;
}

.list-sub-title {
    color: #999;
}

.loading {
    text-align: center;
    font-size: 1.5rem;
    color: gray;
}
</style>