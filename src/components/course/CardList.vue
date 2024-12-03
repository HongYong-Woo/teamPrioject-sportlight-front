<script setup>
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { ref, onMounted, onUnmounted, watch } from 'vue';
import Card from './CourseCard.vue';

const props = defineProps({
    courses: {
        type: Array,
        required: true,
        default: () => [],
    },
});

const currentIndex = ref(0);
const isAnimating = ref(false);
const interval = ref(null);

// 무한 슬라이드로 이동
const moveNext = () => {
    if (isAnimating.value) return;
    isAnimating.value = true;
    currentIndex.value++;
    setTimeout(() => {
        if (currentIndex.value === props.courses.length) {
            currentIndex.value = 0; // 첫 번째 카드로 이동
        }
        isAnimating.value = false;
    }, 500); // transition과 동일한 시간
};

const movePrev = () => {
    if (isAnimating.value) return;
    isAnimating.value = true;
    currentIndex.value--;
    setTimeout(() => {
        if (currentIndex.value < 0) {
            currentIndex.value = props.courses.length - 1; // 마지막 카드로 이동
        }
        isAnimating.value = false;
    }, 500); // transition과 동일한 시간
};

const startAutoSlide = () => {
    interval.value = setInterval(() => {
        moveNext();
    }, 5000); // 4초마다 슬라이드
};

const stopAutoSlide = () => {
    clearInterval(interval.value);
    interval.value = null;
};

onMounted(() => {
    startAutoSlide();
});

onUnmounted(() => {
    stopAutoSlide();
});

// 슬라이드가 동적으로 업데이트될 때 타이머 재시작
watch(() => props.courses, () => {
    startAutoSlide();
});
</script>

<template>
    <div class="list-wrapper">
        <div class="nav">
            <div class="nav-container">
                <FontAwesomeIcon :icon="faChevronLeft" @click="movePrev" class="arrow left"/>
                <div class="center">{{ currentIndex % courses.length + 1 }} / {{ courses.length }}</div>
                <FontAwesomeIcon :icon="faChevronRight" @click="moveNext" class="arrow right"/>
            </div>
        </div>
        <div class="card-list-container" @mouseenter="stopAutoSlide" @mouseleave="startAutoSlide">
            <!-- 카드 슬라이더 -->
            <div class="card-list"
                :style="{ transform: `translateX(-${currentIndex * 14}vw)`, transition: isAnimating ? 'transform 0.5s ease-in-out' : 'none' }">
                <!-- 카드 복제 -->
                <Card v-for="(card, index) in [...courses, ...courses]" :key="index" :id="card.id"
                    :nickname="card.nickname" :title="card.title" :address="card.address" :tuition="card.tuition"
                    :discountRate="card.discountRate" :time="card.time" :level="card.level" :category="card.category"
                    :rating="card.rating" :reviewCount="card.reviewCount" :image="card.imgUrl" class="course-card" />
            </div>
        </div>
    </div>
</template>

<style scoped>
.course-card {
    width: 14vw;
}

.list-wrapper {
    position: relative;
}

.nav {
    position: absolute;
    justify-content: end;
    right: 0;
    transform: translateY(-125%);
}

.card-list-container {
    position: relative;
    overflow: hidden;
    width: 100%;
}

.card-list {
    display: flex;
    transition: transform 0.5s ease-in-out;
    width: calc(20 * 14vw);
    /* 10개 카드의 2배 길이 */
}

.nav-container {
    display: flex;
    height: 1.5rem;
    padding: 1rem;

    display: flex;
    align-items: center;
    border: 1px solid #d9d9d9;
    border-radius: 1.25rem;
}

.arrow {
    font-size: 0.8rem;
}

.center {
    width: 3rem;
    text-align: center;
}

.card-list-container::-webkit-scrollbar {
    display: none;
}
</style>
