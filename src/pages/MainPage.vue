<script setup>
import { onMounted, ref } from 'vue';
import CardList from '../components/course/CardList.vue'
import Banner from '@/components/banner/Banner.vue';
import Chatbot from '../components/course/Chatbot.vue';
import { useAPI } from '@/axios/useAPI';
import SemiBanner from '../components/banner/SemiBanner.vue';
import ReviewList from '../components/main-page/ReviewList.vue';
import Button from '../components/common/Button.vue';
import Payment from '../components/payment/Payment.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faBookmark } from '@fortawesome/free-solid-svg-icons';
import Coupon from '../components/main-page/Coupon.vue';

const { get } = useAPI();
const popularCourses = ref([]);
const beginnerCourses = ref([]);
const loading = ref(true);

async function fetchPopularCards() {
    try {
        const response = await get('/popular');
        popularCourses.value = response.data;
        console.log(response);
    } catch (error) {
        console.error("Failed to fetch cards:", error);
    } finally {
        loading.value = false;
    }
}

async function fetchBeginnerCards() {
    try {
        const response = await get('/courses/beginner');
        beginnerCourses.value = response.data.data;
    } catch (error) {
        console.error("Failed to fetch cards:", error);
    } finally {
        loading.value = false;
    }
}

function handleCardButtonClick(cardId) {
    console.log(`Button clicked on card ID: ${cardId}`);
}

onMounted(() => {
    fetchPopularCards();
    fetchBeginnerCards();
});

function developing() {
    alert('열심히 개발 중입니다!🧑‍💻');
}

</script>

<template>
    <Banner />
    <div class="margin-banner"></div>
    <div class="title">
        <span class="list-title">인기 있는 클래스🔥</span>
        <p class="list-sub-title">사람들이 많이 찾는 클래스를 둘러보세요!</p>
    </div>
    <CardList :courses="popularCourses" />

    <div class="title">
        <span class="list-title">입문자를 위한 완벽한 시작🐣</span>
        <p class="list-sub-title">처음이라도 걱정마세요! 누구나 따라 할 수 있는 쉬운 클래스로 시작해보세요!</p>
    </div>
    <CardList :courses="beginnerCourses" />

    <ReviewList/>

    <!-- <SemiBanner /> -->

    <div class="service-wrapper">
        <div class="service-container">
            <div class="service-header-wrapper">
                <span class="service-header-title">다양한 서비스를 신청하세요.</span>
                <span class="service-header-content">스포트라이트의 지식공유자 ˙비즈니스˙ 대학생 신청방법에 대해 알아보세요.</span>
            </div>
            <div class="service-box-wrapper">
                <div class="service-box">
                    <div class="service-title-wrapper">
                        <span class="service-title">지식공유자 되기</span>
                        <span class="service-content">나의 지식을 나눠 사람들에게<br/> 배움의 기회를 주고,<br/> 의미있는 대가를 가져가세요.</span>
                    </div>
                    <Button class="service-btn">지식 공유자 참여하기</Button>
                </div>
                <div class="service-box">
                    <div class="service-title-wrapper">
                        <span class="service-title">커뮤니티 둘러보기</span>
                        <span class="service-content">커뮤니티에서 위치 기반 채팅방을 통해<br/> 이웃과 스포츠 이야기를 나누고<br/> 함께할 기회를 찾아보세요.
                        </span>
                    </div>
                    <Button class="service-btn" @click="developing">커뮤니티 참여하기</Button>
                </div>
                <div class="service-box coupon">
                    <div class="service-title-wrapper">
                        <span class="service-title">쿠폰 받기</span>
                        <span class="service-content">스포트라이트에서 제공하는 쿠폰들을<br/> 마음껏 누리세요!</span>
                    </div>
                    <Coupon/>
                </div>
            </div>
        </div>

    </div>

    <Chatbot />
</template>

<style scoped>
.margin-banner {
    height: 400px;
}

.title {
    margin-top: 3rem;
    margin-left: 0.5rem;
}

.list-title {
    font-weight: bold;
    font-size: 2rem;
}

.list-sub-title {
    color: #999;
}

.service-wrapper {
    position: flex;
    width: 100%;
    height: 32rem;
    margin-top: 3rem;
}

.service-header-title {
    font-size: 1.3rem;
    font-weight: bold;
}

.service-header-content {
    color: #999;
}

.service-container {
    position: absolute;
    display: flex;
    flex-direction: column;
    background-color: rgba(170, 170, 170, 0.1);
    height: fit-content;
    width: 100%;
    height: 32rem;
    left: 0;
    padding: 0 2rem;
    justify-content: center;
}

.service-header-wrapper {
    display: flex;
    flex-direction: column;
    padding-top: 1rem;
    padding-left: 15%;
}

.service-box-wrapper {
    display: flex;
    flex-direction: row;
    height: fit-content;
    width: 100%;
    left: 0;
    padding: 2rem;
    gap: 1rem;
    justify-content: center;
}

.service-box {
    display: flex;
    flex-direction: column;
    width: 25rem;
    background-color: white;
    height: 22rem;
    padding: 2rem 2rem 3rem 2rem;
    justify-content: space-between;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    border-radius: 0.5rem;
}

.coupon {
    padding-bottom: 1.5rem;
}

.service-title-wrapper {
    display: flex;
    flex-direction: column;
}

.service-title {
    font-size: 1.2rem;
    font-weight: bold;
}

.service-content {
    margin-top: 1rem;
    color: #999;
}

.service-btn {
    border: 1px solid #FF9300;
    background-color: white;
    color: #FF9300;
}

.service-btn:hover {
    background-color: #FF9300;
    color: white;
    transition: all 0.2s ease;
}
</style>