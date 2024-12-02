<script setup>
import { useAPI } from "@/axios/useAPI";
import router from "@/routers";
import { faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { onMounted, ref, reactive } from "vue";
import numberFormatter from '../../util/numberFormatter';
import relativeTimeFormatter from '../../util/relativeTimeFormatter';
import Button from '../../components/common/Button.vue';

const { get } = useAPI();

const reviews = ref([]);
const usersCount = ref(0);
const infiniteReviews = reactive([]); // 스크롤에 따라 추가될 리스트

// 데이터를 가져오는 함수
async function fetchReviews() {
    try {
        const response = await get('/reviews/good');
        reviews.value = response.data.data;

        // 초기 데이터 설정
        infiniteReviews.push(...reviews.value);
    } catch (error) {
        console.log('Failed to fetch reviews', error);
    }
};

async function fetchUserCount() {
    try {
        const response = await get('/users/count');
        usersCount.value = response.data.data;
    } catch (error) {
        console.log('Failed to fetch users count', error);
    }
};

// 무한 스크롤 로직
function loadMoreReviews() {
    // 기존 데이터 복제해서 추가
    infiniteReviews.push(...reviews.value);
}

// Intersection Observer 설정
function setupInfiniteScroll() {
    const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
            loadMoreReviews(); // 새로운 데이터 추가
        }
    });

    const sentinel = document.querySelector("#scroll-sentinel");
    if (sentinel) observer.observe(sentinel);
}

onMounted(() => {
    fetchReviews();
    fetchUserCount();
    setupInfiniteScroll(); // 스크롤 감지 설정
});

function goToCourseDetail(courseId) {
    router.push({ name: 'CourseDetail', params: { id: courseId } });
}

function goToCourseList() {
    router.push({ name: 'CourseList'});
}

function goToRequestCourse() {
    alert('열심히 개발 중입니다!🧑‍💻');
}
</script>
<template>
    <div class="content-wrapper">
        <div class="content-left">
            <h2 class="left-title">
                <span class="user-count">{{ numberFormatter(usersCount) }}</span> 명이<br />
                스포트라이트와 함께 합니다.
            </h2>
            <div class="left-ment">
                스포츠, 이제 쉽게 시작하세요!<br />
                해보고 싶었지만 망설이던 스포츠를<br />
                원데이 클래스로 가볍게 경험해보세요!
            </div>
            <div class="btn-container">
                <Button @click="goToCourseList">강의 둘러보기</Button>
                <Button @click="goToRequestCourse">강의 요청하기</Button>
            </div>
        </div>
        <div class="blur-overlay top"></div>
        <div class="content-right">
            <div class="list-container">
                <div v-for="(review, index) in infiniteReviews" :key="index" :id="review.courseId" class="content-item">
                    <div @click="goToCourseDetail(review.courseId)">
                        <div>
                            <span class="nickname">{{ review.userNickname }} 님</span>
                            <span class="reg-date">{{ relativeTimeFormatter(review.regDate) }}</span>
                        </div>
                        <div class="title">
                            {{ review.courseTitle }}
                            <FontAwesomeIcon :icon="faChevronRight" size="sm" />
                        </div>
                        <div class="content">{{ review.content }}</div>
                    </div>
                </div>
                <!-- 무한 스크롤 감지를 위한 sentinel -->
                <div id="scroll-sentinel"></div>
            </div>
        </div>
        <div class="blur-overlay bottom"></div>
    </div>
</template>
<style scoped>
.content-wrapper {
    position: relative;
    display: flex;
    margin-top: 3rem;
}

.content-left {
    width: 45%;
    padding-top: 2rem;
    padding-right: 5%;
}

.content-right {
    position: relative;
    width: 55%;
    height: 25rem;
    /* 고정 높이 */
    overflow-y: auto;
}

.content-right::-webkit-scrollbar {
    display: none;
}

.user-count {
    color: var(--primary-orange-color);
}

.left-ment {
    margin-top: 1.5rem;
    color: #767676;
}

.btn-container {
    display: flex;
    gap: 0.5rem;
    margin-top: 1.5rem;
}

.btn-container>Button {
    border: 1px solid #FF9300;
    background-color: white;
    color: #FF9300;
}

.btn-container>Button:hover {
    background-color: #FF9300;
    color: white;
    transition: all 0.2s ease;
}

.list-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;
    padding: 0.5rem;
}

.content-item {
    background-color: rgba(200, 200, 200, 0.1);
    padding: 0.8rem 1.3rem;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    border-radius: 0.5rem;
    border: 1px solid rgba(0, 0, 0, 0.1);
}

.nickname {
    color: #a0a0a0;
    margin-right: 0.125rem;
    font-size: 0.9rem;
}

.reg-date {
    color: #ccc;
    font-size: 0.8rem;
}

.title {
    font-size: 1.2rem;
    font-weight: 500;
    margin-top: 1rem;
}

.title:hover {
    color: #767676;
    text-decoration: underline;
}

.content {
    margin-top: 0.5rem;
}

/* Sentinel 위치 설정 */
#scroll-sentinel {
    height: 1px;
    background-color: transparent;
}

.blur-overlay {
    position: absolute;
    right: 0;
    width: 55%;
    height: 2rem;
    /* 오버레이 높이 */
    z-index: 10;
    pointer-events: none;
    /* 클릭 이벤트 막기 */
    background: linear-gradient(to bottom, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
}

.blur-overlay.bottom {
    position: absolute;
    bottom: 0;
    background: linear-gradient(to top, rgba(255, 255, 255, 0.7), rgba(255, 255, 255, 0));
}
</style>
