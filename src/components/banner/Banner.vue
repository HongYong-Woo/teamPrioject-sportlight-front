<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import img1 from '@/assets/banner/banner1.png';
import img2 from '@/assets/banner/banner2.png';
import img3 from '@/assets/banner/banner3.png';
import img4 from '@/assets/banner/semi-banner1.png'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const images = ['https://kr.object.ncloudstorage.com/sportlight/banner_event/%EB%A9%94%EC%9D%B8%20%EB%B0%B0%EB%84%88%20-%202.png'
, 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EB%A9%94%EC%9D%B8%20%EB%B0%B0%EB%84%88%20-%201.png'
, 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EB%A9%94%EC%9D%B8%EB%B0%B0%EB%84%88%20-%203.png'
, 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EB%A9%94%EC%9D%B8%EB%B0%B0%EB%84%88%20-%204.png'
, 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EB%A9%94%EC%9D%B8%20%EB%B0%B0%EB%84%88%20-%205.png'];

let currentIndex = ref(0);
const currentImage = ref(images[currentIndex.value]);

function prevImage() {
    currentIndex.value = (currentIndex.value - 1 + images.length) % images.length;
    currentImage.value = images[currentIndex.value];
}

function nextImage() {
    currentIndex.value = (currentIndex.value + 1) % images.length;
    currentImage.value = images[currentIndex.value];
}

// 자동 슬라이드 설정
let slideInterval;

onMounted(() => {
    slideInterval = setInterval(nextImage, 3000); // 3초마다 다음 이미지로
});

onUnmounted(() => {
    clearInterval(slideInterval); // 컴포넌트 언마운트 시 인터벌 정리
});
</script>

<template>
    <div class="banner-container">
        <img class="banner" :src="currentImage" alt="Banner Image">
        
        <div class="nav">
            <div class="nav-container">
                <FontAwesomeIcon :icon="faChevronLeft" @click="prevImage" class="arrow left"/>
                <div class="center">{{ currentIndex % images.length + 1 }} / {{ images.length }}</div>
                <FontAwesomeIcon :icon="faChevronRight" @click="nextImage" class="arrow right"/>
            </div>
        </div>
        
        <!-- 하단 인디케이터 -->
        <div class="indicator-container">
            <span
                v-for="(image, index) in images"
                :key="index"
                :class="['indicator', { active: index === currentIndex }]"
            ></span>
        </div>
    </div>
</template>

<style scoped>
.banner-container {
    position: absolute;
    left: 0;
    width: 100%;
    height: 400px;
    background-color: #767676;
    text-align: center;
    overflow: hidden;
}

.banner {
    height: 100%;
    width: 100%;
    object-fit: contain;
    transition: opacity 0.5s ease-in-out;
}

/* 좌우 화살표 스타일 */
.nav {
    position: absolute;
    top: 100%;
    left: 15%;
    transform: translateY(-100%);
    border: none;
    padding: 10px;
    cursor: pointer;
}

.nav-container {
    display: flex;
    height: 1.5rem;
    padding: 1rem;

    display: flex;
    align-items: center;
    border: none;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 1.25rem;
}

.arrow {
    font-size: 0.8rem;
}

.center {
    width: 3rem;
    text-align: center;
}

/* 인디케이터 스타일 */
.indicator-container {
    position: absolute;
    bottom: 10px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 5px;
}

.indicator {
    width: 8px;
    height: 8px;
    border-radius: 4px;
    background-color: rgba(0, 0, 0, 0.5);
    transition: all 0.5s;
}

.indicator.active {
    background-color: rgba(255, 255, 255, 1);
    width: 30px;
}
</style>
