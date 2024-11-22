<script setup>
import { onMounted, ref } from 'vue';
import CardList from '../components/course/CardList.vue'
import Banner from '@/components/banner/Banner.vue';
import Chatbot from '../components/course/Chatbot.vue';
import { useAPI } from '@/axios/useAPI';

const { get } = useAPI();
const courses = ref([]);
const loading = ref(true);

async function fetchCards() {
    try {
        const response = await get('/popular');  // 백엔드에서 데이터 가져오기
        courses.value = response.data;
        console.log('couses: ', courses.value);
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
    <Banner/>
    <div class="margin-banner"></div>
    <h2 class="list-title">인기 있는 클래스</h2>
    <p class="list-sub-title">사람들이 많이 찾는 클래스를 둘러보세요!</p>
    <CardList :courses="courses"/>
    <CardList/>
    <CardList/>
    <Chatbot/>
</template>

<style scoped>
.margin-banner {
    height: 400px;
}

.list-sub-title {
    color: #999;
}
</style>