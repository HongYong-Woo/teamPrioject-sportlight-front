<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import img1 from '@/assets/banner/banner1.png';
import img2 from '@/assets/banner/banner2.png';
import img3 from '@/assets/banner/banner3.png';

const images = [img1, img2, img3];
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
        
        <!-- 좌우 화살표 버튼 -->
        <button class="arrow left-arrow" @click="prevImage">❮</button>
        <button class="arrow right-arrow" @click="nextImage">❯</button>
        
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
    width: 100vw;
    height: 370px;
    background-color: #f0f0f0;
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
.arrow {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: rgba(0, 0, 0, 0.2);
    color: white;
    border: none;
    padding: 10px;
    cursor: pointer;
    font-size: 24px;
}

.left-arrow {
    left: 20px;
}

.right-arrow {
    right: 20px;
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
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #aaa;
    transition: background-color 0.3s;
}

.indicator.active {
    background-color: #333;
}
</style>
