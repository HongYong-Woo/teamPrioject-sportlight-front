<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import img1 from '@/assets/banner/semi-banner1.png';
import img2 from '@/assets/banner/banner2.png';
import img3 from '@/assets/banner/banner3.png';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

const images = [
    'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EB%B0%B0%EB%84%88%20-%201.png'
    , 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EB%B0%B0%EB%84%88%20-%202.png'
    , 'https://kr.object.ncloudstorage.com/sportlight/banner_event/%EC%9D%B4%EB%B2%A4%ED%8A%B8%20%EB%B0%B0%EB%84%88%20-%203.png'];
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

</script>

<template>
    <div class="semi-banner-container">
        <div class="semi-banner">
            <!-- 슬라이더 -->
            <div class="slider-wrapper" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
                <img v-for="(image, index) in images" :key="index" :src="image" alt="Banner Image" class="slider-image" />
            </div>

            <div class="nav">
                <div class="nav-container" @click="prevImage">
                    <FontAwesomeIcon :icon="faChevronLeft" class="arrow left" />
                </div>

                <div class="nav-container" @click="nextImage">
                    <FontAwesomeIcon :icon="faChevronRight" class="arrow right" />
                </div>
            </div>

            <!-- 하단 인디케이터 -->
            <div class="indicator-container">
                <span v-for="(image, index) in images" :key="index"
                    :class="['indicator', { active: index === currentIndex }]"></span>
            </div>
        </div>
    </div>
</template>

<style scoped>
.semi-banner-container {
    position: flex;
    width: 100%;
    height: 11rem;
    margin-top: 3rem;
}

.semi-banner {
    position: absolute;
    overflow: hidden;
    left: 0;
    width: 100%;
    height: 11rem;
}

.slider-wrapper {
    display: flex;
    transition: transform 0.5s ease-in-out;
}

.slider-image {
    width: 100%;
    height: 11rem;
    flex-shrink: 0;
    background-color: #d9d9d9;
    object-fit: contain;
}


/* 좌우 화살표 스타일 */
.nav {
    position: absolute;
    right: 15%;
    bottom: 10px;
    display: flex;
    border: none;
    cursor: pointer;
    gap: 0.25rem;
}

.nav-container {
    height: 1.5rem;
    padding: 1rem 0.8rem;

    display: flex;
    align-items: center;
    border: none;
    background-color: white;
    box-shadow: 1px 1px 2px gray;
    border-radius: 0.25rem;
}

.arrow {
    font-size: 1rem;
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
